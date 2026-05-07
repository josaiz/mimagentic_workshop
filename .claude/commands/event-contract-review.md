Use the event-architect sub-agent to review the banking event contracts for drift across all sources.

## What to check

### 1. TypeScript enum (source of truth)
Read `packages/event-contracts/src/index.ts` and extract all values in the `EVENT_TYPES` array.

### 2. JSON envelope schema
Read `packages/event-contracts/events/envelope.schema.json` and extract the `properties.eventType.enum` array.

### 3. Documentation
Read `docs/EVENTS.md` and extract all event names listed as `` `EventTypeName` `` (backtick-wrapped).

### 4. Payload schemas
List files in `packages/event-contracts/events/` — each event type should have a corresponding `*.schema.json`.

### 5. Service publishers/consumers
Grep each service for event type strings to confirm:
```bash
rg "EVENT_TYPES\." services/ packages/ --include="*.ts" --include="*.java" -l
```

## Report format

Produce a drift report:

```
Event Contract Drift Report
===========================
TypeScript event types: N
Schema enum entries:    N
Documented in EVENTS.md: N

Missing from envelope schema: [list]
Missing from TypeScript:       [list]
Missing from docs:             [list]
Events without payload schema: [list]
```

Then run the contract tests:
```bash
npm test -w packages/event-contracts
```

Report pass/fail. If there is drift, explain what needs to be updated and in which files.
