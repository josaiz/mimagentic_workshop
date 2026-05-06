---
description: Execute the backlog story that refactors investment-service to lightweight hexagonal architecture.
agent: workshop-agent
---

Backlog story:

```text
Refactor `investment-service` to a lightweight hexagonal architecture while preserving current Kafka behavior.
```

Hard scope boundary:

- Edit only `services/investment-service`.
- Do not change event contracts, dashboard, orchestrator, Docker Compose, or other services.
- Do not add a database, schema registry, production ledger, new topic, real auth, Kubernetes, Helm, or Terraform.

Before editing, ask `@hexagonal-architecture-agent` and `@spring-agent` to agree on the package layout and Spring component wiring.

Target architecture:

- Domain policy for the investment contribution decision.
- Application use case for handling eligible fund contribution reservation events.
- Inbound Kafka adapter that deserializes `BankingEvent` and invokes the use case.
- Outbound event publisher port plus Kafka adapter.
- Processed-event tracker port plus in-memory adapter.
- Focused unit tests for completed, rejected, ignored, and duplicate events.

Behavior to preserve exactly:

- consume only `AccountDebitReserved` with `payload.movementType=INVESTMENT_FUND`;
- emit `FundContributionRequested`;
- emit `FundContributionCompleted` for amount `>= 10.00`;
- emit `FundContributionRejected` for amount `< 10.00`;
- preserve `correlationId`, `causationId`, deterministic event IDs, idempotency key behavior, producer `investment-service`, aggregate ID, payload, and topic `banking.events`;
- keep current replay idempotency semantics.

Use these skills:

- `hexagonal-architecture`
- `spring-boot-components`
- `legacy-refactor-safety`
- `testing-strategy`
- `security-review`

Verification:

```bash
cd services/investment-service && mvn -q -Djava.version=${JAVA_TEST_VERSION:-23} test
```

After implementation, run `/review-changes` for generic PR-style review. Do not create an investment-specific review command.
