---
name: banking-domain
description: Guidance for the simplified demo banking domain.
---

# Banking Domain Skill

## When To Use

Use this skill whenever money movement, balances, reservations, rejection behavior, or account terminology appears.

## Domain Defaults

- Account: `acc_main_001`
- Currency: `EUR`
- Topic: `banking.events`
- This is a workshop bank, not a production bank.

## Procedure

1. Use realistic banking names without claiming production-grade safety.
2. Distinguish:
   - `availableBalance`: spendable balance.
   - `reservedBalance`: held for pending debit flows.
   - `bookedDebitTotal`: committed outgoing total.
3. Model debit flows as reserve, target outcome, then commit or release.
4. Model salary as a credit flow, not a debit reservation.
5. Use decimal-safe types where practical:
   - Java: `BigDecimal`.
   - TypeScript demo payloads: numbers are acceptable for this lab, with validation.
6. Keep demo failures explainable:
   - Insufficient funds rejects at account service.
   - Target-service rejection releases an existing reservation.

## Checklist

- Currency is restricted to `EUR`.
- Amount is positive and validated.
- No real auth, production ledger, or settlement system is added.
- Flow has a clear terminal state.
- Dashboard can show available and reserved balance effects.

## Output Format

Return:

- `Domain behavior`: reserve/commit/release/credit.
- `Money fields`: amount, currency, account ID, related entity ID.
- `Rejected behavior`: who rejects and what event is emitted.
- `Workshop simplification`: what production concept is intentionally omitted.

## Example

Mortgage repayment:

```text
Account reserves EUR debit -> mortgage service completes repayment
-> account commits debit -> notification is created.
```
