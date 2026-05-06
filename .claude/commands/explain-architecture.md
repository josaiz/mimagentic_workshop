Use the platform and node and spring and frontend sub-agents as needed to explain the Agentic Banking Lab architecture to a workshop participant.

Cover the following in order:

1. **What this system does** — a simplified event-driven banking platform for learning agentic programming patterns

2. **Service map** — list all services with their port, stack, and role:
   - web-dashboard (3000) — Next.js dashboard
   - movement-orchestrator (3001) — validates requests, publishes start events
   - event-log-service (3002) — persists all events, exposes history and SSE
   - notification-service (3003) — creates notification events
   - external-transfer-service (3004) — handles external transfers
   - account-service (8081) — owns account state, balances, reservations
   - mortgage-service (8082) — handles mortgage repayments
   - investment-service (8083) — handles fund contributions
   - Redpanda (9092) — Kafka-compatible event broker
   - PostgreSQL (5432) — persistence

3. **Event flow** — trace a salary payment end-to-end:
   - Dashboard triggers → movement-orchestrator validates → publishes SalaryStarted
   - account-service consumes SalaryStarted → credits account → publishes SalaryReceived
   - notification-service publishes SalaryNotificationSent
   - event-log-service persists every event → dashboard updates via SSE

4. **Key design choices**:
   - Single topic `banking.events`; single account `acc_main_001`; EUR only
   - Every event carries `correlationId` (preserves across flow) and `causationId` (tracks which event caused this one)
   - `idempotencyKey` on every event for safe consumer replay

5. **Intentional simplifications** (workshop-only):
   - No authentication, no TLS between services
   - Single account, single currency
   - Shared PostgreSQL database

Make it concrete and visual — use a simple ASCII diagram of the event flow if helpful.
