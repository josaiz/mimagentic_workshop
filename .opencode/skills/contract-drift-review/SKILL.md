---
name: contract-drift-review
description: Checklist for comparing event enums, JSON schemas, payload schemas, service code, tests, dashboard assumptions, and docs.
---

# Contract Drift Review Skill

## When To Use

Use this skill after any event, payload, or business flow change, and during `/event-contract-review`.

## Sources Of Truth

Check these together:

- `packages/event-contracts/src/index.ts`
- `packages/event-contracts/events/envelope.schema.json`
- `packages/event-contracts/events/*-payload.schema.json`
- `packages/event-contracts/tests/envelope.test.mjs`
- Node and Java service publishers/consumers.
- `apps/web-dashboard/app/page.tsx`
- `docs/EVENTS.md`
- `tools/e2e-smoke/run.py` when full-flow expectations change.

## Procedure

1. Build a set of event types from TypeScript contracts.
2. Build a set of event types from envelope JSON schema.
3. Build a set of documented event types from `docs/EVENTS.md`.
4. Search service code for emitted and consumed event string literals.
5. Search dashboard code for action paths and event rendering assumptions.
6. Compare sets and classify drift:
   - missing from schema blocks validation.
   - missing from docs hurts the workshop.
   - missing from tests allows regressions.
   - service-only events create runtime ambiguity.
7. Recommend the owner agent and verification command.

## Checklist

- New event names are in all verified sources.
- Payload schema matches actual payload fields.
- Envelope tests cover enum/schema behavior.
- Docs show the event in the correct flow.
- E2E smoke expected events are updated for stable flows.

## Output Format

Return:

- `Drift table`: item, missing source, impact.
- `Required fixes`: grouped by contract, service, dashboard, docs, tests.
- `Verification`: exact command.
- `Workshop note`: what this demonstrates about agentic coordination.
