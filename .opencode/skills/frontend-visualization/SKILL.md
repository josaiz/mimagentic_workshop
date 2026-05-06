---
name: frontend-visualization
description: Guidance for visualizing asynchronous event flows in the dashboard.
---

# Frontend Visualization Skill

## When To Use

Use this skill when changing `apps/web-dashboard`, adding a flow action, or explaining event timelines.

## Inputs

- Orchestrator endpoint path and request body.
- Expected event sequence.
- Account balance effect.
- Rejected/terminal states.
- Fields participants need to inspect live.

## Procedure

1. Keep the dashboard operational and dense enough for repeated demo use.
2. Show the participant the async system:
   - action buttons
   - service health
   - account summary
   - event timeline
   - producer
   - correlation ID
   - causation ID
   - selected flow detail JSON
3. Use badges and tone to differentiate requested, reserved, completed, credited, rejected, and default events.
4. Avoid a large UI library unless it improves the workshop materially.
5. Keep failures visible rather than hiding them behind generic toast text.

## Checklist

- New flow has a trigger or a clear reason not to expose one.
- Timeline shows all new event types with understandable tone.
- Correlation detail needs no extra tooling to explain the flow.
- Empty/loading states remain clear.
- `npm run build -w @agentic-banking-lab/web-dashboard` is part of verification.

## Output Format

Return:

- `Participant action`: what they click.
- `Expected timeline`: event names in order.
- `Visual state`: badges, balance, detail panel.
- `Build check`: command and expected outcome.

## Example

For insufficient funds, the participant should see `MoneyMovementRequested`, then `AccountDebitRejected`, then `NotificationCreated`, with no reserved balance left behind.
