# Agentic Banking Lab — Requirements / Implementation Prompt for Codex

You are working inside a Git repository that should become a complete workshop/demo project for teaching agentic programming with OpenCode.

The goal is to create a realistic but intentionally small monorepo that demonstrates how agentic programming can help understand, modify, review, extend and operate a heterogeneous microservices system.

This repository will be used in a one-hour internal Lunch & Learn workshop about agentic programming. The workshop is inspired by the OpenCode workflow: Plan mode, Build mode, agents, subagents, skills, custom commands, context management and practical codebase automation.

## Very important operating instructions

If you are running in PLAN MODE:
- Do not modify files.
- Inspect the current repository state.
- Produce a concrete implementation plan.
- Validate feasibility.
- Identify risks.
- Propose the exact sequence of implementation steps.
- Mention any assumptions you need to make.
- Do not ask unnecessary clarification questions. Make reasonable decisions.

If you are running in IMPLEMENTATION MODE:
- Implement the full project described below.
- Prefer a working, demoable MVP over excessive enterprise complexity.
- Do not over-engineer.
- Keep the system small enough to run locally with Docker Compose.
- Create all necessary files.
- Add clear README documentation.
- Add OpenCode agents, skills and commands.
- Add scripts to run, test and demonstrate the project.
- At the end, provide a clear summary of what was created and how to run it.

The final repository must feel useful and extrapolable to real projects, not like a toy. But it must remain small enough for a workshop.

---

# 1. Project name

Use this project name:

```text
agentic-banking-lab
```

If the repository already has another name, do not rename the Git repository itself, but use `agentic-banking-lab` in documentation, README, package names and workshop materials where appropriate.

---

# 2. Workshop objective

This project must demonstrate:

1. A small event-driven banking system.
2. A monorepo with multiple services and technologies.
3. A frontend dashboard that visualizes what happens between services.
4. Several business use cases triggered from the frontend.
5. Kafka-compatible asynchronous communication.
6. OpenCode subagents specialized by technology and responsibility.
7. OpenCode skills with reusable engineering guidance.
8. OpenCode commands that help explore, run, extend, review and test the system.
9. A realistic workflow where an AI coding agent can:
   - understand architecture,
   - inspect services,
   - add a new use case,
   - modify frontend and backend,
   - generate test data,
   - review security,
   - review event contracts,
   - diagnose platform issues.

The repository itself is not the final product. The repository is the lab where agentic programming is demonstrated.

---

# 3. Important design principle

Build a controlled, realistic lab.

Do not build:
- a real bank,
- a production-grade ledger,
- real authentication,
- OAuth,
- Kubernetes,
- Helm,
- Terraform,
- complex observability stacks,
- full event sourcing,
- a complex saga framework,
- excessive boilerplate,
- too many services.

Do build:
- a clear monorepo,
- a working local platform,
- a few meaningful microservices,
- visible asynchronous flows,
- realistic event envelopes,
- useful subagents,
- useful skills,
- useful OpenCode commands,
- clear documentation,
- a demo that works in a workshop.

The main audience should immediately understand:
> “This is how I can use an agentic coding tool in a real-looking multi-service project.”

---

# 4. Technology stack

Use a heterogeneous stack, but keep it controlled.

## Frontend

Use:

```text id="4tsqnb"
Next.js + React + TypeScript
```

Prefer a modern Next.js version. Use a simple, clean UI. Tailwind CSS is acceptable and preferred if it keeps the UI fast to build.

## Java microservices

Use:

```text id="ecs0yd"
Java 25 LTS
Spring Boot 4.x
Maven
```

Use Java + Spring Boot for the business-critical banking services.

If Java 25 or Spring Boot 4 causes unexpected compatibility problems in the execution environment, document the issue and use the closest stable fallback, but the intended target is Java 25 + Spring Boot 4.x.

## Node.js microservices

Use:

```text id="pnm2hn"
Node.js 24 LTS
TypeScript
```

Use Node.js/TypeScript for lightweight API, orchestration, event-log and real-time frontend integration services.

## Python tooling

Use:

```text id="n532oe"
Python 3.14 preferred
Python 3.13 acceptable
```

Use Python only for demo data generation and scenario simulation. It does not need to be a core production service.

## Messaging

Use:

```text id="iyv605"
Redpanda
```

Reason: Redpanda is Kafka API compatible and easier to run locally than a full Kafka/Zookeeper setup.

Expose Kafka-compatible broker ports via Docker Compose.

Optionally include Redpanda Console if simple.

## Database

Use:

```text id="povitd"
PostgreSQL
```

Keep database usage simple.

Preferred:
- `account-service` uses PostgreSQL for account state and processed event IDs.
- `event-log-service` uses PostgreSQL to store all events for the dashboard.

Other services can remain stateless or use in-memory state if that keeps the demo simpler.

## Local platform

Use:

```text id="wp4gkg"
Docker Compose
```

The default developer path should be Docker Compose, not local installation of all services.

---

# 5. Proposed monorepo structure

Create a structure similar to this:

```text id="y2aq13"
agentic-banking-lab/
  apps/
    web-dashboard/

  services/
    account-service/
    mortgage-service/
    investment-service/
    external-transfer-service/
    movement-orchestrator/
    event-log-service/
    notification-service/

  tools/
    demo-data-generator/

  packages/
    event-contracts/

  infra/
    docker-compose.yml
    redpanda/
    postgres/

  docs/
    ARCHITECTURE.md
    EVENTS.md
    WORKSHOP_SCRIPT.md
    OPENCODE_GUIDE.md
    TROUBLESHOOTING.md

  .opencode/
    agents/
    skills/
    commands/

  AGENTS.md
  README.md
  Makefile
  package.json
  .gitignore
```

