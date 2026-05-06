---
name: testing-strategy
description: Practical testing strategy for the workshop repo.
---

# Testing Strategy Skill

## When To Use

Use this skill when planning checks for code, contracts, commands, custom tools, or demo readiness.

## Test Pyramid For This Lab

- Contract tests prove envelope and event enum behavior.
- Unit tests prove business rules and validation.
- Dashboard build catches UI/type regressions.
- Compose smoke tests prove cross-service behavior when needed.
- Manual dashboard smoke remains valid for teaching the flow.

## Procedure

1. Identify the changed surface:
   - contracts
   - Node service
   - Java service
   - dashboard
   - tooling/docs only
2. Pick the smallest meaningful checks.
3. Include at least one rejected path when money movement changes.
4. Verify event order by correlation ID for new or changed flows.
5. Document manual smoke expectations when full automation would distract from the workshop.

## Focused Commands

```bash
npm test -w @agentic-banking-lab/event-contracts
npm test -w @agentic-banking-lab/movement-orchestrator
npm test -w @agentic-banking-lab/event-log-service
npm run build -w @agentic-banking-lab/web-dashboard
cd services/account-service && mvn -q -Djava.version=${JAVA_TEST_VERSION:-23} test
cd services/investment-service && mvn -q -Djava.version=${JAVA_TEST_VERSION:-23} test
cd services/mortgage-service && mvn -q -Djava.version=${JAVA_TEST_VERSION:-23} test
python3 tools/e2e-smoke/run.py
```

## Checklist

- Contract drift is tested when event types change.
- Business rule tests cover success and rejection.
- Dashboard build runs when UI/actions/timeline change.
- Manual smoke has expected event sequence and balance delta.
- Slow checks are separated from fast checks.

## Output Format

Return:

- `Fast checks`: commands to run first.
- `Behavior scenarios`: success, rejection, replay/idempotency as needed.
- `Manual smoke`: dashboard steps and expected timeline.
- `Full gate`: when to run `make test` or `make e2e`.

## Example

For a new debit flow, prove:

- Reservation happens.
- Target service emits a terminal event.
- Account commits or releases.
- Notification appears.
- Correlation detail shows the full chain.
