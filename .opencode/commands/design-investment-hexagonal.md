---
description: Design the backlog story for refactoring investment-service to lightweight hexagonal architecture without editing code.
agent: workshop-agent
subtask: true
---

Backlog story:

```text
Refactor `investment-service` to a lightweight hexagonal architecture while preserving current Kafka behavior.
```

Ground the design in the current service:

@services/investment-service/src/main/java/com/agenticbanking/investment/service/InvestmentEventHandler.java
@services/investment-service/src/main/java/com/agenticbanking/investment/service/EventPublisher.java
@services/investment-service/src/main/java/com/agenticbanking/investment/kafka/BankingEventConsumer.java
@services/investment-service/src/main/java/com/agenticbanking/investment/model/BankingEvent.java
@services/investment-service/pom.xml

Use these agents:

- `@hexagonal-architecture-agent` for target package layout, ports/adapters, dependency direction, and migration steps.
- `@spring-agent` for Spring Boot component wiring, constructor injection, Kafka listener/publisher placement, and official Spring docs checks when useful.
- `@qa-agent` for focused tests.
- `@security-agent` for replay/idempotency and logging risk.

Use these skills:

- `hexagonal-architecture`
- `spring-boot-components`
- `legacy-refactor-safety`
- `testing-strategy`
- `security-review`

Return a decision-complete plan only. Do not edit files.

Required output:

- `Current coupling`: where the current service mixes adapter, use case, policy, and publishing.
- `Target package layout`: lightweight, explicit packages under `com.agenticbanking.investment`.
- `Ports and adapters`: inbound Kafka adapter, outbound event publisher port/adapter, processed-event tracker port/adapter.
- `Behavior preservation`: exact event types, amount threshold, idempotency seed, deterministic event IDs, causation, producer, aggregate ID, and topic invariants.
- `Refactor sequence`: safe edit order that keeps compilation recoverable.
- `Tests`: focused unit tests and Maven command.
- `Out of scope`: no event contract changes, no persistence, no new broker topic, no production architecture template.
