Use the event-architect, node, spring, frontend, qa, security, and docs sub-agents to design and implement a new banking use case end-to-end.

The use case should be provided as an argument (e.g. "recurring savings transfer", "account statement generation").

## Phase 1 — Event design (event-architect)

Before touching any code, design the event flow:

1. Name all new event types as past-tense business facts (PascalCase)
2. Define the full event sequence: trigger → reserve → confirm/reject → notify
3. Specify `correlationId` propagation and `causationId` chain
4. Identify which service publishes each event and which consume it
5. Define the payload structure for each new event type

Do not proceed to Phase 2 until the event design is complete and reviewed.

## Phase 2 — Contract updates (event-architect + node)

Update all four contract sources together:
1. `packages/event-contracts/src/index.ts` — add to `EVENT_TYPES`
2. `packages/event-contracts/events/envelope.schema.json` — add to `eventType` enum
3. `packages/event-contracts/events/*.schema.json` — add payload schema file per event
4. `docs/EVENTS.md` — add event entries

Run contract tests: `npm test -w packages/event-contracts`

## Phase 3 — Service implementation

Implement in this order:
1. **movement-orchestrator** (node agent) — add intake endpoint or trigger
2. **account-service** (spring agent) — add reservation/commit/credit logic
3. **Target service** (spring or node agent) — implement flow-specific logic
4. **notification-service** (node agent) — add notification event if needed
5. **web-dashboard** (frontend agent) — add action button and event display

## Phase 4 — Verification (qa + security)

- Run all tests: `make test`
- Security review: validate inputs, check idempotency, check logs
- Manual smoke: trigger the flow, trace the correlation, verify balance changes

## Phase 5 — Documentation (docs)

Update:
- `docs/EVENTS.md` if not already done in Phase 2
- `docs/ARCHITECTURE.md` if new service interactions were added
- `README.md` if new flow needs documenting