Adjust if needed, but preserve the intention.

---

# 6. Business domain

The demo domain is a simplified banking account management system.

There is one demo user and one main account.

Example:

```text id="k4zwgc"
Demo user: Jorge
Main account: acc_main_001
Currency: EUR
Initial available balance: 2450.00
```

From the frontend, the user should be able to trigger these business actions:

1. External bank transfer.
2. Investment fund contribution.
3. Mortgage repayment.
4. Salary income simulation.
5. Insufficient funds scenario.
6. Generate random demo activity.

Each action should produce visible events in the frontend timeline.

---

# 7. High-level architecture

The architecture should be event-driven.

The frontend talks over HTTP to the movement orchestrator and event-log services.

Services communicate asynchronously through Redpanda/Kafka-compatible topics.

Suggested flow:

```text id="em3czt"
Frontend
  ↓ HTTP
movement-orchestrator
  ↓ publishes event
banking.events topic
  ↓ consumed by account-service
account-service reserves or rejects money
  ↓ publishes event
banking.events topic
  ↓ consumed by use-case-specific services
investment-service / mortgage-service / external-transfer-service
  ↓ publish completed/rejected events
banking.events topic
  ↓ consumed by account-service, notification-service and event-log-service
event-log-service exposes events to frontend via HTTP/SSE
```

Use one main topic for simplicity:

```text id="wzgw7g"
banking.events
```

Optional additional topics are allowed if the implementation remains simple, but one topic is preferred for the workshop.

---

# 8. Event envelope

All events must use a shared envelope shape.

Create JSON Schema files in:

```text id="157b25"
packages/event-contracts/events/
```

The core envelope must include:

```json id="97dxe8"
{
  "eventId": "uuid",
  "eventType": "MoneyMovementRequested",
  "eventVersion": 1,
  "occurredAt": "2026-05-05T10:30:00.000Z",
  "producer": "movement-orchestrator",
  "correlationId": "uuid",
  "causationId": "uuid-or-null",
  "idempotencyKey": "string-or-null",
  "aggregateId": "string-or-null",
  "payload": {}
}
```

Rules:
- `eventId` must be unique.
- `correlationId` links a full business flow.
- `causationId` points to the event that caused this event.
- `eventType` must be in PascalCase and describe a business fact.
- Events should represent facts, not technical commands.
- For demo simplicity, `MoneyMovementRequested` is acceptable as the starting event even though in strict DDD it could be treated as a command.
- All services must preserve and propagate `correlationId`.
- All derived events must set `causationId` to the previous event’s `eventId`.

---

# 9. Event types

Implement at least these event types:

## Start events

```text id="fear7g"
MoneyMovementRequested
SalaryReceived
```

## Account events

```text id="j59jf6"
AccountDebitReserved
AccountDebitRejected
AccountDebitCommitted
AccountDebitReleased
AccountCredited
```

## External transfer events

```text id="41rk13"
ExternalTransferRequested
ExternalTransferCompleted
ExternalTransferRejected
```

## Investment events

```text id="wevf6a"
FundContributionRequested
FundContributionCompleted
FundContributionRejected
```

## Mortgage events

```text id="miu4f7"
MortgageRepaymentRequested
MortgageRepaymentCompleted
MortgageRepaymentRejected
```

## Notification events

```text id="1kb5p8"
NotificationCreated
```

---

# 10. Business flow details

## 10.1 External transfer

User clicks “Send external transfer” in frontend.

Frontend sends HTTP request to `movement-orchestrator`.

`movement-orchestrator` publishes:

```text id="27y0x2"
MoneyMovementRequested
```

With payload:

```json id="rql5xa"
{
  "movementType": "EXTERNAL_TRANSFER",
  "sourceAccountId": "acc_main_001",
  "amount": 100.00,
  "currency": "EUR",
  "destinationIban": "ES00DEMO1234567890"
}
```

`account-service` consumes it:
- if available balance is enough:
  - decrease available balance,
  - increase reserved balance,
  - publish `AccountDebitReserved`.
- if not enough:
  - publish `AccountDebitRejected`.

`external-transfer-service` consumes `AccountDebitReserved` for movement type `EXTERNAL_TRANSFER`:
- publishes `ExternalTransferRequested`,
- then publishes `ExternalTransferCompleted` or `ExternalTransferRejected`.

`account-service` consumes terminal event:
- if completed: publish `AccountDebitCommitted`.
- if rejected: release reservation and publish `AccountDebitReleased`.

`notification-service` creates a notification on terminal events.

`event-log-service` stores all events.

Frontend shows the event timeline.

## 10.2 Investment fund contribution

Similar flow, but movement type:

```text id="zpspyg"
INVESTMENT_FUND
```

Handled by `investment-service`.

Events:
- `FundContributionRequested`
- `FundContributionCompleted`
- `FundContributionRejected`

## 10.3 Mortgage repayment

Similar flow, but movement type:

```text id="j6omb1"
MORTGAGE_REPAYMENT
```

Handled by `mortgage-service`.

Events:
- `MortgageRepaymentRequested`
- `MortgageRepaymentCompleted`
- `MortgageRepaymentRejected`

## 10.4 Salary income

