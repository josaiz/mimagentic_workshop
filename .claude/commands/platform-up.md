Use the platform sub-agent to start or diagnose the Docker Compose platform.

## Step 1 — Check current state

Run: `make ps` or `docker compose -f infra/docker-compose.yml ps`

Interpret the output:
- If all services are Up and healthy → platform is running, report status and skip to verification
- If services are missing or unhealthy → diagnose and fix

## Step 2 — Start if not running

Run: `make up`

This builds images and starts all services. It takes 1-3 minutes on first run.

## Step 3 — Verify health

Check each service health endpoint:

```bash
curl -s http://localhost:3001/health   # movement-orchestrator
curl -s http://localhost:3002/health   # event-log-service
curl -s http://localhost:3003/health   # notification-service
curl -s http://localhost:3004/health   # external-transfer-service
curl -s http://localhost:8081/health   # account-service
curl -s http://localhost:8082/health   # mortgage-service
curl -s http://localhost:8083/health   # investment-service
curl -s http://localhost:3000          # dashboard (check for "Agentic Banking Lab" in response)
```

Report which services are UP and which are DOWN.

## Step 4 — Diagnose failures

If any service is DOWN:
- Run `docker compose -f infra/docker-compose.yml logs {service-name}` for the failing service
- Common causes:
  - Redpanda not ready → service restarted before broker was healthy
  - PostgreSQL not ready → same
  - Port conflict → check `lsof -i :{port}`
- Fix the issue, then re-check health

## Useful URLs once running

- Dashboard: http://localhost:3000
- Redpanda Console (inspect topics/messages): http://localhost:8080
