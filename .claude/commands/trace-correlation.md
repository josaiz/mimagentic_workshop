Use the event-architect and data sub-agents to reconstruct and explain the full event timeline for a correlation ID.

The correlation ID should be provided as an argument to this command.

## Step 1 — Fetch the timeline

```bash
curl -s "http://localhost:3002/api/events/correlation/$ARGUMENTS" | jq .
```

If no correlation ID was provided, first fetch recent events to find one:
```bash
curl -s "http://localhost:3002/api/events?limit=20" | jq '[.[].correlationId] | unique'
```
Then ask the user which one to trace, or pick the most recent.

## Step 2 — Reconstruct the causal chain

Order events by `causationId` chain (not just timestamp):
- Start with the root event (no `causationId`, or `causationId` == null)
- Then find events whose `causationId` matches that root's `eventId`
- Continue recursively

## Step 3 — Classify the flow

Identify the flow type from the first event type:
- `SalaryStarted` → salary payment flow
- `ExternalTransferStarted` → external transfer flow
- `InvestmentContributionStarted` → investment contribution flow
- `MortgageRepaymentStarted` → mortgage repayment flow

## Step 4 — Report

Present the timeline as a numbered sequence:

```
Flow: Salary Payment
Correlation ID: corr-xxx-yyy
Status: COMPLETED / REJECTED / IN PROGRESS

1. SalaryStarted          (movement-orchestrator) → causation: [root]
2. FundsReserved          (account-service)        → causation: event 1
3. SalaryReceived         (account-service)        → causation: event 2
4. SalaryNotificationSent (notification-service)   → causation: event 3
```

Flag if the flow is missing a terminal event (suggesting a service is stuck or down). Suggest which service to check if a step is missing.
