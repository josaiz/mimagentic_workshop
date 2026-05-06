Use the security sub-agent to review the banking lab for security risks.

## Review scope

Check each of the following areas and report findings clearly separated into two categories: **workshop risks** (real issues even for a demo) and **production notes** (acceptable omissions for a workshop, noted for awareness).

### 1. Input validation
- Read `services/movement-orchestrator/src/` — are amounts, IBANs, and currency validated at intake?
- Are Zod or equivalent schemas used at the service boundary?
- Are negative amounts or zero amounts rejected?

### 2. Idempotency / replay safety
Read account-service and investment-service for `idempotencyKey` handling:
```bash
rg "idempotencyKey" services/ --include="*.java" --include="*.ts" -n
```
- Is idempotency checked before applying state changes?
- Can a consumer receive the same event twice without double-applying effects?

### 3. Sensitive data in logs
```bash
rg "log\|logger\|console" services/ --include="*.java" --include="*.ts" -n | grep -i "balance\|amount\|iban\|account" | head -20
```
- Are financial amounts logged at appropriate levels?
- Are IBANs or account numbers masked?

### 4. Secrets / configuration
```bash
rg "password\|secret\|token" infra/docker-compose.yml services/ --include="*.java" --include="*.ts" -n | grep -v "\.env\|ENV\|environment:" | head -20
```
- Are credentials hardcoded in source files?
- Are passwords only in environment variables?

### 5. Financial bounds
```bash
rg "amount\|MAX\|limit" services/movement-orchestrator/src/ --include="*.ts" -n | head -20
```
- Is there a maximum amount limit?
- Is currency validated as EUR?
- Is account ID validated as `acc_main_001`?

## Report format

```
Security Review — Agentic Banking Lab
======================================

WORKSHOP RISKS (fix these):
- [issue] [file:line]

PRODUCTION NOTES (acceptable for workshop, would need fixing in production):
- [item]
```
