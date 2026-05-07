Use the data sub-agent to generate realistic demo banking activity in the running lab.

## Option 1 — Full morning scenario (recommended for demos)

```bash
make demo-data
```

This runs the Python generator which triggers a realistic morning of banking activity: salary, investment contribution, mortgage repayment, and an external transfer.

## Option 2 — Individual flows

Trigger specific flows using curl. Run one or more of:

**Salary (3200 EUR):**
```bash
curl -s -X POST http://localhost:3001/api/demo/salary \
  -H 'Content-Type: application/json' \
  -d '{"amount":3200,"currency":"EUR","employerName":"MIM Agentic Labs"}'
```

**Investment contribution (250 EUR):**
```bash
curl -s -X POST http://localhost:3001/api/movements/investment-contribution \
  -H 'Content-Type: application/json' \
  -d '{"amount":250,"currency":"EUR","fundId":"fund_global_index"}'
```

**Mortgage repayment (650 EUR):**
```bash
curl -s -X POST http://localhost:3001/api/movements/mortgage-repayment \
  -H 'Content-Type: application/json' \
  -d '{"amount":650,"currency":"EUR","mortgageId":"mortgage_001"}'
```

**External transfer — approved (120 EUR):**
```bash
curl -s -X POST http://localhost:3001/api/movements/external-transfer \
  -H 'Content-Type: application/json' \
  -d '{"amount":120,"currency":"EUR","destinationIban":"ES00DEMO1234567890"}'
```

**External transfer — rejected (85 EUR):**
```bash
curl -s -X POST http://localhost:3001/api/movements/external-transfer \
  -H 'Content-Type: application/json' \
  -d '{"amount":85,"currency":"EUR","destinationIban":"ES00FAIL1234567890"}'
```

After generating data, retrieve the correlation IDs from the responses and suggest the user trace one with `/banking-events {correlationId}` or view the live timeline at http://localhost:3000.

If the platform is not running, suggest `/platform-up` first.
