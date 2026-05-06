#!/usr/bin/env python3
"""Strict end-to-end smoke test for the local Agentic Banking Lab stack."""

from __future__ import annotations

import argparse
import json
import sys
import time
from dataclasses import dataclass
from decimal import Decimal
from typing import Any
from urllib import error, request


ACCOUNT_ID = "acc_main_001"
DETERMINISTIC_BALANCE_DELTA = Decimal("2180")
TERMINAL_ACCOUNT_EVENTS = {
    "AccountCredited",
    "AccountDebitCommitted",
    "AccountDebitRejected",
    "AccountDebitReleased",
}


@dataclass(frozen=True)
class Endpoint:
    name: str
    url: str
    expect_text: str | None = None


@dataclass(frozen=True)
class Flow:
    label: str
    path: str
    body: dict[str, Any]
    expected_events: set[str]


class SmokeFailure(RuntimeError):
    """Readable error raised when the smoke test cannot prove the platform is healthy."""


def read_json(url: str, timeout: float) -> Any:
    req = request.Request(url, headers={"Accept": "application/json"})
    with request.urlopen(req, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def read_text(url: str, timeout: float) -> str:
    req = request.Request(url, headers={"Accept": "text/html,application/json"})
    with request.urlopen(req, timeout=timeout) as response:
        return response.read().decode("utf-8", errors="replace")


def post_json(url: str, body: dict[str, Any], timeout: float) -> Any:
    payload = json.dumps(body).encode("utf-8")
    req = request.Request(
        url,
        data=payload,
        headers={"Accept": "application/json", "Content-Type": "application/json"},
        method="POST",
    )
    with request.urlopen(req, timeout=timeout) as response:
        return json.loads(response.read().decode("utf-8"))


def wait_for_endpoint(endpoint: Endpoint, deadline: float, request_timeout: float) -> None:
    last_error = "not attempted"
    while time.time() < deadline:
        try:
            body = read_text(endpoint.url, request_timeout)
            if endpoint.expect_text and endpoint.expect_text not in body:
                last_error = f"response did not include {endpoint.expect_text!r}"
            else:
                print(f"health ok  {endpoint.name}")
                return
        except (error.URLError, TimeoutError, OSError) as exc:
            last_error = str(exc)
        time.sleep(1)
    raise SmokeFailure(f"{endpoint.name} did not become healthy at {endpoint.url}: {last_error}")


def decimal_field(data: dict[str, Any], field: str) -> Decimal:
    try:
        return Decimal(str(data[field]))
    except KeyError as exc:
        raise SmokeFailure(f"Account response is missing {field!r}: {data}") from exc


def fetch_correlation_events(event_log_url: str, correlation_id: str, request_timeout: float) -> list[dict[str, Any]]:
    events = read_json(f"{event_log_url}/api/events/correlation/{correlation_id}", request_timeout)
    if not isinstance(events, list):
        raise SmokeFailure(f"Expected event list for correlation {correlation_id}, got: {events}")
    return events


def wait_for_events(
    event_log_url: str,
    label: str,
    correlation_id: str,
    expected_events: set[str],
    deadline: float,
    request_timeout: float,
) -> list[dict[str, Any]]:
    last_seen: set[str] = set()
    while time.time() < deadline:
        events = fetch_correlation_events(event_log_url, correlation_id, request_timeout)
        last_seen = {str(event.get("eventType")) for event in events}
        if expected_events.issubset(last_seen):
            return events
        time.sleep(1)

    missing = ", ".join(sorted(expected_events - last_seen)) or "none"
    seen = ", ".join(sorted(last_seen)) or "none"
    raise SmokeFailure(
        f"{label} correlation {correlation_id} did not reach expected events; "
        f"missing [{missing}], seen [{seen}]"
    )


def deterministic_flows() -> list[Flow]:
    return [
        Flow(
            "salary",
            "/api/demo/salary",
            {"amount": 3200, "currency": "EUR", "employerName": "MIM Agentic Labs"},
            {"SalaryReceived", "AccountCredited", "NotificationCreated"},
        ),
        Flow(
            "investment",
            "/api/movements/investment-contribution",
            {"amount": 250, "currency": "EUR", "fundId": "fund_global_index"},
            {
                "MoneyMovementRequested",
                "AccountDebitReserved",
                "FundContributionRequested",
                "FundContributionCompleted",
                "AccountDebitCommitted",
                "NotificationCreated",
            },
        ),
        Flow(
            "mortgage",
            "/api/movements/mortgage-repayment",
            {"amount": 650, "currency": "EUR", "mortgageId": "mortgage_001"},
            {
                "MoneyMovementRequested",
                "AccountDebitReserved",
                "MortgageRepaymentRequested",
                "MortgageRepaymentCompleted",
                "AccountDebitCommitted",
                "NotificationCreated",
            },
        ),
        Flow(
            "external-transfer",
            "/api/movements/external-transfer",
            {"amount": 120, "currency": "EUR", "destinationIban": "ES00DEMO1234567890"},
            {
                "MoneyMovementRequested",
                "AccountDebitReserved",
                "ExternalTransferRequested",
                "ExternalTransferCompleted",
                "AccountDebitCommitted",
                "NotificationCreated",
            },
        ),
        Flow(
            "rejected-transfer",
            "/api/movements/external-transfer",
            {"amount": 85, "currency": "EUR", "destinationIban": "ES00FAIL1234567890"},
            {
                "MoneyMovementRequested",
                "AccountDebitReserved",
                "ExternalTransferRequested",
                "ExternalTransferRejected",
                "AccountDebitReleased",
                "NotificationCreated",
            },
        ),
        Flow(
            "insufficient-funds",
            "/api/demo/insufficient-funds",
            {},
            {"MoneyMovementRequested", "AccountDebitRejected", "NotificationCreated"},
        ),
    ]


def accepted_correlation(response: Any, label: str) -> str:
    if not isinstance(response, dict) or not response.get("accepted") or not response.get("correlationId"):
        raise SmokeFailure(f"{label} was not accepted by movement-orchestrator: {response}")
    return str(response["correlationId"])


def run(args: argparse.Namespace) -> None:
    endpoints = [
        Endpoint("web-dashboard", args.dashboard_url, "Agentic Banking Lab"),
        Endpoint("movement-orchestrator", f"{args.orchestrator_url}/health"),
        Endpoint("account-service", f"{args.account_url}/health"),
        Endpoint("event-log-service", f"{args.event_log_url}/health"),
        Endpoint("mortgage-service", f"{args.mortgage_url}/health"),
        Endpoint("investment-service", f"{args.investment_url}/health"),
        Endpoint("external-transfer-service", f"{args.external_transfer_url}/health"),
        Endpoint("notification-service", f"{args.notification_url}/health"),
    ]
    for endpoint in endpoints:
        wait_for_endpoint(endpoint, time.time() + args.health_timeout, args.request_timeout)

    baseline = read_json(f"{args.account_url}/accounts/{args.account_id}", args.request_timeout)
    baseline_available = decimal_field(baseline, "availableBalance")
    print(f"baseline  available={baseline_available} reserved={baseline.get('reservedBalance')}")

    correlations: list[tuple[Flow, str]] = []
    for flow in deterministic_flows():
        response = post_json(f"{args.orchestrator_url}{flow.path}", flow.body, args.request_timeout)
        correlation_id = accepted_correlation(response, flow.label)
        correlations.append((flow, correlation_id))
        print(f"accepted  {flow.label:20} correlation={correlation_id}")
        time.sleep(args.action_delay)

    events_deadline = time.time() + args.events_timeout
    for flow, correlation_id in correlations:
        events = wait_for_events(
            args.event_log_url,
            flow.label,
            correlation_id,
            flow.expected_events,
            events_deadline,
            args.request_timeout,
        )
        event_types = ", ".join(sorted({str(event.get("eventType")) for event in events}))
        print(f"events ok {flow.label:20} count={len(events):2d} types={event_types}")

    account_after = read_json(f"{args.account_url}/accounts/{args.account_id}", args.request_timeout)
    available_after = decimal_field(account_after, "availableBalance")
    reserved_after = decimal_field(account_after, "reservedBalance")
    expected_available = baseline_available + DETERMINISTIC_BALANCE_DELTA
    if available_after != expected_available:
        raise SmokeFailure(
            f"Unexpected available balance: expected {expected_available}, got {available_after}; "
            f"account={account_after}"
        )
    if reserved_after != Decimal("0"):
        raise SmokeFailure(f"Expected reservedBalance 0 after terminal flows, got {reserved_after}; account={account_after}")
    print(f"balance ok available={available_after} reserved={reserved_after}")

    random_response = post_json(f"{args.orchestrator_url}/api/demo/random-activity", {}, args.request_timeout)
    random_correlation = accepted_correlation(random_response, "random-activity")
    print(f"accepted  {'random-activity':20} correlation={random_correlation}")

    random_deadline = time.time() + args.events_timeout
    last_random_types: set[str] = set()
    while time.time() < random_deadline:
        events = fetch_correlation_events(args.event_log_url, random_correlation, args.request_timeout)
        last_random_types = {str(event.get("eventType")) for event in events}
        if last_random_types & TERMINAL_ACCOUNT_EVENTS:
            print(f"random ok types={', '.join(sorted(last_random_types))}")
            print("E2E_SMOKE_OK")
            return
        time.sleep(1)

    seen = ", ".join(sorted(last_random_types)) or "none"
    terminal = ", ".join(sorted(TERMINAL_ACCOUNT_EVENTS))
    raise SmokeFailure(
        f"random-activity correlation {random_correlation} did not reach an account terminal state; "
        f"expected one of [{terminal}], seen [{seen}]"
    )


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Run a strict Agentic Banking Lab end-to-end smoke test.")
    parser.add_argument("--dashboard-url", default="http://localhost:3000")
    parser.add_argument("--orchestrator-url", default="http://localhost:3001")
    parser.add_argument("--event-log-url", default="http://localhost:3002")
    parser.add_argument("--notification-url", default="http://localhost:3003")
    parser.add_argument("--external-transfer-url", default="http://localhost:3004")
    parser.add_argument("--account-url", default="http://localhost:8081")
    parser.add_argument("--mortgage-url", default="http://localhost:8082")
    parser.add_argument("--investment-url", default="http://localhost:8083")
    parser.add_argument("--account-id", default=ACCOUNT_ID)
    parser.add_argument("--health-timeout", type=float, default=90)
    parser.add_argument("--events-timeout", type=float, default=60)
    parser.add_argument("--request-timeout", type=float, default=10)
    parser.add_argument("--action-delay", type=float, default=0.2)
    return parser.parse_args()


def main() -> int:
    try:
        run(parse_args())
    except SmokeFailure as exc:
        print(f"E2E_SMOKE_FAILED: {exc}", file=sys.stderr)
        return 1
    except (error.URLError, TimeoutError, OSError, json.JSONDecodeError) as exc:
        print(f"E2E_SMOKE_FAILED: unexpected transport or JSON error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
