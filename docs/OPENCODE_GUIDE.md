# OpenCode Guide

This repo includes a project-local OpenCode lab under `.opencode/`. The goal is to show how agentic programming can be made repeatable through specialized agents, reusable skills, custom commands, permissions, formatters, and project-specific tools.

## Mental Model

| OpenCode asset | Where                              | Workshop purpose                                                                                     |
| -------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Root guidance  | `AGENTS.md`                        | Sets repo-wide scope, layout, event, command, and local-ops rules.                                   |
| Config         | `opencode.json`                    | Defines permissions, formatter behavior, built-in agent overrides, and custom tool safety.           |
| Agents         | `.opencode/agents/`                | Encode durable perspectives such as event architecture, frontend UX, QA, security, and platform ops. |
| Skills         | `.opencode/skills/<name>/SKILL.md` | Encode reusable procedures that agents can load on demand.                                           |
| Commands       | `.opencode/commands/*.md`          | Encode repeatable workflows participants can run with `/command-name`.                               |
| Custom tools   | `.opencode/tools/banking.ts`       | Query real lab state: health, events, contract catalog, and guarded flow triggers.                   |

## Agents

Primary facilitator:

- `workshop-agent`: guides live demos, coordinates subagents, and explains OpenCode concepts as they appear.

Visible subagents:

- `event-architect-agent`: event contracts, naming, envelopes, causation, idempotency, and service boundaries.
- `node-agent`: Node services, TypeScript, Express, Kafka, SSE, orchestrator, event log, and notification logic.
- `spring-agent`: Java/Spring account, mortgage, and investment services.
- `frontend-agent`: Next.js dashboard actions, service health, event timeline, and correlation detail.
- `qa-agent`: focused tests, smoke paths, and acceptance scenarios.
- `security-agent`: validation, secrets, replay/idempotency, logs, and demo-safe risk review.
- `platform-agent`: Docker Compose, Redpanda, PostgreSQL, ports, health checks, and logs.
- `data-agent`: demo data and scenario generation through public HTTP APIs.
- `docs-agent`: README, architecture docs, event docs, workshop guide, and diagrams.

Hidden diagnostic subagents:

- `contract-drift-agent`: read-mostly checker for event enum/schema/docs/service drift.
- `flow-tracer-agent`: read-mostly checker for real event timelines and missing terminal events.

## Skills

Existing domain skills were expanded into procedures:

- `event-driven-design`
- `service-boundaries`
- `banking-domain`
- `testing-strategy`
- `security-review`
- `frontend-visualization`
- `docker-compose-troubleshooting`
- `workshop-facilitation`

Additional skills:

- `correlation-tracing`: reconstruct timelines by correlation ID.
- `contract-drift-review`: compare event enums, schemas, service code, tests, dashboard, and docs.
- `agentic-workflow-design`: design OpenCode workflows that demonstrate agents, skills, commands, permissions, formatters, and tools.

## Commands

Architecture and teaching:

```text
/opencode-map
/explain-architecture
/workshop-demo
/workshop-readiness
```

Platform and data:

```text
/platform-up
/generate-demo-data
```

Event and flow work:

```text
/event-contract-review
/design-flow "credit card payment from the main account"
/add-use-case "credit card payment from the main account"
/trace-correlation <correlation-id>
/triage-flow external-transfer
/test-flow mortgage-repayment
```

Review:

```text
/review-changes
/security-review
```

Commands demonstrate OpenCode command features:

- `agent` and `subtask` frontmatter.
- `$ARGUMENTS` and positional arguments.
- `@file` references for grounding.
- `!command` shell-output injection for safe repository facts.
- Delegation to visible and hidden subagents.

## Permissions And Formatters

`opencode.json` makes safety visible:

- Read-only discovery commands such as `rg`, `git status`, `git diff`, Compose config, and focused contract tests are allowed.
- Mutating or expensive commands such as `make up`, `make demo-data`, `make e2e`, `make test`, and `banking_triggerFlow` require approval.
- Destructive git commands such as `git reset` and `git checkout --` are denied.
- Skills are explicitly allowed for the lab.
- Hidden subagents are available through task permissions where they are useful.

The formatter section uses Prettier for `.md`, `.json`, `.ts`, `.tsx`, `.js`, and `.mjs` so generated workshop assets stay consistent:

```bash
npx prettier --check opencode.json ".opencode/**/*.md" ".opencode/tools/*.ts" docs/OPENCODE_GUIDE.md docs/WORKSHOP_SCRIPT.md README.md
```

## Custom Tools

`.opencode/tools/banking.ts` exports:

- `banking_health`: checks local service health and dashboard reachability.
- `banking_events`: reads recent events or one correlation timeline from event-log-service.
- `banking_contractCatalog`: compares event types across TypeScript contracts, envelope schema, and docs.
- `banking_triggerFlow`: triggers a known demo flow through movement-orchestrator; this is guarded by `ask` permission because it writes events to the local lab.

Suggested live sequence:

```text
/opencode-map
/platform-up
/generate-demo-data
/trace-correlation <id>
/event-contract-review
/design-flow "credit card payment from the main account"
```
