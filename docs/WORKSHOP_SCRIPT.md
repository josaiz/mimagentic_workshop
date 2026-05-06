# Workshop Script

## 0-5 Min: Framing

Introduce agentic programming as a workflow for understanding and modifying real codebases. Emphasize plan mode, build mode, subagents, skills, commands, and context management.

## 5-10 Min: Repository Tour

Show `AGENTS.md`, `infra/docker-compose.yml`, `services/`, `apps/web-dashboard`, `packages/event-contracts`, and `.opencode/`.

Run:

```text
/explain-architecture
```

## 10-20 Min: Platform

Start the lab:

```bash
make up
```

Open:

```text
http://localhost:3000
```

Show Redpanda Console at `http://localhost:8080` if useful.

## 20-35 Min: Flows

Trigger:
- investment contribution,
- mortgage repayment,
- external transfer,
- salary simulation,
- insufficient funds,
- random activity.

Point out event envelope, correlation IDs, causation IDs, and account balance changes.

## 35-45 Min: Commands And Agents

Run:

```text
/event-contract-review
/security-review
```

Explain how commands encode repeatable engineering workflows.

## 45-55 Min: Add A Use Case

Run:

```text
/add-use-case "credit card payment from the main account"
```

Discuss how the agent should coordinate event contracts, backend services, frontend, tests, and docs.

## 55-60 Min: Wrap

Summarize how clearer boundaries, docs, skills, and commands make agentic coding tools more useful in real projects.
