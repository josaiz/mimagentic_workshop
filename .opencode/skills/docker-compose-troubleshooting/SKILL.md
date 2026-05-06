---
name: docker-compose-troubleshooting
description: Troubleshooting checklist for local Docker Compose platform issues.
---

Check Docker, ports, container health, Redpanda broker address, PostgreSQL connectivity, service logs, environment variables, and startup order. Prefer `make ps`, `make logs`, and `docker compose -f infra/docker-compose.yml logs <service>`.
