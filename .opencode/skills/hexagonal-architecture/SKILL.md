---
name: hexagonal-architecture
description: Lightweight ports-and-adapters guidance for behavior-preserving refactors in the workshop lab.
---

# Hexagonal Architecture Skill

## When To Use

Use this skill when refactoring an existing service to separate domain/application logic from framework adapters.

It is especially useful for the backlog story:

```text
Refactor `investment-service` to lightweight hexagonal architecture.
```

## Procedure

1. Identify the current framework entrypoints and side effects.
2. Extract pure domain policy first.
3. Put orchestration in an application use case.
4. Define ports only for outside effects the use case needs.
5. Keep adapters thin:
   - inbound adapters translate framework input into application calls.
   - outbound adapters translate port calls into Kafka, database, HTTP, or other infrastructure.
6. Keep dependency direction inward:
   - adapters depend on application/domain.
   - application depends on domain and ports.
   - domain depends on nothing framework-specific.
7. Preserve behavior before improving names or adding features.

## Checklist

- No Spring annotation in domain policy.
- No Kafka template in the use case.
- No ObjectMapper in domain or application logic unless payload shape is deliberately part of the model.
- Ports are named by business need, not technology.
- The refactor can be explained in one diagram.
- No new persistence or production framework is added for the workshop.

## Output Format

Return:

- `Before`: current coupling.
- `After`: package layout and dependency direction.
- `Ports`: names and responsibilities.
- `Adapters`: inbound/outbound mapping.
- `Migration steps`: safe order.
- `Behavior invariants`: what must not change.

## Investment-Service Target

Use a lightweight target such as:

```text
investment/
  domain/
    InvestmentContributionPolicy
  application/
    HandleFundContributionUseCase
    port/
      InvestmentEventPublisher
      ProcessedEventTracker
  adapter/
    in/kafka/BankingEventConsumer
    out/kafka/KafkaInvestmentEventPublisher
    out/memory/InMemoryProcessedEventTracker
  model/
    BankingEvent
```
