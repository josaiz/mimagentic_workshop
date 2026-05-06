---
description: Run the one-hour workshop demo script.
agent: workshop-agent
---

Use `@workshop-agent`, `@docs-agent`, `@platform-agent`, `@data-agent`, `@event-architect-agent`, `@qa-agent`, and `@security-agent` perspectives.

Ground the facilitation in:

@docs/WORKSHOP_SCRIPT.md
@docs/OPENCODE_GUIDE.md
@AGENTS.md
@opencode.json

Run the workshop arc:

1. Explain repo purpose and lab boundaries.
2. Show `AGENTS.md`, `.opencode/agents`, `.opencode/skills`, `.opencode/commands`, `.opencode/tools`, and `opencode.json`.
3. Run `/opencode-map`.
4. Run `/explain-architecture`.
5. Start or diagnose the stack with `/platform-up`.
6. Open `http://localhost:3000` and optionally Redpanda Console at `http://localhost:8080`.
7. Trigger salary, investment, mortgage, external transfer, rejected transfer, and insufficient funds.
8. Use `/trace-correlation <id>` to reconstruct a real flow.
9. Run `/event-contract-review`.
10. Demonstrate `/design-investment-hexagonal` as the realistic backlog-ticket design step.
11. Show `/refactor-investment-hexagonal` as the build-mode entrypoint, but only run it if the live coding segment has enough time.
12. Run `/security-review`.
13. Close with `/workshop-readiness`.

Explain what each step teaches about Plan vs Build, subagents, hidden agents, skills, custom commands, shell-output grounding, permission prompts, formatters, and custom tools.
