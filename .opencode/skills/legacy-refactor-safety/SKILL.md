---
name: legacy-refactor-safety
description: Behavior-preserving refactor checklist for small services where the safest change is structural rather than functional.
---

# Legacy Refactor Safety Skill

## When To Use

Use this skill when a backlog task asks for a refactor without a product behavior change.

## Procedure

1. Write down observable behavior before editing.
2. Identify files that must stay untouched.
3. Move one responsibility at a time.
4. Keep event names, payloads, IDs, idempotency keys, and public APIs stable.
5. Add characterization tests around current behavior.
6. Run the fastest relevant tests after each meaningful move.
7. Review the diff for accidental feature changes.

## Checklist

- No event contract change unless explicitly required.
- No public HTTP/Kafka shape change.
- Existing success and rejection behavior preserved.
- Duplicate/replay behavior preserved.
- Tests prove behavior, not package names.
- Documentation describes why the refactor exists.

## Output Format

Return:

- `Observable behavior`: what must stay true.
- `Protected surfaces`: files/APIs/contracts not to change.
- `Safe sequence`: ordered refactor steps.
- `Characterization tests`: tests before or during refactor.
- `Regression risks`: likely ways the refactor could accidentally change behavior.
