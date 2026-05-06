---
name: event-driven-design
description: Guidance for business event design in Agentic Banking Lab.
---

Events are facts, not implementation commands. Use PascalCase names, `eventVersion`, `eventId`, `correlationId`, and `causationId`. Design payloads for consumers, avoid database leakage, preserve idempotency, and document every event.
