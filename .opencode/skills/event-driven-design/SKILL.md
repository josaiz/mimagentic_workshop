---
name: event-driven-design
description: Guidance for business event design in Agentic Banking Lab.
---

# Event-Driven Design Skill

## When To Use

Use this skill when adding, reviewing, debugging, or explaining events in `banking.events`.

It is especially relevant for:

- New business flows such as card payments, fee collection, or loan disbursement.
- Renaming or adding event types.
- Changing payload shape.
- Investigating missing terminal events or duplicate derived events.

## Inputs

Gather these facts before designing:

- Business action and participant-visible outcome.
- Owning service for the action.
- Whether account funds are credited, reserved, committed, released, or rejected.
- Expected dashboard action and event timeline.
- Existing event names in `packages/event-contracts/src/index.ts` and `docs/EVENTS.md`.

## Procedure

1. Name events as PascalCase business facts, for example `MortgageRepaymentCompleted`.
2. Keep start events distinct from terminal facts.
3. Preserve the envelope:
   - `eventVersion` is present.
   - `correlationId` follows the full flow.
   - `causationId` points to the event that caused each derived event.
   - Kafka message key is `correlationId`.
4. Design payloads for consumers and the dashboard, not for database tables.
5. Decide idempotency before implementation:
   - Start events may use request-derived or generated idempotency keys.
   - Replay-driven events should use deterministic event IDs where existing services already do.
6. Update all verified contract sources together:
   - `packages/event-contracts/src/index.ts`
   - `packages/event-contracts/events/envelope.schema.json`
   - payload schemas under `packages/event-contracts/events/`
   - `packages/event-contracts/tests/envelope.test.mjs`
   - `docs/EVENTS.md`

## Checklist

- Event name is a fact, not a command.
- Event payload has only the fields needed by consumers.
- Correlation and causation form a readable chain.
- Rejected paths are first-class, not exceptions hidden in logs.
- Notification behavior is explicit for terminal user-facing outcomes.
- Dashboard can show the flow without special-case mystery.

## Output Format

Return:

- `Event sequence`: ordered event names, producers, and causation.
- `Payload shape`: important fields and why consumers need them.
- `Contract updates`: exact sources that must change.
- `Replay/idempotency`: deterministic IDs or keys required.
- `Open questions`: only questions that change event semantics.

## Example

For an external transfer:

```text
MoneyMovementRequested -> AccountDebitReserved -> ExternalTransferRequested
-> ExternalTransferCompleted -> AccountDebitCommitted -> NotificationCreated
```

For an external transfer rejected by the target service:

```text
MoneyMovementRequested -> AccountDebitReserved -> ExternalTransferRequested
-> ExternalTransferRejected -> AccountDebitReleased -> NotificationCreated
```