Frontend triggers salary simulation.

`movement-orchestrator` publishes:

```text id="s1azn9"
SalaryReceived
```

`account-service` consumes it:
- increases account available balance,
- publishes `AccountCredited`.

## 10.5 Insufficient funds

Frontend has a button to trigger a deliberately impossible movement, for example 999999 EUR.

`account-service` publishes:

```text id="mrkvh0"
AccountDebitRejected
```

Frontend should clearly show the rejected flow.

---

# 11. Service responsibilities

## 11.1 account-service

Technology:

```text id="4zc09h"
Java 25 + Spring Boot 4.x + Maven
```

Responsibilities:
- Maintain account state.
- Validate available balance.
- Reserve money.
- Commit money after target service completes.
- Release reserved money after target service rejects.
- Credit account on salary simulation.
- Publish account events.
- Expose REST endpoint to get account state.

Suggested endpoints:

```http id="41hl00"
GET /health
GET /accounts/{accountId}
```

Suggested account model:

```json id="y2rpc0"
{
  "accountId": "acc_main_001",
  "ownerName": "Jorge",
  "currency": "EUR",
  "availableBalance": 2450.00,
  "reservedBalance": 0.00,
  "bookedDebitTotal": 0.00,
  "createdAt": "..."
}
```

Persistence:
- Use PostgreSQL.
- Initialize demo account on startup if it does not exist.
- Store processed event IDs to avoid duplicate processing.

Important:
- Keep the code simple.
- Avoid a fully complex ledger.
- Add comments explaining that this is a demo approximation.

## 11.2 mortgage-service

Technology:

```text id="lxd43u"
Java 25 + Spring Boot 4.x + Maven
```

Responsibilities:
- Consume `AccountDebitReserved` for `MORTGAGE_REPAYMENT`.
- Publish `MortgageRepaymentRequested`.
- Simulate mortgage repayment.
- Publish `MortgageRepaymentCompleted` or `MortgageRepaymentRejected`.

Simple mortgage state can be in-memory or persisted if easy.

Suggested model:

```json id="xisx6g"
{
  "mortgageId": "mortgage_001",
  "outstandingPrincipal": 180000.00,
  "currency": "EUR"
}
```

Business rule:
- Reject if amount <= 0.
- Reject if amount > outstanding principal.
- Complete otherwise.

## 11.3 investment-service

Technology:

```text id="43p047"
Java 25 + Spring Boot 4.x + Maven
```

Responsibilities:
- Consume `AccountDebitReserved` for `INVESTMENT_FUND`.
- Publish `FundContributionRequested`.
- Simulate fund contribution.
- Publish `FundContributionCompleted` or `FundContributionRejected`.

Suggested fund:

```json id="cdh03v"
{
  "fundId": "fund_global_index",
  "name": "Global Index Fund"
}
```

Business rule:
- Reject if amount <= 0.
- Reject if amount < 10.
- Complete otherwise.

## 11.4 external-transfer-service

Technology:

```text id="us3wl0"
Node.js 24 + TypeScript
```

Responsibilities:
- Consume `AccountDebitReserved` for `EXTERNAL_TRANSFER`.
- Publish `ExternalTransferRequested`.
- Simulate external transfer.
- Publish `ExternalTransferCompleted` or `ExternalTransferRejected`.

Business rule:
- Reject if destination IBAN contains `FAIL`.
- Reject if amount <= 0.
- Complete otherwise.

## 11.5 movement-orchestrator

Technology:

```text id="bd0mgj"
Node.js 24 + TypeScript
```

Responsibilities:
- Provide HTTP API for frontend actions.
- Validate request shape.
- Generate `eventId`, `correlationId`, `idempotencyKey`.
- Publish starting events to `banking.events`.

Suggested endpoints:

```http id="lz8rhv"
GET /health

POST /api/movements/external-transfer
POST /api/movements/investment-contribution
POST /api/movements/mortgage-repayment
POST /api/demo/salary
POST /api/demo/insufficient-funds
```

Example request:

```json id="1rj26r"
{
  "sourceAccountId": "acc_main_001",
  "amount": 100,
  "currency": "EUR"
}
```

Each endpoint should return:

```json id="pni97j"
{
  "accepted": true,
  "correlationId": "...",
  "message": "Movement accepted for asynchronous processing"
}
```

## 11.6 event-log-service

Technology:

```text id="xozici"
Node.js 24 + TypeScript
```

Responsibilities:
- Consume all events from `banking.events`.
- Store events in PostgreSQL.
- Expose event history to frontend.
- Expose a real-time stream using Server-Sent Events if feasible.
- If SSE becomes too time-consuming, provide polling endpoints and document that.

Suggested endpoints:

```http id="6p429b"
GET /health
GET /api/events
GET /api/events?limit=100
GET /api/events/correlation/{correlationId}
GET /api/events/stream
```

Frontend should use SSE or polling to keep the timeline updated.

## 11.7 notification-service

Technology:

```text id="q5nto7"
Node.js 24 + TypeScript
```

Responsibilities:
- Consume relevant terminal events.
- Publish `NotificationCreated`.
- Keep logic simple.
- No need for persistent notification storage unless easy.

Create notifications for:
- `AccountDebitRejected`
- `ExternalTransferCompleted`
- `ExternalTransferRejected`
- `FundContributionCompleted`
- `FundContributionRejected`
- `MortgageRepaymentCompleted`
- `MortgageRepaymentRejected`
- `AccountCredited`

