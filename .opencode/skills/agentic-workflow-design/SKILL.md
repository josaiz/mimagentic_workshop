---
name: agentic-workflow-design
description: Guidance for designing OpenCode workflows that demonstrate agents, skills, commands, permissions, formatters, and custom tools.
---

# Agentic Workflow Design Skill

## When To Use

Use this skill when creating or explaining OpenCode assets in `.opencode`.

## Design Goals

- Commands encode repeatable workflows.
- Agents encode durable perspectives and boundaries.
- Skills encode reusable procedures.
- Permissions make safety visible.
- Formatters keep generated files consistent.
- Custom tools make project-specific truth easy to query.

## Procedure

1. Start with the participant task:
   - understand architecture
   - design a new flow
   - review contracts
   - trace a broken correlation
   - check workshop readiness
2. Choose the entrypoint:
   - command for repeatable workflows.
   - agent mention for a perspective.
   - skill for reusable method.
   - custom tool for project-specific data access.
3. Make handoffs explicit:
   - event design before implementation.
   - QA/security before finalizing risky changes.
   - docs after behavior changes.
4. Make outputs structured enough to be compared live.
5. Include safe shell output or file references when that improves grounding.
6. Avoid magical one-shot commands that hide the learning objective.

## Checklist

- The artifact teaches one OpenCode concept clearly.
- It uses real repo paths and flows.
- It has a bounded output contract.
- It respects the lab scope.
- It can fail gracefully with a useful next step.

## Output Format

Return:

- `Workflow`: command/agent/skill/tool entrypoint.
- `Concept demonstrated`: agentic programming lesson.
- `Inputs`: arguments, files, or tools.
- `Outputs`: expected structured result.
- `Safety`: relevant permission or scope boundary.
