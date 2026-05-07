# Backlog Stories

This file captures workshop-ready backlog tasks that demonstrate agent orchestration on realistic engineering work.

## Backlog Intake Flow

Paste a Miro/Jira-style task into the intake command:

```text
/prepare-backlog-task "TASK-97 Add a Money Allocation chart to the dashboard"
```

The `backlog-task-agent` should:

- parse the task;
- inspect the repo;
- reuse existing agents and skills where possible;
- create one or two development commands;
- prefix command names and filenames with the task ID when present, for example `TASK-98` -> `/task-98-add-account-spending-power-endpoint`;
- update this file with acceptance criteria;
- leave product implementation for the generated command.

Use `/review-changes` after any generated development command has made code changes.

## Dashboard Money Allocation Chart

### Ticket

```text
TASK-97
Add a “Money Allocation” chart to the dashboard.

As a workshop user, I want to see a demo allocation chart split between cash, completed investment contributions, and completed mortgage repayments, so I can understand the financial picture created by the event stream.
```

### Why This Works For The Workshop

This is a small visual frontend task. It demonstrates how agents can inspect existing dashboard state, reuse loaded events, and add a chart without introducing a charting dependency.

### Suggested Intake

```text
/prepare-backlog-task "TASK-97 Add a Money Allocation chart to the dashboard. Show Cash from availableBalance, Investments from FundContributionCompleted events, and Mortgage from MortgageRepaymentCompleted events. Do not add a charting library."
```

Expected generated command:

```text
/task-97-add-dashboard-allocation-chart
```

### Acceptance Criteria

- Show a visible `Money Allocation` panel on the dashboard.
- Use `account.availableBalance` for Cash.
- Sum loaded `FundContributionCompleted` events for Investments.
- Sum loaded `MortgageRepaymentCompleted` events for Mortgage.
- Use existing dashboard events and account state.
- Avoid external chart libraries; use React/CSS.
- Keep the dashboard responsive.

### Out Of Scope

- Real net-worth calculation.
- Persisted investment or mortgage balances.
- New backend endpoints.
- New event contracts.

### Verification

```bash
npm run build -w @agentic-banking-lab/web-dashboard
```

## Account Spending Power Endpoint

### Ticket

```text
TASK-98
Create a spending power endpoint in account-service.

As a workshop user, I want to check whether an account can reserve a requested amount before starting a movement, so I can understand how available funds are validated.
```

### Why This Works For The Workshop

This is a small backend task. It exercises Spring controller design, validation, reuse of `AccountRules.canReserve`, and focused tests without changing Kafka contracts.

### Suggested Intake

```text
/prepare-backlog-task "TASK-98 Create GET /accounts/{accountId}/spending-power?amount=120&currency=EUR in account-service. Reuse AccountRules.canReserve and return whether funds are available."
```

Expected generated command:

```text
/task-98-add-account-spending-power-endpoint
```

### Acceptance Criteria

- Add `GET /accounts/{accountId}/spending-power?amount=120&currency=EUR`.
- Return `accountId`, `currency`, `requestedAmount`, `availableBalance`, `canReserve`, and `reason`.
- Use `AVAILABLE_FUNDS` when the reservation can be made.
- Use `INSUFFICIENT_FUNDS` when the balance does not cover the amount.
- Return `404` when the account does not exist.
- Validate positive amount and currency `EUR`.
- Reuse `AccountRules.canReserve`.

### Out Of Scope

- Reserving money.
- Publishing events.
- Changing account schema.
- Supporting currencies other than `EUR`.

### Verification

```bash
cd services/account-service && mvn -q -Djava.version=${JAVA_TEST_VERSION:-23} test
```

## Investment Hexagonal Refactor

### Ticket

```text
TASK-99
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
/task-99-design-investment-hexagonal
```

Execute the refactor later in build mode:

```text
/task-99-refactor-investment-hexagonal
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
