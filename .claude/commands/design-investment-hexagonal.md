Use the hexagonal-architecture sub-agent to design the hexagonal refactor of investment-service. This command plans only — it does not change any code.

## Step 1 — Read the current structure

Read the investment-service source:
```bash
find services/investment-service/src/main/java -name "*.java" | sort
```
Read each Java file to understand the current structure.

## Step 2 — Identify entrypoints and effects

Document:
- **Inbound entrypoints:** What triggers this service? (Kafka events consumed, HTTP endpoints if any)
- **Outbound effects:** What does this service produce? (Events published, HTTP calls made, DB writes)
- **Domain policy:** What is the actual business rule this service enforces?

## Step 3 — Design the target layout

Produce a target directory structure following ports-and-adapters:

```
services/investment-service/src/main/java/.../
  domain/
    InvestmentPolicy.java              ← pure business rule (no Spring, no Kafka)
    ContributionRequest.java           ← domain value object
    ContributionResult.java            ← domain result
  application/
    ProcessContributionUseCase.java    ← orchestrates domain + ports
  ports/
    in/
      ContributionPort.java            ← inbound port interface
    out/
      AccountReservationPort.java      ← outbound port
      EventPublisherPort.java          ← outbound port
  adapters/
    in/
      KafkaContributionAdapter.java    ← @KafkaListener → delegates to port
    out/
      KafkaEventPublisherAdapter.java  ← implements EventPublisherPort
      HttpAccountAdapter.java          ← implements AccountReservationPort
```

Adjust names to match what you find in the actual service.

## Step 4 — Define the refactor sequence

Produce a numbered migration sequence where each step:
- Compiles independently
- Does not change observable behavior (same events in, same events out)
- Can be verified with `./mvnw test`

## Step 5 — Test plan

Describe what tests need to exist before refactoring begins (characterization tests) and what tests verify the new structure.

Present the complete design as a document the user can review before any code is touched.
