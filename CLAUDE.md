# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

**Agentic Banking Lab** — a workshop lab demonstrating agentic programming workflows with an event-driven microservices architecture. Not a production system; intentionally simplified.

## Commands

### Whole platform

```bash
make up           # Start full lab (Docker Compose, with rebuild)
make down         # Stop and remove volumes
make logs         # Stream all service logs
make ps           # Show container status
make restart      # Restart Compose
```

### Demo & testing

```bash
make demo-data    # Generate morning scenario events (Python)
make e2e          # Build + run smoke tests
make test         # Validate Compose + npm tests + dashboard build + Java unit tests
```

### Node services (npm workspaces, requires Node >=24)

```bash
npm install                      # Install all workspaces
npm test                         # Test all workspaces
npm run lint                     # Lint all workspaces
npm test -w packages/event-contracts   # Test a single workspace
npm test -w services/movement-orchestrator
```

### Java services (Spring Boot 4, Java 25)

Run from the service directory (e.g. `services/account-service`):

```bash
./mvnw test                      # All unit tests
./mvnw test -Dtest=MyTest        # Single test class
./mvnw spring-boot:run           # Run locally (needs external Redpanda + Postgres)
```

### Python tools

```bash
python tools/demo-data-generator/generate.py --scenario morning
python tools/e2e-smoke/run.py
```

## Architecture

### Service map

| Service | Stack | Port | Role |
|---|---|---|---|
| web-dashboard | Next.js / React / TS | 3000 | Dashboard, actions, SSE event timeline |
| movement-orchestrator | Node.js / TS | 3001 | Validates requests, publishes start events |
| event-log-service | Node.js / TS | 3002 | Persists events, exposes history + SSE |
| notification-service | Node.js / TS | 3003 | Creates notification events |
| external-transfer-service | Node.js / TS | 3004 | Handles external transfers |
| account-service | Spring Boot 4 / Java 25 | 8081 | Owns account state, reservations, commits, credits |
| mortgage-service | Spring Boot 4 / Java 25 | 8082 | Handles mortgage repayments |
| investment-service | Spring Boot 4 / Java 25 | 8083 | Handles fund contributions |
| Redpanda | Kafka-compatible broker | 9092 | Event transport |
| PostgreSQL | postgres:18-alpine | 5432 | Account + event persistence |

### Event flow

All services communicate via a single Kafka topic: **`banking.events`** on Redpanda. The movement-orchestrator validates and publishes start events; Java services and Node services react to events and emit downstream events. The event-log-service persists everything and exposes it via SSE to the dashboard.

### Event envelope conventions

Every event carries:
- `correlationId` — preserved across an entire flow (e.g. one salary payment)
- `causationId` — the `eventId` of the event that caused this one (tracks derivation)
- `idempotencyKey` — stable key enabling safe consumer replay

Event types and TypeScript types are owned by `packages/event-contracts/src/index.ts`. JSON schemas live alongside in `packages/event-contracts/events/*.schema.json`.

### Infrastructure addresses

- Internal (Docker): Redpanda at `redpanda:9092`, Postgres at `postgres:5432`
- Host: Redpanda at `localhost:9092`, Postgres at `localhost:5432`
- Postgres creds: user `banking`, password `banking`, database `banking`

## Key source locations

- **Event contracts (source of truth):** `packages/event-contracts/src/index.ts`
- **Event schemas:** `packages/event-contracts/events/`
- **Dashboard page:** `apps/web-dashboard/src/app/page.tsx`
- **Java service structure:** `services/<name>/src/main/java` / `src/test/java`
- **Node service entrypoints:** `services/<name>/src/`
- **Infrastructure:** `infra/docker-compose.yml`
- **Demo data generator:** `tools/demo-data-generator/generate.py`
- **Smoke tests:** `tools/e2e-smoke/run.py`

## Intentional simplifications