---

# 12. Frontend dashboard

Technology:

```text id="2536z2"
Next.js + React + TypeScript
```

The frontend should be visually clear and useful for the workshop.

Required UI sections:

## 12.1 Header

Show:

```text id="opxaat"
Agentic Banking Lab
Event-driven microservices playground for OpenCode workshops
```

## 12.2 Account summary card

Show:
- owner name,
- account id,
- available balance,
- reserved balance,
- currency.

Fetch from `account-service`.

## 12.3 Action panel

Buttons/forms for:

1. External transfer.
2. Investment fund contribution.
3. Mortgage repayment.
4. Simulate salary income.
5. Simulate insufficient funds.
6. Generate random demo activity.

For the first three, allow amount input.

Use default values to make the demo quick.

## 12.4 Event timeline

Show events in reverse chronological order.

For each event show:
- event type,
- producer,
- occurredAt,
- correlationId short value,
- causationId short value if present,
- amount/currency if present,
- status color or badge.

Group or visually connect events by `correlationId` if possible.

## 12.5 Flow detail panel

When clicking an event or correlation ID, show the full flow for that correlation ID.

## 12.6 Service status panel

Show basic health status for:
- account-service,
- movement-orchestrator,
- event-log-service,
- mortgage-service,
- investment-service,
- external-transfer-service,
- notification-service.

Use `/health` endpoints.

Keep this simple.

---

# 13. Demo data generator

Create:

```text id="5sn1ib"
tools/demo-data-generator/
```

Technology:

```text id="yhpsho"
Python 3.14 preferred
```

Purpose:
- Generate realistic demo activity.
- Trigger orchestrator endpoints.
- Make the dashboard look alive.

Required features:
- CLI script to generate N random movements.
- CLI script to generate a morning banking scenario.
- Include some successful flows.
- Include at least one insufficient funds scenario.
- Include at least one rejected external transfer.

Example commands:

```bash id="oeepyy"
python tools/demo-data-generator/generate.py --scenario morning
python tools/demo-data-generator/generate.py --events 20
```

Add root wrapper script:

```bash id="o3l119"
make demo-data
```

or:

```bash id="2gwv94"
npm run demo:data
```

---

# 14. Infrastructure

Create Docker Compose under:

```text id="pfdofs"
infra/docker-compose.yml
```

Also make root-level commands easy, for example through `Makefile`.

Required containers:
- Redpanda.
- PostgreSQL.
- account-service.
- mortgage-service.
- investment-service.
- external-transfer-service.
- movement-orchestrator.
- event-log-service.
- notification-service.
- web-dashboard.

Optional:
- Redpanda Console.

Suggested ports:

```text id="byy7ul"
web-dashboard:              3000
movement-orchestrator:      3001
event-log-service:          3002
notification-service:       3003
external-transfer-service:  3004

account-service:            8081
mortgage-service:           8082
investment-service:         8083

postgres:                   5432
redpanda kafka:             9092
redpanda admin:             9644
redpanda console:           8080, if included
```

Avoid port collision if needed.

Root commands should include:

```bash id="a71891"
make up
make down
make logs
make demo-data
make test
```

If Makefile is not available in the environment, provide equivalent npm scripts and document both.

---

# 15. OpenCode integration

This is critical. The repository must be designed to demonstrate OpenCode features.

Create:

```text id="lpzd3v"
.opencode/
  agents/
  skills/
  commands/
```

Also create:

```text id="sfzycc"
AGENTS.md
```

The OpenCode setup should be useful even outside this workshop.

---

# 16. AGENTS.md

Create a clear root `AGENTS.md`.

It should include:

1. Project purpose.
2. Architecture summary.
3. Technology map.
4. Service ownership.
5. Event-driven rules.
6. How to run locally.
7. How to test.
8. Coding conventions.
9. What not to do.
10. Preferred workflow for agents.

Example guidance to include:

```markdown id="ozponk"
# AGENTS.md

This repository is a workshop lab for agentic programming with OpenCode.

The main goal is not to build a production bank. The main goal is to provide a realistic multi-service codebase where agents can:
- inspect architecture,
- modify services,
- add use cases,
- review security,
- review event contracts,
- generate demo data,
- troubleshoot local platform issues.

## Rules

- Keep the system demoable with Docker Compose.
- Preserve correlationId across the full flow.
- Do not introduce real authentication.
- Do not add Kubernetes, Helm or Terraform.
- Prefer small, understandable code over generic frameworks.
- Do not create new microservices unless clearly useful for the workshop.
- Any new business flow must appear in the frontend timeline.
- Any new event must be added to packages/event-contracts and docs/EVENTS.md.
```

---

# 17. OpenCode agents

Create Markdown agents under:

```text id="av7ny3"
.opencode/agents/
```

Use valid OpenCode-style Markdown frontmatter.

Create at least these agents:

```text id="xmea8d"
spring-agent.md
frontend-agent.md
node-agent.md
event-architect-agent.md
security-agent.md
platform-agent.md
data-agent.md
qa-agent.md
docs-agent.md
```

Do not hardcode a specific paid model unless required. If adding `model`, use a placeholder comment or omit it. The user can configure their preferred model.

## 17.1 spring-agent.md

Purpose:
- Java 25.
- Spring Boot 4.
- Kafka consumers/producers.
- REST endpoints.
- Maven.
- PostgreSQL.
- JUnit.
- Service boundaries.

