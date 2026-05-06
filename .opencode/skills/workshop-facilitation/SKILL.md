---
name: workshop-facilitation
description: Guidance for keeping the one-hour workshop robust and clear.
---

# Workshop Facilitation Skill

## When To Use

Use this skill when preparing or running a live workshop step, writing docs for participants, or choosing between a clever implementation and a teachable one.

## Principles

- Show the real system, not a slide-only story.
- Prefer visible progress over hidden complexity.
- Make every command copy-pasteable.
- Treat failures as teachable if they are diagnosable.
- Keep the one-hour session moving.

## Procedure

1. State the learning objective before the command.
2. Show the artifact being demonstrated:
   - `AGENTS.md`
   - `.opencode/agents`
   - `.opencode/skills`
   - `.opencode/commands`
   - `.opencode/tools`
   - `opencode.json`
3. Run a command or custom tool that produces visible output.
4. Explain what changed in the agent's context or capabilities.
5. Tie the result back to the banking flow.
6. Keep recovery steps ready:

```bash
make ps
make logs
make down
make up
```

## Checklist

- The demo has a clear before/after.
- Participants can inspect the artifact afterwards.
- The command does not require private credentials.
- A failure path has a short recovery story.
- The lesson maps to real work: planning, implementation, review, QA, or ops.

## Output Format

Return:

- `Teaching point`: agentic concept being shown.
- `Demo action`: exact command or file to open.
- `Expected result`: what participants should observe.
- `Recovery`: what to do if it fails.

## Example

Run `/event-contract-review` after adding an event type to show how a command can encode a repeated multi-file review workflow.
