# Graph Report - /Users/jorge/IdeaProjects/mimagentic_workshop  (2026-05-06)

## Corpus Check
- Corpus is ~13,672 words - fits in a single context window. You may not need a graph.

## Summary
- 216 nodes · 266 edges · 33 communities detected
- Extraction: 82% EXTRACTED · 18% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.81)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Service Applications & E2E Tests|Service Applications & E2E Tests]]
- [[_COMMUNITY_Business Flows & Architecture|Business Flows & Architecture]]
- [[_COMMUNITY_Kafka Event Handlers & Publishers|Kafka Event Handlers & Publishers]]
- [[_COMMUNITY_Account Service Web & Repository|Account Service Web & Repository]]
- [[_COMMUNITY_Movement Orchestrator & Event Contracts|Movement Orchestrator & Event Contracts]]
- [[_COMMUNITY_Event Log Service & SSE Streaming|Event Log Service & SSE Streaming]]
- [[_COMMUNITY_Event Envelope & Validation|Event Envelope & Validation]]
- [[_COMMUNITY_Kafka Configuration|Kafka Configuration]]
- [[_COMMUNITY_External Transfer & Notification Services|External Transfer & Notification Services]]
- [[_COMMUNITY_Dashboard Page Components|Dashboard Page Components]]
- [[_COMMUNITY_Demo Data Generator|Demo Data Generator]]
- [[_COMMUNITY_Design Principles & Scope|Design Principles & Scope]]
- [[_COMMUNITY_Monorepo Structure & Commands|Monorepo Structure & Commands]]
- [[_COMMUNITY_Jackson JSON Configuration|Jackson JSON Configuration]]
- [[_COMMUNITY_Web CORS Configuration|Web CORS Configuration]]
- [[_COMMUNITY_Dashboard Tech Stack|Dashboard Tech Stack]]
- [[_COMMUNITY_OpenCode Workflow & Commands|OpenCode Workflow & Commands]]
- [[_COMMUNITY_Health Check Controllers|Health Check Controllers]]
- [[_COMMUNITY_Architecture Diagrams|Architecture Diagrams]]
- [[_COMMUNITY_Dashboard Layout|Dashboard Layout]]
- [[_COMMUNITY_OpenCode Agents|OpenCode Agents]]
- [[_COMMUNITY_OpenCode Skills|OpenCode Skills]]
- [[_COMMUNITY_Local Ops & Ports|Local Ops & Ports]]
- [[_COMMUNITY_Next.js Env Types|Next.js Env Types]]
- [[_COMMUNITY_Investment Event Model|Investment Event Model]]
- [[_COMMUNITY_Event Log Store Tests|Event Log Store Tests]]
- [[_COMMUNITY_Account Event Model|Account Event Model]]
- [[_COMMUNITY_Account Domain Model|Account Domain Model]]
- [[_COMMUNITY_Mortgage Event Model|Mortgage Event Model]]
- [[_COMMUNITY_Docker Troubleshooting|Docker Troubleshooting]]
- [[_COMMUNITY_Workshop Framing|Workshop Framing]]
- [[_COMMUNITY_Workshop Repo Tour|Workshop Repo Tour]]
- [[_COMMUNITY_Workshop Platform|Workshop Platform]]