Suggested behavior:
- Work only inside Java services unless asked otherwise.
- Preserve event envelope.
- Prefer simple Spring Boot patterns.
- Keep code workshop-readable.
- Avoid complex frameworks unless necessary.

## 17.2 frontend-agent.md

Purpose:
- Next.js.
- React.
- TypeScript.
- Dashboard UX.
- Event timeline.
- Correlation visualizations.
- API integration.

Suggested behavior:
- Keep UI clean and demo-friendly.
- Do not overcomplicate state management.
- Prefer simple hooks and components.
- Make event flows easy to understand visually.

## 17.3 node-agent.md

Purpose:
- Node.js 24.
- TypeScript.
- Lightweight services.
- Kafka clients.
- Express/Fastify.
- SSE endpoints.
- Event-log service.
- Orchestrator service.

Suggested behavior:
- Keep APIs small.
- Validate inputs.
- Preserve correlationId and causationId.
- Avoid unnecessary frameworks.

## 17.4 event-architect-agent.md

Purpose:
- Event-driven architecture.
- Event naming.
- Event envelope.
- Correlation ID.
- Causation ID.
- Idempotency.
- Business event design.
- Service boundaries.

Suggested behavior:
- Review event contracts before implementation.
- Reject entity-centric events.
- Prefer business facts.
- Keep events versioned.
- Ensure all new events are documented.

## 17.5 security-agent.md

Purpose:
- Security review.
- Input validation.
- Secrets.
- Logs.
- PII exposure.
- Financial operation risks.
- Idempotency and replay risks.

Suggested behavior:
- Read-only by default if possible.
- Provide risks and concrete mitigations.
- Do not add real auth unless asked.
- For this lab, suggest realistic production considerations without overbuilding the demo.

## 17.6 platform-agent.md

Purpose:
- Docker Compose.
- Redpanda.
- PostgreSQL.
- Health checks.
- Local troubleshooting.
- Ports and networking.
- Service startup order.

Suggested behavior:
- Make the platform easy to run.
- Prefer clear scripts.
- Diagnose common local issues.
- Avoid Kubernetes.

## 17.7 data-agent.md

Purpose:
- Python demo data generator.
- Test scenarios.
- Realistic banking activity.
- Synthetic event generation through public APIs.

Suggested behavior:
- Generate data through the orchestrator API, not by writing directly to databases.
- Include success and failure flows.
- Make demos visually interesting.

## 17.8 qa-agent.md

Purpose:
- Tests.
- Contract tests.
- Unit tests.
- Integration sanity checks.
- Test strategy.

Suggested behavior:
- Prefer small meaningful tests.
- Add tests for event flow decisions.
- Add smoke tests where full integration is too heavy.

## 17.9 docs-agent.md

Purpose:
- README.
- Workshop guide.
- Architecture docs.
- Troubleshooting.
- Diagrams in Mermaid.

Suggested behavior:
- Write clear docs for humans.
- Keep docs aligned with actual code.
- Include copy-pasteable commands.

---

# 18. OpenCode skills

Create skills under:

```text id="gvcqje"
.opencode/skills/<skill-name>/SKILL.md
```

Each `SKILL.md` must have valid frontmatter with at least:

```yaml id="ljmyac"
---
name: skill-name
description: Specific description here
---
```

Create at least these skills:

```text id="lyejqw"
event-driven-design
service-boundaries
banking-domain
security-review
docker-compose-troubleshooting
frontend-visualization
testing-strategy
workshop-facilitation
```

## 18.1 event-driven-design

Include guidance:
- events are facts,
- commands and events are different,
- use PascalCase event names,
- include event version,
- use eventId/correlationId/causationId,
- design events for consumers,
- avoid leaking internal database structure,
- use idempotency for repeated operations,
- document every event.

## 18.2 service-boundaries

Include guidance:
- do not create microservices by entity,
- create services by business capability,
- each service owns its state,
- avoid direct DB access across services,
- sync HTTP should be explicit and limited,
- async communication should be understandable.

## 18.3 banking-domain

Include guidance:
- this is a demo bank, not a real ledger,
- use realistic naming,
- do not imply real-money safety,
- model reservations, commits and releases,
- distinguish available and reserved balance,
- keep financial amounts precise,
- use decimal types where possible.

## 18.4 security-review

Include guidance:
- validate amount,
- validate currency,
- avoid logging sensitive data,
- avoid secrets in repo,
- think about replay/idempotency,
- mention auth/authorization as production concern,
- check dependency/config risks.

## 18.5 docker-compose-troubleshooting

Include guidance:
- check ports,
- check container health,
- check Redpanda broker address,
- check database connectivity,
- check service logs,
- check environment variables,
- check startup order.

## 18.6 frontend-visualization

Include guidance:
- prioritize clarity,
- show correlation IDs,
- group event flows,
- use badges for event types,
- make async behavior visible,
- avoid complex UI libraries if unnecessary.

## 18.7 testing-strategy

Include guidance:
- unit test business rules,
- smoke test service health,
- test rejected flows,
- test event contract shape,
- prefer meaningful few tests over broad shallow tests.

## 18.8 workshop-facilitation

Include guidance:
- this repo is used live,
- demos must be robust,
- commands must be copy-pasteable,
- documentation should support a one-hour workshop,
- failures should be explainable.

---

# 19. OpenCode commands

Create custom commands under:

```text id="0nn19m"
.opencode/commands/
```

Use Markdown command files when possible.

Create at least:

