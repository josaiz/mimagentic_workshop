Review recent git changes across the banking lab, delegating to the appropriate sub-agents based on which files changed.

## Step 1 — Get the diff

```bash
git diff HEAD~1 --name-only
```

Or if there are staged changes:
```bash
git diff --cached --name-only
git diff --name-only
```

Also show the full diff for context:
```bash
git diff HEAD~1
```

## Step 2 — Route to domain agents

Based on which files changed, coordinate review across the relevant sub-agents:

- `packages/event-contracts/**` → event-architect agent: check contract integrity and drift
- `services/movement-orchestrator/**`, `services/event-log-service/**`, `services/notification-service/**`, `services/external-transfer-service/**` → node agent
- `services/account-service/**`, `services/investment-service/**`, `services/mortgage-service/**` → spring agent
- `apps/web-dashboard/**` → frontend agent
- `infra/docker-compose.yml` → platform agent
- Any service touching events → security agent for idempotency and validation

## Step 3 — Review checklist

For each changed area, check:
1. **Behavior regressions** — does anything break existing flows?
2. **Event contract drift** — if event types changed, are all four sources updated?
3. **Architecture boundaries** — does any service reach across its boundary?
4. **Test coverage** — are new paths covered by tests?
5. **Security** — any new inputs that bypass validation? Any new log statements with sensitive data?
6. **Docs** — if events or services changed, are docs updated?

## Step 4 — Report

Produce a structured review:
```
Review Summary
==============
Files changed: N
Areas affected: [list]

Findings:
- [finding] [severity: note/warn/block]

Tests to run:
- [command]
```
