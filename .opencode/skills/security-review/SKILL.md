---
name: security-review
description: Security review checklist for the lab.
---

# Security Review Skill

## When To Use

Use this skill for code review, new flows, input validation, Docker exposure, demo credentials, logs, and replay/idempotency analysis.

## Scope Boundary

This is not a production bank. Call out production concerns clearly, but do not add real auth, OAuth, a production ledger, distributed transactions, schema registry, Kubernetes, Helm, or Terraform by default.

## Procedure

1. Validate externally supplied input:
   - amount is positive.
   - currency is `EUR`.
   - account ID defaults to or validates as `acc_main_001`.
   - identifiers such as IBAN/fund/mortgage IDs are bounded and non-empty.
2. Check financial side effects:
   - replay does not double-book terminal events.
   - derived events have stable IDs/idempotency where the service pattern requires it.
   - rejected target flows release reservations.
3. Check logs and errors:
   - no secrets or sensitive payloads are logged unnecessarily.
   - errors are useful but not overly revealing.
4. Check repo/config:
   - no real secrets.
   - demo credentials are clearly local.
   - exposed ports are expected local workshop ports.
5. Separate workshop fixes from production notes.

## Checklist

- Input validation exists at trust boundaries.
- Replay/idempotency risk is explicit.
- Sensitive data is not printed in normal logs.
- Demo-only omissions are documented.
- Mitigations are small enough for the lab.

## Output Format

Return findings first:

```text
[P1/P2/P3] Title
Impact:
Evidence:
Workshop fix:
Production note:
```

If there are no findings, say so and list residual risks.
