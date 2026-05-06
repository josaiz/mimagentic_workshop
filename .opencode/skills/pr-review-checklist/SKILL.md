---
name: pr-review-checklist
description: Generic pull-request review checklist for local diffs in the workshop repo.
---

# PR Review Checklist Skill

## When To Use

Use this skill for `/review-changes` and final review of any local diff.

## Inputs

Use these sources before reviewing:

- `git status --short`
- `git diff --stat`
- `git diff --name-only`
- focused `git diff -- <file>`
- surrounding code via `rg` when the diff depends on existing behavior.

## Review Order

1. Behavior regressions.
2. Event contract and causation drift.
3. Architecture boundary mistakes.
4. Missing tests for changed behavior.
5. Security, validation, replay, and logging risks.
6. Documentation/workshop drift.
7. Style or maintainability issues only when they affect understanding.

## Severity Model

- `[P1]`: blocks core behavior, corrupts event contracts, breaks platform startup, or risks incorrect account state.
- `[P2]`: important regression, missing test for risky logic, boundary leak, replay/idempotency risk, or participant-visible confusion.
- `[P3]`: maintainability, docs, or workshop clarity issue worth fixing before polish.

## Checklist

- Does the diff change externally visible behavior?
- Are new abstractions justified by reduced coupling or better tests?
- Are event IDs, idempotency keys, `correlationId`, and `causationId` preserved?
- Are tests focused and meaningful?
- Are demo scope boundaries respected?
- Is the documentation updated when participant-facing behavior changes?
- Does the review avoid nitpicks unless they hide concrete risk?

## Output Format

Lead with findings:

```text
[P1/P2/P3] Finding title
File:
Line:
Impact:
Evidence:
Suggested fix:
Verification:
```

After findings, include open questions, test gaps, and a short summary. If no findings exist, say so clearly and include residual risk.
