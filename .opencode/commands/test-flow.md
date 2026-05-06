---
description: Suggest or run tests for a named flow.
arguments: FLOW_NAME
agent: qa-agent
subtask: true
---

Flow under test: `$ARGUMENTS`

Use `@qa-agent`, `testing-strategy`, `correlation-tracing`, and `contract-drift-review`.

Identify:

- expected event sequence,
- relevant services,
- relevant tests,
- manual dashboard smoke path,
- likely account balance effect,
- rejected path if applicable.

Reference stable flow expectations:

@tools/e2e-smoke/run.py
@docs/EVENTS.md

Prefer focused checks first. Useful commands include:

```bash
npm test -w @agentic-banking-lab/event-contracts
npm test -w @agentic-banking-lab/movement-orchestrator
npm test -w @agentic-banking-lab/event-log-service
npm run build -w @agentic-banking-lab/web-dashboard
make up
make demo-data
python3 tools/e2e-smoke/run.py
```

For a flow such as `mortgage-repayment`, show which events should appear in order and where balance changes should be visible.

If the user provides a correlation ID instead of a flow name, use the `banking_events` custom tool and classify the real timeline.
