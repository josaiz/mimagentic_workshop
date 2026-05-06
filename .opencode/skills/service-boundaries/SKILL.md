---
name: service-boundaries
description: Guidance for small, understandable microservice boundaries.
---

# Service Boundaries Skill

## When To Use

Use this skill when deciding where a behavior belongs or when a proposed change crosses services.

The lab intentionally favors understandable boundaries over production completeness.

## Inputs

- Business capability being changed.
- Current owning service, if any.
- Events consumed and produced.
- State that must be persisted.
- Whether a synchronous HTTP call is truly needed.

## Procedure

1. Assign ownership by business capability, not by entity name.
2. Keep state private to the owning service:
   - `account-service` owns account balances and reservations.
   - `event-log-service` owns stored event history for dashboard/SSE.
   - target services own their own outcome decisions.
3. Avoid cross-service database access.
4. Prefer asynchronous events for business progress.
5. Keep synchronous HTTP limited to public control/query APIs used by the dashboard, demo generator, and smoke tests.
6. Keep failures visible in events when participants need to understand the flow.

## Checklist

- No service reaches into another service database.
- Account movement state changes happen in `account-service`.
- Target-service success/rejection is expressed through terminal events.
- The dashboard sees behavior through public HTTP/SSE APIs.
- The boundary is teachable in one sentence.

## Output Format

Return:

- `Owner`: service responsible and why.
- `Inputs`: HTTP request or consumed event.
- `Outputs`: emitted events and public API effects.
- `State`: local persistence touched.
- `Boundary risks`: where coupling could creep in.

## Example

An investment contribution belongs to `investment-service` for fund-specific outcome decisions, but debit reservation and final debit booking stay in `account-service`.
