# Backlog Stories

This file captures workshop-ready backlog tasks that demonstrate agent orchestration on realistic engineering work.

## Investment Hexagonal Refactor

### Ticket

```text
Refactor `investment-service` to lightweight hexagonal architecture while preserving current Kafka behavior.
```

### Why This Works For The Workshop

`investment-service` is intentionally small but meaningful. It currently has:

- an inbound Kafka consumer,
- an event handler with filtering, idempotency, policy, and publishing mixed together,
- an outbound Kafka publisher,
- deterministic event IDs and idempotency keys,
- no dedicated tests.

That makes it a good backlog story: the change is structural, behavior-preserving, and reviewable.

### Commands

Plan the work without editing files:

```text
/design-investment-hexagonal
```

Execute the refactor later in build mode:

```text
/refactor-investment-hexagonal
```

Review the final diff with the generic review command:

```text
/review-changes
```

### Acceptance Criteria

The refactor must preserve external behavior:

- consume only `AccountDebitReserved` events with `payload.movementType=INVESTMENT_FUND`;
- emit `FundContributionRequested`;
- emit `FundContributionCompleted` for amount `>= 10.00`;
- emit `FundContributionRejected` for amount `< 10.00`;
- preserve `correlationId`, `causationId`, deterministic event IDs, idempotency key behavior, producer `investment-service`, aggregate ID, payload, and topic `banking.events`;
- keep replay/duplicate handling equivalent to the current in-memory processed-event behavior.

### Target Shape

Keep the architecture lightweight:

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

### Out Of Scope

- Event contract changes.
- New Kafka topic.
- New database or persistent idempotency store.
- Production ledger.
- Real authentication or authorization.
- Kubernetes, Helm, Terraform, or schema registry.

### Verification

Run after the refactor command has edited code:

```bash
cd services/investment-service && mvn -q -Djava.version=${JAVA_TEST_VERSION:-23} test
```

Optional broader confidence:

```bash
npm test -w @agentic-banking-lab/event-contracts
make e2e
```
