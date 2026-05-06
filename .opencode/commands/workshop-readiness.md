---
description: Check whether the repo is ready to teach the OpenCode workshop.
agent: workshop-agent
---

Current repo status:

!`git status --short`

OpenCode asset inventory:

!`find .opencode -maxdepth 3 -type f | sort`

Package/workspace metadata:

!`npm pkg get workspaces engines --json`

Use `@qa-agent`, `@platform-agent`, and `@docs-agent`.

Check readiness across:

- `AGENTS.md`
- `.opencode/agents`
- `.opencode/skills`
- `.opencode/commands`
- `.opencode/tools`
- `opencode.json`
- `docs/OPENCODE_GUIDE.md`
- `docs/WORKSHOP_SCRIPT.md`
- `docs/BACKLOG_STORIES.md`
- README OpenCode section
- focused test commands
- manual demo path
- backlog story commands `/design-investment-hexagonal` and `/refactor-investment-hexagonal`

Recommended commands:

```bash
npx prettier --check opencode.json ".opencode/**/*.md" ".opencode/tools/*.ts" docs/OPENCODE_GUIDE.md docs/WORKSHOP_SCRIPT.md README.md
npm test -w @agentic-banking-lab/event-contracts
npm run build -w @agentic-banking-lab/web-dashboard
```

Return:

- `Ready`
- `Needs attention`
- `Optional before live workshop`
- `Best five-minute demo path`
