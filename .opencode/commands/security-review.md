---
description: Review validation, secrets, replay, logs, and financial risks.
agent: security-agent
subtask: true
---

Current changed files:

!`git status --short`

Use `@security-agent` guidance and the `security-review` skill.

Review:

- input validation,
- currency and amount handling,
- idempotency and replay behavior,
- sensitive data in logs,
- secrets in repo,
- Docker/network exposure,
- production concerns intentionally omitted from the lab.

Ground the review in:

@AGENTS.md
@infra/docker-compose.yml
@services/movement-orchestrator/src/validation.ts
@services/account-service/src/main/java/com/agenticbanking/account/service/AccountRules.java
@services/account-service/src/main/java/com/agenticbanking/account/service/AccountEventHandler.java

Return prioritized findings with concrete mitigations. Separate workshop fixes from production notes.
