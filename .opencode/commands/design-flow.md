---
description: Design a new banking flow without implementing it.
arguments: USE_CASE
agent: event-architect-agent
subtask: true
---

Design this use case without editing files: `$ARGUMENTS`

Use:

- `event-driven-design`
- `service-boundaries`
- `banking-domain`
- `testing-strategy`
- `frontend-visualization`
- `security-review`

Ground the design in:

@packages/event-contracts/src/index.ts
@docs/EVENTS.md
@services/movement-orchestrator/src/flows.ts
@apps/web-dashboard/app/page.tsx

Return a decision-complete design:

- business goal and lab-safe scope,
- owning service and state boundary,
- event sequence with producers and causation,
- payload fields and schemas to touch,
- orchestrator/dashboard changes,
- success and rejected paths,
- idempotency and replay expectations,
- focused tests and manual smoke,
- docs updates.

Do not implement. This command is for teaching Plan-mode design before Build-mode execution.