## God Nodes (most connected - your core abstractions)
1. `run()` - 17 edges
2. `AccountRepository` - 10 edges
3. `SmokeFailure` - 9 edges
4. `External Transfer Business Flow` - 8 edges
5. `account-service` - 8 edges
6. `createBankingEvent()` - 7 edges
7. `KafkaConfig` - 7 edges
8. `banking.events Redpanda Topic` - 7 edges
9. `Simplified Banking Domain` - 6 edges
10. `Shared Event Envelope Shape` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Envelope Validation Test` --conceptually_related_to--> `Shared Event Envelope Shape`  [INFERRED]
  packages/event-contracts/tests/envelope.test.mjs → agentic_banking_lab_codex_plan.md
- `Envelope Validation Test` --conceptually_related_to--> `Event Envelope Documentation`  [INFERRED]
  packages/event-contracts/tests/envelope.test.mjs → docs/EVENTS.md
- `Next.js Standalone Output Config` --conceptually_related_to--> `web-dashboard`  [INFERRED]
  apps/web-dashboard/next.config.mjs → agentic_banking_lab_codex_plan.md
- `OpenCode Agents` --semantically_similar_to--> `Agent Directory`  [INFERRED] [semantically similar]
  agentic_banking_lab_codex_plan.md → docs/OPENCODE_GUIDE.md
- `OpenCode Skills` --semantically_similar_to--> `Skills Directory`  [INFERRED] [semantically similar]
  agentic_banking_lab_codex_plan.md → docs/OPENCODE_GUIDE.md

## Hyperedges (group relationships)
- **External Transfer Event Flow** — codex_service_orchestrator, codex_service_account, codex_service_external_transfer, codex_service_notification, codex_service_event_log [EXTRACTED 1.00]
- **Event Envelope Core Concepts** — codex_correlation_id, codex_causation_id, codex_idempotency, codex_event_envelope [EXTRACTED 1.00]
- **All Services Consuming banking.events** — codex_service_account, codex_service_investment, codex_service_mortgage, codex_service_external_transfer, codex_service_event_log, codex_service_notification [EXTRACTED 1.00]

## Communities

### Community 0 - "Service Applications & E2E Tests"
Cohesion: 0.13
Nodes (20): AccountServiceApplication, InvestmentServiceApplication, MortgageServiceApplication, accepted_correlation(), decimal_field(), deterministic_flows(), Endpoint, fetch_correlation_events() (+12 more)

### Community 1 - "Business Flows & Architecture"
Cohesion: 0.14
Nodes (26): banking.events Redpanda Topic, Simplified Banking Domain, Demo Account acc_main_001, External Transfer Business Flow, Insufficient Funds Scenario Flow, Investment Fund Contribution Flow, Mortgage Repayment Flow, Salary Income Simulation Flow (+18 more)

### Community 2 - "Kafka Event Handlers & Publishers"
Cohesion: 0.1
Nodes (4): BankingEventConsumer, EventPublisher, InvestmentEventHandler, MortgageEventHandler

### Community 3 - "Account Service Web & Repository"
Cohesion: 0.13
Nodes (3): AccountController, AccountRepository, fetchHealth()

### Community 4 - "Movement Orchestrator & Event Contracts"
Cohesion: 0.19
Nodes (9): buildExternalTransferEvent(), buildInvestmentContributionEvent(), buildMortgageRepaymentEvent(), buildSalaryEvent(), movementId(), acceptEvent(), createBankingEvent(), getProducer() (+1 more)

### Community 5 - "Event Log Service & SSE Streaming"
Cohesion: 0.23
Nodes (3): startConsumer(), listCorrelation(), listEvents()

### Community 6 - "Event Envelope & Validation"
Cohesion: 0.24
Nodes (11): Event-Driven Rules, causationId Event Causality, correlationId Flow Linking, Shared Event Envelope Shape, Event Types Catalog, Idempotency via idempotencyKey, Ajv2020 JSON Schema Validator, Envelope Schema JSON (+3 more)

### Community 7 - "Kafka Configuration"
Cohesion: 0.32
Nodes (1): KafkaConfig

### Community 8 - "External Transfer & Notification Services"
Cohesion: 0.43
Nodes (6): deterministicUuid(), handleReserved(), messageFor(), publish(), publishNotification(), startConsumer()

### Community 9 - "Dashboard Page Components"
Cohesion: 0.43
Nodes (4): fetchAccount(), fetchEvents(), selectCorrelation(), trigger()

### Community 10 - "Demo Data Generator"
Cohesion: 0.67
Nodes (5): Action, main(), morning_scenario(), post(), random_action()

### Community 11 - "Design Principles & Scope"
Cohesion: 0.33
Nodes (6): Agent Scope and Constraints, Rationale for Simplification, Design Principle: Controlled Realistic Lab, Workshop Objective: Agentic Programming Demo, Known Limitations Disclaimer, Project Overview and Quickstart

### Community 12 - "Monorepo Structure & Commands"
Cohesion: 0.33
Nodes (6): Make and npm Commands, Repository Layout Description, Service Map with Responsibilities, Monorepo Structure, Docker Compose Local Platform, E2E Smoke Test via make e2e

### Community 13 - "Jackson JSON Configuration"
Cohesion: 0.4
Nodes (1): JacksonConfig

### Community 14 - "Web CORS Configuration"
Cohesion: 0.4
Nodes (1): WebConfig

### Community 15 - "Dashboard Tech Stack"
Cohesion: 0.4
Nodes (5): Frontend Dashboard UI Sections, web-dashboard, Next.js + React + TypeScript Frontend, Next.js Standalone Output Config, Frontend Cannot Reach APIs Issue

### Community 16 - "OpenCode Workflow & Commands"
Cohesion: 0.4
Nodes (5): OpenCode Workflow for New Use Cases, OpenCode Commands, Commands Directory, Add Use Case 45-55min, Commands and Agents 35-45min

### Community 17 - "Health Check Controllers"
Cohesion: 0.5
Nodes (1): HealthController

### Community 18 - "Architecture Diagrams"
Cohesion: 0.67
Nodes (3): Mermaid Architecture Diagram, Mermaid Architecture Diagram, Service Port and Stack Table

### Community 19 - "Dashboard Layout"
Cohesion: 1.0
Nodes (0): 

### Community 20 - "OpenCode Agents"
Cohesion: 1.0
Nodes (2): OpenCode Agents, Agent Directory

### Community 21 - "OpenCode Skills"
Cohesion: 1.0
Nodes (2): OpenCode Skills, Skills Directory

### Community 22 - "Local Ops & Ports"
Cohesion: 1.0
Nodes (2): Local Operations Guide, Port Conflicts Issue

### Community 23 - "Next.js Env Types"
Cohesion: 1.0
Nodes (0): 

### Community 24 - "Investment Event Model"
Cohesion: 1.0
Nodes (0): 

### Community 25 - "Event Log Store Tests"
Cohesion: 1.0
Nodes (0): 

### Community 26 - "Account Event Model"
Cohesion: 1.0
Nodes (0): 

### Community 27 - "Account Domain Model"
Cohesion: 1.0
Nodes (0): 

### Community 28 - "Mortgage Event Model"
Cohesion: 1.0
Nodes (0): 

### Community 29 - "Docker Troubleshooting"
Cohesion: 1.0
Nodes (1): Docker Not Running Issue

### Community 30 - "Workshop Framing"
Cohesion: 1.0
Nodes (1): Workshop Framing 0-5min

### Community 31 - "Workshop Repo Tour"
Cohesion: 1.0
Nodes (1): Repository Tour 5-10min

### Community 32 - "Workshop Platform"
Cohesion: 1.0
Nodes (1): Platform Demo 10-20min

## Knowledge Gaps
- **35 isolated node(s):** `Readable error raised when the smoke test cannot prove the platform is healthy.`, `Envelope Schema JSON`, `Next.js Standalone Output Config`, `Next.js + React + TypeScript Frontend`, `Python 3.14 Demo Data Generator` (+30 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **Thin community `Dashboard Layout`** (2 nodes): `RootLayout()`, `layout.tsx`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `OpenCode Agents`** (2 nodes): `OpenCode Agents`, `Agent Directory`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `OpenCode Skills`** (2 nodes): `OpenCode Skills`, `Skills Directory`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Local Ops & Ports`** (2 nodes): `Local Operations Guide`, `Port Conflicts Issue`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Next.js Env Types`** (1 nodes): `next-env.d.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Investment Event Model`** (1 nodes): `BankingEvent.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Event Log Store Tests`** (1 nodes): `store-event.test.ts`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Account Event Model`** (1 nodes): `BankingEvent.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Account Domain Model`** (1 nodes): `Account.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Mortgage Event Model`** (1 nodes): `BankingEvent.java`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Docker Troubleshooting`** (1 nodes): `Docker Not Running Issue`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Workshop Framing`** (1 nodes): `Workshop Framing 0-5min`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Workshop Repo Tour`** (1 nodes): `Repository Tour 5-10min`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Workshop Platform`** (1 nodes): `Platform Demo 10-20min`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `run()` connect `Service Applications & E2E Tests` to `External Transfer & Notification Services`, `Event Log Service & SSE Streaming`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Why does `startConsumer()` connect `Event Log Service & SSE Streaming` to `Service Applications & E2E Tests`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `startConsumer()` connect `External Transfer & Notification Services` to `Service Applications & E2E Tests`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `run()` (e.g. with `.main()` and `startConsumer()`) actually correct?**
  _`run()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Readable error raised when the smoke test cannot prove the platform is healthy.`, `Envelope Schema JSON`, `Next.js Standalone Output Config` to the rest of the system?**
  _35 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Service Applications & E2E Tests` be split into smaller, more focused modules?**
  _Cohesion score 0.13 - nodes in this community are weakly interconnected._
- **Should `Business Flows & Architecture` be split into smaller, more focused modules?**
  _Cohesion score 0.14 - nodes in this community are weakly interconnected._