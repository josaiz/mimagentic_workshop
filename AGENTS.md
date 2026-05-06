# AGENTS.md

## Scope

- This is a Docker Compose workshop lab, not a production bank; do not add real auth, OAuth, Kubernetes, Helm, Terraform, schema registry, distributed transactions, or a production ledger.
- Demo defaults are one account `acc_main_001`, currency `EUR`, and one Redpanda topic `banking.events`.
- Use npm workspaces with `package-lock.json` and Node `>=24`; there is no pnpm/yarn workspace.

## Layout

- `apps/web-dashboard`: Next app; `app/page.tsx` owns actions, service health, SSE event timeline, and correlation detail.
- Node workspaces: `movement-orchestrator` publishes start events from HTTP commands, `event-log-service` stores events and serves history/SSE, `external-transfer-service` handles transfer outcomes, `notification-service` emits user notifications.
- Java Maven services are not npm workspaces: `account-service` owns account state/Postgres reservations, while `investment-service` and `mortgage-service` consume reservations and publish terminal events.
- `packages/event-contracts` owns `BANKING_EVENTS_TOPIC`, `EVENT_TYPES`, TypeScript event types, and JSON schemas under `events/*.schema.json`.
- `infra/docker-compose.yml` is the platform source of truth; containers use `redpanda:9092`, while host tools and the browser use `localhost` ports.

## Events

- Preserve `correlationId` through the full flow, set `causationId` to the event that caused each derived event, and key Kafka messages by `correlationId`.
- Add or rename event types in all verified sources: `packages/event-contracts/src/index.ts`, `packages/event-contracts/events/envelope.schema.json`, and `docs/EVENTS.md`.
- Update payload schemas under `packages/event-contracts/events/` when event payload shape changes; update `packages/event-contracts/tests/envelope.test.mjs` when envelope rules or event enums change.
- New business flows must update contracts, producing/consuming services, dashboard action/timeline/detail, tests or smoke notes, and docs together.
- Consumers replay from the beginning; keep replay-driven derived events idempotent with stable `idempotencyKey` and deterministic event IDs where existing services do.

## Commands

- `make up` starts the full lab with rebuild; open dashboard `http://localhost:3000` and Redpanda Console `http://localhost:8080`.
- `make demo-data` runs `tools/demo-data-generator/generate.py --scenario morning` against `movement-orchestrator` on `localhost:3001`.
- `make test` runs Compose config validation, npm workspace tests, dashboard build, and Maven tests for account/investment/mortgage.
- Focused Node checks use workspace names: `npm test -w @agentic-banking-lab/event-contracts`, `npm test -w @agentic-banking-lab/movement-orchestrator`, `npm test -w @agentic-banking-lab/event-log-service`, `npm run build -w @agentic-banking-lab/web-dashboard`.
- Focused Java checks run inside the service dir: `mvn -q -Djava.version=${JAVA_TEST_VERSION:-23} test`; Docker images target Java 25, but local `make test` defaults Maven to Java 23.
- `npm run lint --workspaces --if-present` is not a reliable gate right now: the dashboard script is `next lint` and currently fails with `Invalid project directory .../lint`.

## Local Ops

- Fast Compose diagnostics: `make ps`, `make logs`, or `docker compose -f infra/docker-compose.yml logs <service>`.
- Expected ports: dashboard `3000`, orchestrator `3001`, event-log `3002`, notification `3003`, external-transfer `3004`, account `8081`, mortgage `8082`, investment `8083`, Redpanda Console `8080`, Postgres `5432`, Kafka `9092`.
- Browser API env vars are `NEXT_PUBLIC_ACCOUNT_SERVICE_URL`, `NEXT_PUBLIC_EVENT_LOG_SERVICE_URL`, and `NEXT_PUBLIC_MOVEMENT_ORCHESTRATOR_URL`; Compose sets them to localhost URLs.

## OpenCode Workflow

- For a new use case, follow `.opencode/commands/add-use-case.md`: event design first, then stack implementation, then QA/security/docs.
- Repo-local agents and skills live in `.opencode/agents` and `.opencode/skills`; use event-driven-design, service-boundaries, banking-domain, and testing-strategy guidance when changing flows.