```text id="s52va3"
explain-architecture.md
platform-up.md
generate-demo-data.md
add-use-case.md
security-review.md
event-contract-review.md
test-flow.md
review-changes.md
workshop-demo.md
```

The commands should be useful in the workshop.

If OpenCode command frontmatter supports agent selection in the installed version, use it. If not, keep the command as a prompt that explicitly asks the active agent to delegate to the appropriate `@subagent`.

## 19.1 explain-architecture.md

Purpose:
- Inspect the repository.
- Explain the architecture.
- List services.
- List technologies.
- List event flows.
- List how to run.

Should mention using:
- `@event-architect-agent`
- `@docs-agent`
- `@platform-agent`

## 19.2 platform-up.md

Purpose:
- Help the user start the platform.
- Check Docker Compose.
- Explain services and ports.
- Diagnose startup problems.

It can include shell output injection if supported, for example:

```markdown id="1a4t6e"
!`docker compose -f infra/docker-compose.yml ps`
```

But do not rely exclusively on shell injection.

## 19.3 generate-demo-data.md

Purpose:
- Use `@data-agent`.
- Generate demo banking activity.
- Use Python data generator.
- Make frontend timeline interesting.

## 19.4 add-use-case.md

Purpose:
- The star command of the workshop.
- Given a new use case in `$ARGUMENTS`, analyze and propose required changes across:
  - event contracts,
  - Java services,
  - Node services,
  - frontend,
  - tests,
  - docs.

It should instruct the agent to coordinate:
- `@event-architect-agent`
- `@spring-agent`
- `@node-agent`
- `@frontend-agent`
- `@qa-agent`
- `@security-agent`
- `@docs-agent`

Example usage:

```text id="htg2it"
/add-use-case "credit card payment"
```

Expected behavior:
- First propose event names.
- Then identify service changes.
- Then implement if in Build mode.
- Update docs.
- Add frontend action.
- Add tests or testing notes.

## 19.5 security-review.md

Purpose:
- Use `@security-agent`.
- Review the current codebase.
- Focus on:
  - input validation,
  - idempotency,
  - replay risks,
  - logging,
  - secrets,
  - financial operation risks.

## 19.6 event-contract-review.md

Purpose:
- Use `@event-architect-agent`.
- Review all event schemas and actual emitted events.
- Check naming, versioning, correlation and causation.

## 19.7 test-flow.md

Purpose:
- Given a flow name in `$ARGUMENTS`, suggest or run relevant tests.
- Example:

```text id="6ejn1r"
/test-flow mortgage-repayment
```

## 19.8 review-changes.md

Purpose:
- Review recent git changes.
- Use git diff if available.
- Ask relevant subagents to review their areas.

## 19.9 workshop-demo.md

Purpose:
- Provide a step-by-step script for the live workshop.
- Explain what to run and what to show.

---

# 20. Documentation

Create these docs.

## 20.1 README.md

Must include:
- project purpose,
- architecture diagram in Mermaid,
- tech stack,
- quickstart,
- commands,
- ports,
- how to use the frontend,
- how to generate demo data,
- how to use OpenCode commands,
- known limitations.

Quickstart should be something like:

```bash id="gx6qvk"
make up
```

Then:

```text id="11vntr"
Open http://localhost:3000
```

## 20.2 docs/ARCHITECTURE.md

Include:
- service map,
- responsibilities,
- event flow,
- Mermaid diagram,
- technology choices,
- why this is intentionally simplified.

## 20.3 docs/EVENTS.md

Include:
- event envelope,
- event type list,
- payload examples,
- correlation/causation explanation,
- event flow examples.

## 20.4 docs/WORKSHOP_SCRIPT.md

Include a one-hour workshop script.

Suggested structure:

```text id="jefbwh"
0-5 min: Introduction to agentic programming
5-10 min: Explain repo and architecture
10-15 min: OpenCode /init and AGENTS.md
15-25 min: Run platform and show dashboard
25-35 min: Trigger banking flows
35-45 min: Use OpenCode commands and subagents
45-55 min: Add a new use case
55-60 min: Review, questions, takeaways
```

## 20.5 docs/OPENCODE_GUIDE.md

Include:
- how agents are structured,
- how skills are structured,
- how commands are structured,
- suggested demo prompts,
- examples using `@spring-agent`, `@security-agent`, etc.

## 20.6 docs/TROUBLESHOOTING.md

Include:
- Docker not running,
- port conflicts,
- Redpanda not reachable,
- PostgreSQL connection issue,
- frontend cannot reach API,
- services start before broker/database,
- how to inspect logs.

---

# 21. Root developer commands

Create a `Makefile`.

At minimum:

```makefile id="r0ood7"
up:
	docker compose -f infra/docker-compose.yml up --build

down:
	docker compose -f infra/docker-compose.yml down -v

logs:
	docker compose -f infra/docker-compose.yml logs -f

ps:
	docker compose -f infra/docker-compose.yml ps

demo-data:
	python tools/demo-data-generator/generate.py --scenario morning

test:
	# run available tests, but do not fail if some optional service test setup is unavailable
```

Also consider:

```makefile id="c6kxws"
restart:
	docker compose -f infra/docker-compose.yml down
	docker compose -f infra/docker-compose.yml up --build
```

If using npm scripts at root, add equivalents.

---

# 22. Coding standards

## General

- Keep code readable.
- Avoid excessive abstractions.
- Add comments only when they clarify demo behavior.
- Prefer simple explicit code over generic frameworks.
- Ensure all services have `/health`.

