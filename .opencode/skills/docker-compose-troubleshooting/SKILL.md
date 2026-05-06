---
name: docker-compose-troubleshooting
description: Troubleshooting checklist for local Docker Compose platform issues.
---

# Docker Compose Troubleshooting Skill

## When To Use

Use this skill when `make up`, service health, Kafka, PostgreSQL, dashboard API calls, or demo data generation fails.

## Known Ports

- Dashboard: `3000`
- Orchestrator: `3001`
- Event log: `3002`
- Notification: `3003`
- External transfer: `3004`
- Account: `8081`
- Mortgage: `8082`
- Investment: `8083`
- Redpanda Console: `8080`
- PostgreSQL: `5432`
- Kafka host port: `9092`

## Procedure

1. Check platform state:

```bash
make ps
docker compose -f infra/docker-compose.yml ps
```

2. Validate Compose syntax:

```bash
docker compose -f infra/docker-compose.yml config >/dev/null
```

3. Inspect focused logs:

```bash
docker compose -f infra/docker-compose.yml logs redpanda postgres account-service event-log-service
```

4. Check broker addressing:
   - containers use `redpanda:9092`.
   - host tools and browser-facing docs use `localhost:9092`.
5. Check browser API URLs:
   - `NEXT_PUBLIC_ACCOUNT_SERVICE_URL`
   - `NEXT_PUBLIC_EVENT_LOG_SERVICE_URL`
   - `NEXT_PUBLIC_MOVEMENT_ORCHESTRATOR_URL`
6. For a stuck flow, combine service logs with correlation tracing.

## Checklist

- Docker is running.
- No expected port is already occupied.
- Redpanda and PostgreSQL are healthy before dependent services are blamed.
- Dashboard env vars point to localhost URLs.
- Logs are scoped to the likely service before showing noisy full logs.

## Output Format

Return:

- `Symptom`: what failed.
- `Evidence`: command output summary.
- `Likely cause`: grounded hypothesis.
- `Next command`: one command to run next.
- `Facilitator note`: short explanation for the room.