- Single account (`acc_main_001`) and single Kafka topic
- No auth, no real money movement
- PostgreSQL is shared between account-service and event-log-service
- The dashboard polls/streams from event-log-service; it does not talk directly to business services

## Claude Code assets

### Sub-agents (`.claude/agents/`)

Specialized agents that Claude delegates to automatically based on the task:

| Agent | When used |
|---|---|
| `event-architect` | Event design, contract drift, adding event types |
| `node` | movement-orchestrator, event-log-service, notification-service, external-transfer-service, event-contracts package |
| `spring` | account-service, investment-service, mortgage-service |
| `frontend` | apps/web-dashboard (Next.js dashboard) |
| `hexagonal-architecture` | Ports-and-adapters refactoring (primary target: investment-service) |
| `qa` | Test strategy, running tests across all layers |
| `security` | Input validation, idempotency, secrets, financial risks |
| `platform` | Docker Compose, Redpanda, PostgreSQL, networking |
| `data` | Demo data generation, event queries |
| `docs` | README, EVENTS.md, architecture diagrams, workshop docs |

### Slash commands (`.claude/commands/`)

Type `/` in Claude Code to access these workflows:

| Command | What it does |
|---|---|
| `/explain-architecture` | Full service map, event flow, and design rationale |
| `/platform-up` | Start or diagnose the Docker Compose platform |
| `/banking-health` | Check all 8 service health endpoints |
| `/banking-events [correlationId]` | Query recent events or trace a full correlation timeline |
| `/trigger-flow <name>` | Trigger a demo flow (salary, investment, mortgage, external-transfer, etc.) |
| `/event-contract-review` | Check TypeScript enums vs JSON schema vs docs for drift |
| `/trace-correlation <id>` | Reconstruct the causal event chain for a correlation ID |
| `/security-review` | Review validation, idempotency, secrets, and financial risks |
| `/design-investment-hexagonal` | Plan the hexagonal refactor of investment-service (no code changes) |
| `/refactor-investment-hexagonal` | Execute the hexagonal refactor step by step |
| `/review-changes` | Review recent git changes across all service domains |
| `/add-use-case <description>` | Design and implement a new banking use case end-to-end |
| `/generate-demo-data` | Generate realistic demo banking activity |

### Live API reference

These are the curl equivalents of the OpenCode custom tools. Claude can run these directly via Bash:

```bash
# Health checks
curl -s http://localhost:3001/health   # movement-orchestrator
curl -s http://localhost:3002/health   # event-log-service
curl -s http://localhost:8081/health   # account-service
curl -s http://localhost:8082/health   # mortgage-service
curl -s http://localhost:8083/health   # investment-service

# Events
curl -s "http://localhost:3002/api/events?limit=50" | jq .
curl -s "http://localhost:3002/api/events/correlation/{correlationId}" | jq .

# Trigger flows (movement-orchestrator at localhost:3001)
curl -s -X POST http://localhost:3001/api/demo/salary \
  -H 'Content-Type: application/json' \
  -d '{"amount":3200,"currency":"EUR","employerName":"MIM Agentic Labs"}'

curl -s -X POST http://localhost:3001/api/movements/investment-contribution \
  -H 'Content-Type: application/json' \
  -d '{"amount":250,"currency":"EUR","fundId":"fund_global_index"}'

curl -s -X POST http://localhost:3001/api/movements/mortgage-repayment \
  -H 'Content-Type: application/json' \
  -d '{"amount":650,"currency":"EUR","mortgageId":"mortgage_001"}'

curl -s -X POST http://localhost:3001/api/movements/external-transfer \
  -H 'Content-Type: application/json' \
  -d '{"amount":120,"currency":"EUR","destinationIban":"ES00DEMO1234567890"}'

# Rejected transfer (use FAIL IBAN)
curl -s -X POST http://localhost:3001/api/movements/external-transfer \
  -H 'Content-Type: application/json' \
  -d '{"amount":85,"currency":"EUR","destinationIban":"ES00FAIL1234567890"}'
```