## TypeScript

- Use strict TypeScript.
- Use a simple HTTP framework such as Express or Fastify.
- Use a Kafka client compatible with Redpanda.
- Validate inputs with a lightweight validation library or explicit checks.
- Keep config in environment variables.

## Java

- Use Spring Boot 4.x.
- Use Maven wrapper if possible.
- Use decimal-safe types for money, e.g. `BigDecimal`.
- Keep service structure simple:
  - controller,
  - service,
  - kafka consumer/producer,
  - repository,
  - model/dto.
- Add minimal tests for business rules.

## Python

- Keep generator simple.
- Use standard library + requests/httpx if needed.
- Make script easy to run.

---

# 23. Environment variables

Use clear environment variables.

Examples:

```text id="6mb4gg"
KAFKA_BOOTSTRAP_SERVERS=redpanda:9092
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=banking
POSTGRES_USER=banking
POSTGRES_PASSWORD=banking
ACCOUNT_SERVICE_URL=http://account-service:8081
EVENT_LOG_SERVICE_URL=http://event-log-service:3002
MOVEMENT_ORCHESTRATOR_URL=http://movement-orchestrator:3001
```

For frontend, use appropriate public env vars, for example:

```text id="hodgdy"
NEXT_PUBLIC_ACCOUNT_SERVICE_URL=http://localhost:8081
NEXT_PUBLIC_EVENT_LOG_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_MOVEMENT_ORCHESTRATOR_URL=http://localhost:3001
```

If browser networking with Docker service names causes issues, ensure frontend uses localhost URLs when running in browser.

---

# 24. Docker requirements

Each service should have a Dockerfile.

Use multi-stage builds where reasonable, but keep it understandable.

Frontend should run in container.

Java services should build using Maven inside Docker or use a simple Maven build stage.

Node services should install dependencies and run compiled TypeScript or tsx. Prefer production-ish but simple.

Python generator does not need to run as a long-lived container unless useful.

---

# 25. Event-log persistence

Create a simple table for events.

Suggested shape:

