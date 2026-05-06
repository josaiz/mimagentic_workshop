---
description: Start or diagnose the local Docker Compose platform.
---

Help the user start Agentic Banking Lab with:

```bash
make up
```

If anything fails, inspect:

```bash
docker compose -f infra/docker-compose.yml ps
docker compose -f infra/docker-compose.yml logs redpanda postgres account-service event-log-service
```

Use `@platform-agent` guidance. Check ports, broker address, PostgreSQL health, and frontend API URLs.
