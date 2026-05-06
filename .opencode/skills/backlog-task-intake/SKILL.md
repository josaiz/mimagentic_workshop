---
name: backlog-task-intake
description: Procedure for turning a pasted Miro/Jira backlog task into OpenCode commands, agent/skill reuse decisions, and workshop-ready backlog documentation.
---

# Backlog Task Intake Skill

## When To Use

Use this skill when a user pastes a backlog task and wants OpenCode assets prepared before implementation.

Examples:

- “Add a Money Allocation chart to the dashboard.”
- “Create spending power endpoint in account-service.”
- “Refactor investment-service to hexagonal architecture.”

## Inputs

Start from the pasted task text. Extract:

- title,
- actor/user,
- goal,
- business or workshop value,
- acceptance criteria,
- explicit constraints,
- implied affected subsystem,
- estimated complexity,
- unknowns.

## Repo Grounding

Before generating assets:

1. Search existing commands, agents, and skills.
2. Inspect likely code surfaces.
3. Identify existing tests and verification commands.
4. Check whether the task changes events, service boundaries, frontend state, platform config, or docs.

## Classification

Classify the task as one or more:

- `frontend`: dashboard UI, visualization, SSE/timeline, CSS.
- `backend-endpoint`: HTTP endpoint, controller, validation, response shape.
- `event-flow`: new or changed Kafka business event behavior.
- `refactor`: structure change with behavior preservation.
- `testing`: test coverage, smoke checks, verification tooling.
- `docs-workshop`: README, workshop script, backlog docs, OpenCode assets.
- `platform`: Docker Compose, Redpanda, PostgreSQL, ports, health.

## Reuse Rules

Prefer existing assets:

- `frontend-agent` and `frontend-visualization` for dashboard UI.
- `spring-agent` and `spring-boot-components` for Java/Spring changes.
- `node-agent` for Node/Express/Kafka services.
- `event-architect-agent` and `event-driven-design` for event flows.
- `hexagonal-architecture-agent` and `hexagonal-architecture` for ports/adapters refactors.
- `qa-agent` and `testing-strategy` for verification.
- `security-agent` and `security-review` for validation/replay/logging risk.
- `docs-agent` and `workshop-facilitation` for participant-facing docs.
- `pr-review-agent` and `pr-review-checklist` for final review.

Create a new agent only when the task needs a reusable perspective not covered by existing agents. Create a new skill only when the task reveals a reusable procedure.

## Command Generation Rules

- Simple task: generate one `/add-...` command.
- Complex design/refactor/event-flow task: generate `/design-...` and `/add-...` or `/refactor-...`.
- Commands must be grounded in real files with `@file` references.
- Commands must include acceptance criteria and explicit scope boundaries.
- Commands must instruct the implementer to run `/review-changes` after implementation.

## Backlog Documentation Rules

Update `docs/BACKLOG_STORIES.md` with:

- title,
- ticket text,
- why it works for the workshop,
- generated commands,
- acceptance criteria,
- out of scope,
- verification.

Keep the text suitable for copying to Miro/Jira.

## Output Format

Return:

- `Parsed task`
- `Classification`
- `Reuse decision`
- `Generated assets`
- `Backlog story entry`
- `Next command to run`
- `Verification`
