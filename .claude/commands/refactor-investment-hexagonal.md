Use the hexagonal-architecture and qa sub-agents to execute the hexagonal refactor of investment-service.

**Hard constraints:**
- Only modify files under `services/investment-service/`
- Preserve all event types, payloads, correlationId/causationId handling exactly
- `./mvnw test` must pass after every step
- This is a workshop refactor — pragmatic over perfect

## Execution sequence

### Step 1 — Read current state
```bash
find services/investment-service/src -name "*.java" | sort
```
Read every Java file. Understand the current structure before touching anything.

### Step 2 — Write characterization tests (if missing)
Before moving any code, ensure there are tests that assert current behavior:
- The service consumes the right event type
- The service produces the right output events
- `correlationId` and `causationId` are preserved correctly

Run: `cd services/investment-service && ./mvnw test`

### Step 3 — Extract domain policy
Create `domain/InvestmentPolicy.java` (or equivalent name based on what you found):
- Pure Java class — no Spring, no Kafka, no HTTP imports
- Takes a `ContributionRequest` value object
- Returns a `ContributionResult`
- Contains the business rule logic moved from the current service class

Run: `./mvnw test` — must pass

### Step 4 — Define ports
Create port interfaces:
- `ports/in/ContributionPort.java` — the inbound operation
- `ports/out/EventPublisherPort.java` — for publishing events
- `ports/out/AccountReservationPort.java` — for calling account-service

Run: `./mvnw test`

### Step 5 — Create application use case
Create `application/ProcessContributionUseCase.java` that:
- Implements `ContributionPort`
- Depends on `EventPublisherPort` and `AccountReservationPort` via constructor injection
- Delegates business logic to `InvestmentPolicy`

Run: `./mvnw test`

### Step 6 — Thin the adapters
Update the existing `@KafkaListener` class to:
- Only translate Kafka messages to domain objects
- Delegate to `ContributionPort`
- Contain zero business logic

Update the event publisher to implement `EventPublisherPort`.

Run: `./mvnw test`

### Step 7 — Final verification
```bash
cd services/investment-service && ./mvnw test
```
Report the final package structure with `find services/investment-service/src/main/java -name "*.java" | sort`
