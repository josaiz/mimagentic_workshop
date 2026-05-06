---
description: Reconstruct a real banking event timeline from event-log-service by correlation ID.
arguments: CORRELATION_ID
agent: flow-tracer-agent
subtask: true
---

Trace correlation ID: `$ARGUMENTS`

Use the `correlation-tracing` and `docker-compose-troubleshooting` skills.

First call the `banking_events` custom tool with `correlationId` set to `$ARGUMENTS`. If it fails, explain that the stack may not be running and use `banking_health` or platform diagnostics.

Return:

- ordered timeline,
- producer for each event,
- `causationId` relationship,
- amount/currency when present,
- classification as complete, rejected, waiting, or broken,
- likely service owner if something is missing,
- next diagnostic command.

If `$ARGUMENTS` is empty, fetch recent events with `banking_events` and ask the user for one correlation ID from the result.
