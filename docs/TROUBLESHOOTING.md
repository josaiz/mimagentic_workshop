# Troubleshooting

## Docker Is Not Running

Check Docker Desktop and run:

```bash
docker info
```

## Port Conflicts

Expected ports:

- dashboard: `3000`
- orchestrator: `3001`
- event log: `3002`
- notification: `3003`
- external transfer: `3004`
- account: `8081`
- mortgage: `8082`
- investment: `8083`
- Redpanda Console: `8080`
- PostgreSQL: `5432`
- Redpanda Kafka: `9092`

Inspect listeners:

```bash
lsof -nP -iTCP:3000 -iTCP:3001 -iTCP:3002 -iTCP:8081 -sTCP:LISTEN
```

## Redpanda Not Reachable

Check:

```bash
docker compose -f infra/docker-compose.yml logs redpanda
docker compose -f infra/docker-compose.yml ps
```

Internal services use `redpanda:9092`; local tools use `localhost:9092`.

## PostgreSQL Connection Issue

Check:

```bash
docker compose -f infra/docker-compose.yml logs postgres
```

Default credentials are `banking` / `banking`, database `banking`.

## Frontend Cannot Reach APIs

The browser uses localhost URLs:

```text
NEXT_PUBLIC_ACCOUNT_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_EVENT_LOG_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_MOVEMENT_ORCHESTRATOR_URL=http://localhost:3001
```

Confirm service health endpoints respond from the host browser.

## Reset The Lab

```bash
make down
make up
```