```sql id="20zj17"
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  event_version INTEGER NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL,
  producer TEXT NOT NULL,
  correlation_id TEXT NOT NULL,
  causation_id TEXT,
  aggregate_id TEXT,
  payload JSONB NOT NULL,
  raw_event JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

`event-log-service` should ignore duplicate `event_id`.

---

# 26. Account persistence

Create tables for accounts and processed events.

Suggested:

```sql id="9whllf"
CREATE TABLE IF NOT EXISTS accounts (
  account_id TEXT PRIMARY KEY,
  owner_name TEXT NOT NULL,
  currency TEXT NOT NULL,
  available_balance NUMERIC(19, 4) NOT NULL,
  reserved_balance NUMERIC(19, 4) NOT NULL,
  booked_debit_total NUMERIC(19, 4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS processed_events (
  event_id TEXT PRIMARY KEY,
  processed_at TIMESTAMPTZ DEFAULT now()
);
```

Initialize demo account if missing.

---

# 27. Testing expectations

Do not spend all time on tests, but include meaningful examples.

Minimum:
- account-service unit test for insufficient funds.
- account-service unit test for successful reservation.
- one Node service test or documented smoke test.
- documented manual end-to-end test:
  1. start platform,
  2. open frontend,
  3. send investment contribution,
  4. observe events,
  5. verify balance changed,
  6. trigger insufficient funds,
  7. observe rejection.

If full automated integration tests are too heavy, document how to test manually.

---

# 28. Frontend visual design guidance

Keep the UI professional and demo-friendly.

Suggested layout:

```text id="9iuw4q"
-------------------------------------------------------
Agentic Banking Lab
Event-driven microservices playground
-------------------------------------------------------

[Account Summary] [Service Status]

[Actions]
- External Transfer
- Investment Contribution
- Mortgage Repayment
- Salary Simulation
- Insufficient Funds
- Generate Demo Data

[Event Timeline]
MoneyMovementRequested
AccountDebitReserved
FundContributionRequested
FundContributionCompleted
AccountDebitCommitted
NotificationCreated

[Selected Flow Details]
Correlation ID: ...
Raw events...
```

Use colors/badges:
- green: completed/credited/committed,
- red: rejected,
- yellow: reserved/requested,
- blue/gray: informational.

Do not make the UI childish. It should look like an internal engineering dashboard.

---

# 29. Workshop demo flow

The final repo should support this live demo:

## Step 1: Open repo with OpenCode

Show:

```text id="c3v10l"
/init
```

or show existing `AGENTS.md`.

## Step 2: Explain architecture

Run:

```text id="t6f7cx"
/explain-architecture
```

Expected result:
- agent explains services, event flows, technologies.

## Step 3: Start platform

Run:

```bash id="ox3tr6"
make up
```

or OpenCode command:

```text id="0omc32"
/platform-up
```

Expected:
- containers start,
- frontend available at `localhost:3000`.

## Step 4: Show dashboard

Open frontend.

Show:
- account balance,
- service health,
- empty or initial event timeline.

## Step 5: Trigger flows

Click:
- investment contribution,
- mortgage repayment,
- external transfer,
- insufficient funds.

Show:
- event timeline,
- correlation IDs,
- service communication.

## Step 6: Generate demo data

Run:

```text id="bpdeei"
/generate-demo-data
```

or:

```bash id="n2l0cj"
make demo-data
```

Show:
- timeline fills with realistic events.

## Step 7: Add a new use case

Use OpenCode:

```text id="uwd26n"
/add-use-case "credit card payment from the main account"
```

Expected:
- agent proposes event changes,
- modifies relevant services if in Build mode,
- updates frontend,
- updates docs,
- suggests tests,
- security agent reviews risks.

This command is the workshop highlight.

## Step 8: Security review

Run:

```text id="demm78"
/security-review
```

Expected:
- agent finds realistic concerns:
  - no auth,
  - no real ledger,
  - simple idempotency,
  - logging considerations,
  - replay considerations,
  - validation improvements.

## Step 9: Closing

Explain:
- This same approach can be used in real projects.
- Agents become more useful when the repo has clear boundaries, docs, commands and skills.

---

# 30. Definition of done

The implementation is complete when:

1. Repository has the expected monorepo structure.
2. Docker Compose can start the local platform.
3. Frontend loads successfully.
4. User can trigger at least:
   - external transfer,
   - investment contribution,
   - mortgage repayment,
   - salary simulation,
   - insufficient funds scenario.
5. Events are published to Redpanda.
6. Event-log service stores events.
7. Frontend displays events.
8. Account balance changes visibly.
9. OpenCode agents exist.
10. OpenCode skills exist.
11. OpenCode commands exist.
12. `AGENTS.md` exists and is useful.
13. README explains how to run everything.
14. Workshop script exists.
15. Architecture and event docs exist.
16. Basic tests or smoke tests exist.
17. The repo feels like a realistic engineering lab, not a hello world.

---

# 31. Prioritization if time is limited

If full implementation is too large, prioritize in this order:

1. Docker Compose with Redpanda and PostgreSQL.
2. movement-orchestrator.
3. account-service.
4. event-log-service.
5. frontend dashboard.
6. investment-service.
7. mortgage-service.
8. external-transfer-service.
9. notification-service.
10. demo-data-generator.
11. OpenCode agents.
12. OpenCode skills.
13. OpenCode commands.
14. docs.

However, the final target is to implement all items.

---

# 32. Specific implementation notes

## Kafka / Redpanda client behavior

Use consumer groups per service.

Example groups:
- `account-service`
- `investment-service`
- `mortgage-service`
- `external-transfer-service`
- `event-log-service`
- `notification-service`

All consume from:

```text id="fct32h"
banking.events
```

Each service filters by `eventType` and payload fields.

This is acceptable for the demo. Document that in production topic design might be different.

## Event publishing

Create shared event utility per language if easy:
- TypeScript: event factory helper.
- Java: event envelope class.
- Python: helper to call orchestrator rather than direct Kafka.

No need for cross-language generated code.

## Money precision

Use:
- Java: `BigDecimal`.
- TypeScript: represent as number for demo but document limitation, or use string/decimal library if simple.
- JSON payload can use numeric amount for readability.

## Idempotency

At minimum:
- `account-service` must persist processed event IDs.
- `event-log-service` must ignore duplicate event IDs.
- Other services may be best effort.

## CORS

Configure services so the browser frontend can call APIs from localhost.

## Service health

Every service should expose:

```http id="vur7l7"
GET /health
```

Returning:

```json id="pajwem"
{
  "status": "UP",
  "service": "service-name"
}
```

---

# 33. Do not forget these files

Create at least:

```text id="twc2mb"
README.md
AGENTS.md
Makefile

docs/ARCHITECTURE.md
docs/EVENTS.md
docs/WORKSHOP_SCRIPT.md
docs/OPENCODE_GUIDE.md
docs/TROUBLESHOOTING.md

.opencode/agents/spring-agent.md
.opencode/agents/frontend-agent.md
.opencode/agents/node-agent.md
.opencode/agents/event-architect-agent.md
.opencode/agents/security-agent.md
.opencode/agents/platform-agent.md
.opencode/agents/data-agent.md
.opencode/agents/qa-agent.md
.opencode/agents/docs-agent.md

.opencode/skills/event-driven-design/SKILL.md
.opencode/skills/service-boundaries/SKILL.md
.opencode/skills/banking-domain/SKILL.md
.opencode/skills/security-review/SKILL.md
.opencode/skills/docker-compose-troubleshooting/SKILL.md
.opencode/skills/frontend-visualization/SKILL.md
.opencode/skills/testing-strategy/SKILL.md
.opencode/skills/workshop-facilitation/SKILL.md

.opencode/commands/explain-architecture.md
.opencode/commands/platform-up.md
.opencode/commands/generate-demo-data.md
.opencode/commands/add-use-case.md
.opencode/commands/security-review.md
.opencode/commands/event-contract-review.md
.opencode/commands/test-flow.md
.opencode/commands/review-changes.md
.opencode/commands/workshop-demo.md
```

---

# 34. Final response expected from Codex after implementation

When done, respond with:

1. Summary of created architecture.
2. Services created.
3. Technologies used.
4. How to run.
5. How to test.
6. How to use the OpenCode agents/skills/commands.
7. Known limitations.
8. Suggested next improvements.

Do not provide a vague response. Be explicit.

---

# 35. Quality bar

This repository should be good enough that someone can clone it and understand:

- how the system works,
- how events flow,
- how to run it,
- how to use OpenCode on it,
- how subagents are useful,
- how skills encode reusable engineering knowledge,
- how custom commands turn repeated workflows into repeatable agentic operations.

The workshop should demonstrate agentic programming through a realistic multi-technology system, not through isolated toy examples.

