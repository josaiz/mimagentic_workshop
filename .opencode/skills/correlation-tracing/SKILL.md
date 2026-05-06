---
name: correlation-tracing
description: Procedure for reconstructing banking event timelines by correlation ID and diagnosing missing terminal events.
---

# Correlation Tracing Skill

## When To Use

Use this skill when a user provides a correlation ID, asks why a flow is stuck, or wants to explain the event timeline.

## Inputs

- Correlation ID, if available.
- Flow name, if no correlation ID is available.
- Event-log URL, default `http://localhost:3002`.
- Service health, if the stack is running.

## Procedure

1. Fetch events by correlation:

```text
GET http://localhost:3002/api/events/correlation/<correlationId>
```

2. If no correlation ID is provided, fetch recent events:

```text
GET http://localhost:3002/api/events?limit=100
```

3. Sort events by `occurredAt`.
4. Check each event:
   - `eventType`
   - `producer`
   - `correlationId`
   - `causationId`
   - `payload.movementType`
   - amount/currency
5. Classify the flow:
   - `complete`: terminal target/account/notification events present.
   - `rejected`: rejection and release/rejection events present.
   - `waiting`: start/reservation exists but no terminal event yet.
   - `broken`: expected derived event is missing after service should have processed it.
6. Identify the likely owning service for the missing event.

## Expected Flow Shapes

- Salary: `SalaryReceived -> AccountCredited -> NotificationCreated`
- Investment: `MoneyMovementRequested -> AccountDebitReserved -> FundContributionRequested -> FundContributionCompleted|Rejected -> AccountDebitCommitted|Released -> NotificationCreated`
- Mortgage: `MoneyMovementRequested -> AccountDebitReserved -> MortgageRepaymentRequested -> MortgageRepaymentCompleted|Rejected -> AccountDebitCommitted|Released -> NotificationCreated`
- External transfer: `MoneyMovementRequested -> AccountDebitReserved -> ExternalTransferRequested -> ExternalTransferCompleted|Rejected -> AccountDebitCommitted|Released -> NotificationCreated`
- Insufficient funds: `MoneyMovementRequested -> AccountDebitRejected -> NotificationCreated`

## Output Format

Return:

- `Timeline`: numbered events with producer and causation.
- `Classification`: complete, rejected, waiting, or broken.
- `Missing/odd events`: exact gaps.
- `Likely owner`: service and next log command.
- `Dashboard note`: what the participant should see.
