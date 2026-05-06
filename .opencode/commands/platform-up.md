---
description: Start or diagnose the local Docker Compose platform.
agent: platform-agent
---

Compose services declared in the lab:

!`docker compose -f infra/docker-compose.yml config --services`

Help the user start Agentic Banking Lab with:

```bash
make up
```

If anything fails, inspect platform state first:

```bash
make ps
docker compose -f infra/docker-compose.yml ps
docker compose -f infra/docker-compose.yml logs redpanda postgres account-service event-log-service
```

Use `@platform-agent` guidance and the `docker-compose-troubleshooting` skill.

Check:

- expected local ports,
- Redpanda container broker `redpanda:9092`,
- host/browser URLs on `localhost`,
- PostgreSQL health,
- `NEXT_PUBLIC_ACCOUNT_SERVICE_URL`,
- `NEXT_PUBLIC_EVENT_LOG_SERVICE_URL`,
- `NEXT_PUBLIC_MOVEMENT_ORCHESTRATOR_URL`,
- startup order and focused service logs.

Return one likely cause at a time and the next command to run.
