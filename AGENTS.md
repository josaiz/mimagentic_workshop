# AGENTS.md

This repository is a workshop lab for agentic programming with OpenCode.

The goal is not to build a production bank. The goal is to provide a realistic multi-service codebase where agents can inspect architecture, modify services, add use cases, review security, review event contracts, generate demo data, and troubleshoot a local platform.

## Architecture

- Frontend: `apps/web-dashboard`
- Java services: `services/account-service`, `services/mortgage-service`, `services/investment-service`
- Node services: `services/movement-orchestrator`, `services/event-log-service`, `services/external-transfer-service`, `services/notification-service`
- Contracts: `packages/event-contracts`
- Demo tooling: `tools/demo-data-generator`
- Platform: `infra/docker-compose.yml`

## Rules

- Keep the system demoable with Docker Compose.
- Preserve `correlationId` across the full flow.
- Set `causationId` to the event that caused any derived event.
- Do not introduce real authentication.
- Do not add Kubernetes, Helm, Terraform, OAuth, or a production ledger.
- Prefer small, understandable code over generic frameworks.
- Do not create new microservices unless clearly useful for the workshop.
- Any new business flow must appear in the frontend timeline.
- Any new event must be added to `packages/event-contracts` and `docs/EVENTS.md`.

## Run And Test

```bash
make up
make demo-data
make test
make down
```

Open `http://localhost:3000` for the dashboard and `http://localhost:8080` for Redpanda Console.

## Preferred Agent Workflow

Start in plan mode for cross-service changes. Use the event architect first for new flows, then implementation agents by stack, then QA/security/docs review. Keep changes scoped and update docs together with code.
