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
- `backlog-task-agent`: intake agent for pasted Miro/Jira tasks; prepares commands, agent/skill reuse decisions, and backlog docs before implementation.

Visible subagents:

- `event-architect-agent`: event contracts, naming, envelopes, causation, idempotency, and service boundaries.
- `hexagonal-architecture-agent`: ports/adapters refactors, package boundaries, dependency direction, and overengineering guardrails.
- `node-agent`: Node services, TypeScript, Express, Kafka, SSE, orchestrator, event log, and notification logic.
- `spring-agent`: Java/Spring account, mortgage, and investment services, with official Spring documentation access for framework questions.
- `frontend-agent`: Next.js dashboard actions, service health, event timeline, and correlation detail.
- `qa-agent`: focused tests, smoke paths, and acceptance scenarios.
- `security-agent`: validation, secrets, replay/idempotency, logs, and demo-safe risk review.
- `platform-agent`: Docker Compose, Redpanda, PostgreSQL, ports, health checks, and logs.
- `data-agent`: demo data and scenario generation through public HTTP APIs.
- `docs-agent`: README, architecture docs, event docs, workshop guide, and diagrams.
- `pr-review-agent`: generic PR-style review for local diffs, regression risk, architecture drift, tests, security, and docs.

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
- `hexagonal-architecture`
- `legacy-refactor-safety`
- `pr-review-checklist`
- `docker-compose-troubleshooting`
- `spring-boot-components`
- `workshop-facilitation`

Additional skills:

- `correlation-tracing`: reconstruct timelines by correlation ID.
- `contract-drift-review`: compare event enums, schemas, service code, tests, dashboard, and docs.
- `agentic-workflow-design`: design OpenCode workflows that demonstrate agents, skills, commands, permissions, formatters, and tools.
- `backlog-task-intake`: turn a pasted backlog task into OpenCode commands, reuse decisions, and workshop-ready backlog documentation.

## Commands

Architecture and teaching:

```text
/opencode-map
/explain-architecture
/prepare-backlog-task "TASK-97 Add a Money Allocation chart to the dashboard"
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
/design-investment-hexagonal
/refactor-investment-hexagonal
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

## Backlog Story Demo

For any new Miro/Jira-style task, use the intake agent first:

```text
/prepare-backlog-task "TASK-97 Add a Money Allocation chart to the dashboard"
```

The intake agent prepares workflow assets only. It does not implement the feature. It decides whether existing agents/skills are enough, creates commands, and updates `docs/BACKLOG_STORIES.md`.

When the pasted card includes a task ID such as `TASK-98`, generated command names and filenames are prefixed with it, for example `/task-98-add-account-spending-power-endpoint` and `.opencode/commands/task-98-add-account-spending-power-endpoint.md`.

The prepared backlog story is:

```text
Refactor `investment-service` to lightweight hexagonal architecture while preserving current Kafka behavior.
```

Use this as the realistic “ticket arrives from the backlog” exercise:

```text
/design-investment-hexagonal
/refactor-investment-hexagonal
/review-changes
```

The first command designs the refactor without editing files. The second command is the build-mode entrypoint that should only touch `services/investment-service`. The generic `/review-changes` command remains the review entrypoint after the refactor.

Acceptance criteria are documented in [BACKLOG_STORIES.md](BACKLOG_STORIES.md).

## Permissions And Formatters

`opencode.json` makes safety visible:

- Read-only discovery commands such as `rg`, `git status`, `git diff`, Compose config, and focused contract tests are allowed.
- Mutating or expensive commands such as `make up`, `make demo-data`, `make e2e`, `make test`, and `banking_triggerFlow` require approval.
- Destructive git commands such as `git reset` and `git checkout --` are denied.
- Skills are explicitly allowed for the lab.
- Hidden subagents are available through task permissions where they are useful.
- `spring-agent` and `hexagonal-architecture-agent` can fetch official Spring documentation from `docs.spring.io`, `docs.enterprise.spring.io`, and `spring.io`; other URLs ask first.

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
/design-investment-hexagonal
```
