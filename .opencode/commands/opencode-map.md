---
description: Explain how this repo uses OpenCode agents, skills, commands, permissions, formatters, and custom tools.
agent: workshop-agent
---

Inventory of OpenCode assets:

!`find .opencode -maxdepth 3 -type f | sort`

Use these files:

@opencode.json
@docs/OPENCODE_GUIDE.md
@AGENTS.md

Explain:

- primary agents versus subagents,
- visible versus hidden subagents,
- how commands route work to agents,
- how skills are loaded as reusable procedures,
- how `permission.task`, shell permissions, skill permissions, and custom tool permissions protect the lab,
- what the Prettier formatter covers,
- what `.opencode/tools/banking.ts` makes easier,
- which workshop moment demonstrates each capability.

Keep the answer practical: name the command or file participants should open.
