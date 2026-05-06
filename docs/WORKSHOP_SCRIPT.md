# Workshop Script

This is a one-hour OpenCode workshop using Agentic Banking Lab. The codebase is intentionally small enough to understand live, but rich enough to demonstrate agentic programming on real services, events, UI, tests, docs, and local operations.

## 0-5 Min: Framing

Introduce agentic programming as a workflow for changing real codebases with explicit context:

- `AGENTS.md` sets global repo rules.
- Agents provide durable perspectives.
- Skills provide reusable procedures.
- Commands encode repeatable workflows.
- Permissions make safety visible.
- Formatters keep generated assets consistent.
- Custom tools expose project-specific truth.

Say clearly that this is a workshop bank, not a production bank.

## 5-10 Min: Repository And OpenCode Tour

Show:

- `AGENTS.md`
- `opencode.json`
- `.opencode/agents/`
- `.opencode/skills/`
- `.opencode/commands/`
- `.opencode/tools/banking.ts`
- `docs/BACKLOG_STORIES.md`
- `infra/docker-compose.yml`
- `services/`
- `apps/web-dashboard`
- `packages/event-contracts`

Run:

```text
/opencode-map
```

Teaching point: OpenCode assets are part of the repo, so the workflow can be reviewed, versioned, and improved like code.

## 10-20 Min: Architecture And Platform

Run:

```text
/explain-architecture
/platform-up
```

Start the lab if it is not running:

```bash
make up
```

Open:

```text
http://localhost:3000
```

Optionally show Redpanda Console:

```text
http://localhost:8080
```

Teaching point: `platform-agent` knows Compose, Redpanda, PostgreSQL, ports, and browser-facing URLs without polluting every other agent.

## 20-35 Min: Event Flows

Trigger from the dashboard or with `/generate-demo-data`:

- salary simulation,
- investment contribution,
- mortgage repayment,
- external transfer,
- rejected external transfer,
- insufficient funds,
- random activity.

Point out:

- event envelope,
- `correlationId`,
- `causationId`,
- service producer,
- account available/reserved balances,
- terminal success/rejection,
- `NotificationCreated`.

Copy one correlation ID from the dashboard and run:

```text
/trace-correlation <correlation-id>
```

Teaching point: the hidden `flow-tracer-agent` and `correlation-tracing` skill reconstruct real runtime behavior through the project-specific `banking_events` custom tool.

## 35-45 Min: Commands, Skills, And Reviews

Run:

```text
/event-contract-review
/security-review
```

Show the command files afterwards:

- `.opencode/commands/event-contract-review.md`
- `.opencode/commands/security-review.md`

Teaching point:

- Commands route work to the right agent.
- Skills make the review checklist reusable.
- `!command` output grounds the prompt in current repo state.
- Permissions decide which commands/tools can run without approval.

## 45-55 Min: Backlog Story Refactor

Frame the realistic backlog task:

```text
Refactor investment-service to lightweight hexagonal architecture.
```

Run Plan-style design first:

```text
/design-investment-hexagonal
```

Discuss the output:

- current coupling,
- target package layout,
- ports and adapters,
- Spring component wiring,
- behavior preservation,
- focused tests,
- security/replay concerns,
- overengineering guardrails.

Then show the Build-style entrypoint:

```text
/refactor-investment-hexagonal
```

Do not run the full refactor unless you want the live coding portion to continue beyond the one-hour script. If you do run it, finish with:

```text
/review-changes
```

Teaching point: a backlog refactor can be handled by coordinated agents: architecture, Spring, QA, security, and generic PR review. The code stays in its “before” shape until the build command is actually run.

## 55-60 Min: Readiness And Wrap

Run:

```text
/workshop-readiness
```

Close with the core lesson:

- Make repo knowledge explicit.
- Use agents for perspectives.
- Use skills for methods.
- Use commands for repeatable workflows.
- Use permissions and tools to keep work grounded and safe.

Optional final checks before a live session:

```bash
npx prettier --check opencode.json ".opencode/**/*.md" ".opencode/tools/*.ts" docs/OPENCODE_GUIDE.md docs/WORKSHOP_SCRIPT.md README.md
npm test -w @agentic-banking-lab/event-contracts
npm run build -w @agentic-banking-lab/web-dashboard
cd services/investment-service && mvn -q -Djava.version=${JAVA_TEST_VERSION:-23} test
```
