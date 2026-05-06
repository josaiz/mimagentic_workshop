---
description: Explain services, technologies, and event flows.
agent: workshop-agent
---

Explain Agentic Banking Lab for a workshop participant.

Ground the answer in:

@README.md
@docs/ARCHITECTURE.md
@docs/EVENTS.md
@infra/docker-compose.yml
@AGENTS.md
@docs/OPENCODE_GUIDE.md

Use `@event-architect-agent`, `@docs-agent`, and `@platform-agent` perspectives.

Include:

- service map,
- technology map,
- main `banking.events` flow,
- account reservation/commit/release behavior,
- dashboard/event-log/SSE path,
- how to run locally,
- where to look when adding a new flow,
- how OpenCode agents, skills, commands, permissions, formatters, and custom tools support the lab.

Keep it concise enough to say live in five minutes.
