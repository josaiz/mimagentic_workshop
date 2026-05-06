#!/usr/bin/env python3
"""Generate demo banking activity through the public orchestrator API."""

from __future__ import annotations

import argparse
import json
import random
import time
from dataclasses import dataclass
from typing import Any
from urllib import request


@dataclass(frozen=True)
class Action:
    label: str
    path: str
    body: dict[str, Any]


def post(base_url: str, action: Action) -> dict[str, Any]:
    payload = json.dumps(action.body).encode("utf-8")
    req = request.Request(
        f"{base_url.rstrip('/')}{action.path}",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with request.urlopen(req, timeout=10) as response:
        result = json.loads(response.read().decode("utf-8"))
        print(f"{action.label:24} {result.get('correlationId', '-')}")
        return result


def random_action() -> Action:
    choice = random.choice(["transfer", "investment", "mortgage", "salary", "insufficient", "failed-transfer"])
    if choice == "transfer":
        return Action(
            "external-transfer",
            "/api/movements/external-transfer",
            {"amount": random.randint(25, 240), "currency": "EUR", "destinationIban": "ES00DEMO1234567890"},
        )
    if choice == "failed-transfer":
        return Action(
            "rejected-transfer",
            "/api/movements/external-transfer",
            {"amount": random.randint(25, 240), "currency": "EUR", "destinationIban": "ES00FAIL1234567890"},
        )
    if choice == "investment":
        return Action(
            "investment",
            "/api/movements/investment-contribution",
            {"amount": random.randint(10, 400), "currency": "EUR", "fundId": "fund_global_index"},
        )
    if choice == "mortgage":
        return Action(
            "mortgage",
            "/api/movements/mortgage-repayment",
            {"amount": random.randint(100, 700), "currency": "EUR", "mortgageId": "mortgage_001"},
        )
    if choice == "salary":
        return Action("salary", "/api/demo/salary", {"amount": 3200, "currency": "EUR"})
    return Action("insufficient-funds", "/api/demo/insufficient-funds", {})


def morning_scenario() -> list[Action]:
    return [
        Action("salary", "/api/demo/salary", {"amount": 3200, "currency": "EUR", "employerName": "MIM Agentic Labs"}),
        Action(
            "investment",
            "/api/movements/investment-contribution",
            {"amount": 250, "currency": "EUR", "fundId": "fund_global_index"},
        ),
        Action(
            "mortgage",
            "/api/movements/mortgage-repayment",
            {"amount": 650, "currency": "EUR", "mortgageId": "mortgage_001"},
        ),
        Action(
            "external-transfer",
            "/api/movements/external-transfer",
            {"amount": 120, "currency": "EUR", "destinationIban": "ES00DEMO1234567890"},
        ),
        Action(
            "rejected-transfer",
            "/api/movements/external-transfer",
            {"amount": 85, "currency": "EUR", "destinationIban": "ES00FAIL1234567890"},
        ),
        Action("insufficient-funds", "/api/demo/insufficient-funds", {}),
    ]


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate Agentic Banking Lab activity")
    parser.add_argument("--base-url", default="http://localhost:3001", help="movement-orchestrator base URL")
    parser.add_argument("--scenario", choices=["morning"], help="named scenario to run")
    parser.add_argument("--events", type=int, default=0, help="number of random actions to generate")
    parser.add_argument("--delay", type=float, default=0.35, help="delay between actions in seconds")
    args = parser.parse_args()

    actions: list[Action] = []
    if args.scenario == "morning":
        actions.extend(morning_scenario())
    actions.extend(random_action() for _ in range(args.events))

    if not actions:
        actions = morning_scenario()

    for action in actions:
        post(args.base_url, action)
        time.sleep(args.delay)


if __name__ == "__main__":
    main()
