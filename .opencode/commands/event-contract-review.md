---
description: Review event schemas, service emitters/consumers, dashboard assumptions, and docs for drift.
agent: contract-drift-agent
subtask: true
---

Review the current event contract surface.

Primary files:

@packages/event-contracts/src/index.ts
@packages/event-contracts/events/envelope.schema.json
@packages/event-contracts/tests/envelope.test.mjs
@docs/EVENTS.md
@tools/e2e-smoke/run.py

Current contract test result:

!`npm test -w @agentic-banking-lab/event-contracts`

Use the `contract-drift-review` and `event-driven-design` skills.

Check:

- event enum/schema/docs agreement,
- payload schema coverage,
- service publishers and consumers,
- dashboard timeline/detail assumptions,
- e2e smoke expected events,
- `eventVersion`,
- `correlationId` propagation,
- `causationId` correctness,
- replay/idempotency expectations.

Return findings first. If there is no drift, say so and list the remaining checks worth running before a workshop.
