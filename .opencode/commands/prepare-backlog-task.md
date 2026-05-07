---
description: Prepare OpenCode workflow assets from a pasted Miro/Jira backlog task without implementing the task.
arguments: TASK_TEXT
agent: backlog-task-agent
---

Backlog task:

```text
$ARGUMENTS
```

Use `@backlog-task-agent` and the `backlog-task-intake` skill.

Ground the task in the current repo before editing assets:

@docs/BACKLOG_STORIES.md
@docs/OPENCODE_GUIDE.md
@.opencode/commands/review-changes.md
@.opencode/agents/workshop-agent.md

Inventory available OpenCode assets:

!`find .opencode/agents .opencode/commands .opencode/skills -maxdepth 3 -type f | sort`

Prepare only workflow assets. Do not implement the product feature itself.

Required output:

- parsed task and classification;
- detected task ID and normalized command prefix;
- existing agents/skills to reuse;
- whether any new agent or skill is needed;
- command(s) created;
- `docs/BACKLOG_STORIES.md` entry created or updated;
- development entrypoint to run next;
- verification commands.

If the pasted task includes an identifier such as `TASK-98`, every generated command name and command filename must start with the normalized task ID, for example:

```text
/task-98-add-account-spending-power-endpoint
.opencode/commands/task-98-add-account-spending-power-endpoint.md
```
