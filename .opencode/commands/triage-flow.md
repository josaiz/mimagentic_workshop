---
description: Diagnose a broken or incomplete named banking flow.
arguments: FLOW_NAME
agent: workshop-agent
---

Triage flow: `$ARGUMENTS`

Use `@flow-tracer-agent`, `@platform-agent`, `@event-architect-agent`, and the owning service agent.

Start with project-specific tools:

- `banking_health` for service health.
- `banking_events` for recent events.
- `banking_contractCatalog` for contract drift if event names look wrong.

Then classify the issue:

- platform not running,
- orchestrator did not accept the action,
- account reservation/rejection problem,
- target service did not emit terminal events,
- account did not commit/release,
- notification missing,
- dashboard/SSE display problem,
- contract/docs/test drift.

Return:

- `Observed symptom`
- `Most likely owner`
- `Evidence`
- `Next command/tool`
- `Suggested fix path`

Do not edit files unless the user explicitly asks to fix the issue after triage.
