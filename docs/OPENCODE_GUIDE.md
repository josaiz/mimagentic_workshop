# OpenCode Guide

This repo includes local guidance for agentic workflows.

## Agents

Agents live in `.opencode/agents/`.

- `spring-agent`: Java banking services.
- `node-agent`: Node services and Kafka/SSE integration.
- `frontend-agent`: Next.js dashboard.
- `event-architect-agent`: event contracts and flow design.
- `security-agent`: risk review.
- `platform-agent`: Docker Compose, Redpanda, PostgreSQL.
- `data-agent`: Python scenario generation.
- `qa-agent`: testing and smoke checks.
- `docs-agent`: documentation.

## Skills

Skills live in `.opencode/skills/<name>/SKILL.md`. They capture reusable engineering guidance such as event-driven design, service boundaries, banking-domain simplifications, security review, testing strategy, and workshop facilitation.

## Commands

Commands live in `.opencode/commands/`.

Useful workshop commands:

```text
/explain-architecture
/platform-up
/generate-demo-data
/add-use-case "credit card payment from the main account"
/security-review
/event-contract-review
/test-flow mortgage-repayment
/review-changes
/workshop-demo
```

## Suggested Prompt

```text
Use @event-architect-agent to plan a new "credit card payment" flow. Identify events, service changes, dashboard changes, tests, and docs before implementation.
```
