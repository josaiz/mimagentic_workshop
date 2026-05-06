---
description: Design and implement a new banking use case across contracts, services, frontend, tests, and docs.
arguments: USE_CASE
agent: workshop-agent
---

Use case request: `$ARGUMENTS`

Ground yourself in the current contracts and flows:

@packages/event-contracts/src/index.ts
@packages/event-contracts/events/envelope.schema.json
@docs/EVENTS.md
@apps/web-dashboard/app/page.tsx
@services/movement-orchestrator/src/index.ts
@services/movement-orchestrator/src/flows.ts

Workflow:

1. Load/apply `agentic-workflow-design`, `event-driven-design`, `service-boundaries`, `banking-domain`, `testing-strategy`, and `workshop-facilitation`.
2. Ask `@event-architect-agent` for the event sequence, payload shape, owner service, idempotency, causation, and docs/test impact.
3. Ask the implementation agents that own the affected surfaces:
   - `@node-agent` for orchestrator, event-log, notification, external-transfer, and contracts.
   - `@spring-agent` for account, mortgage, or investment behavior.
   - `@frontend-agent` for dashboard actions and timeline/detail.
4. Ask `@qa-agent` for the smallest useful verification plan.
5. Ask `@security-agent` for validation, replay, logging, and demo-scope risks.
6. Ask `@docs-agent` for documentation updates and facilitator explanation.

Before implementing, present a compact design with:

- event names and producers,
- payload additions,
- owning service and state boundary,
- affected HTTP APIs,
- dashboard action/timeline/detail behavior,
- focused tests and manual smoke path,
- docs and OpenCode asset updates.

If the current agent is in build mode and the design is clear, implement the chosen design end to end. Keep the lab scope: no real auth, no Kubernetes, no Terraform, no production ledger, no distributed transaction system.
