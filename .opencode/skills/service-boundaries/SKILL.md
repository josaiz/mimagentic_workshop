---
name: service-boundaries
description: Guidance for small, understandable microservice boundaries.
---

Create services by business capability, not by entity. Each service owns its state. Avoid cross-service database access. Keep synchronous HTTP explicit and limited. Keep asynchronous communication visible and understandable.
