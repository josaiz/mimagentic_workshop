---
description: Review recent git changes with stack-specific focus.
agent: workshop-agent
---

Current git status:

!`git status --short`

Diff summary:

!`git diff --stat`

Review recent changes with stack-specific focus. Delegate to relevant perspectives:

- `@event-architect-agent` for contracts and event semantics.
- `@spring-agent` for Java services.
- `@node-agent` for Node services and custom tools.
- `@frontend-agent` for dashboard UX.
- `@hexagonal-architecture-agent` for ports/adapters refactors, package boundaries, and dependency direction.
- `@qa-agent` for test gaps.
- `@security-agent` for validation, replay, logs, and demo-scope risks.
- `@docs-agent` for docs and workshop script drift.
- `@pr-review-agent` for generic PR-style findings across the final diff.

Lead with concrete findings.

For each finding include:

- priority,
- affected file/flow,
- impact,
- suggested fix,
- verification command.

If there are no findings, say so clearly and list residual risk.
