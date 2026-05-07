Trigger a demo banking flow through the movement-orchestrator.

The argument should be one of: `salary`, `investment`, `mortgage`, `external-transfer`, `rejected-transfer`, `insufficient-funds`, `random-activity`

Based on the argument, run the corresponding curl command:

**salary** (default 3200 EUR):
```bash
curl -s -X POST http://localhost:3001/api/demo/salary \
  -H 'Content-Type: application/json' \
  -d '{"amount":3200,"currency":"EUR","employerName":"MIM Agentic Labs"}'
```

**investment** (default 250 EUR):
```bash
curl -s -X POST http://localhost:3001/api/movements/investment-contribution \
  -H 'Content-Type: application/json' \
  -d '{"amount":250,"currency":"EUR","fundId":"fund_global_index"}'
```

**mortgage** (default 650 EUR):
```bash
curl -s -X POST http://localhost:3001/api/movements/mortgage-repayment \
  -H 'Content-Type: application/json' \
  -d '{"amount":650,"currency":"EUR","mortgageId":"mortgage_001"}'
```

**external-transfer** (default 120 EUR, approved):
```bash
curl -s -X POST http://localhost:3001/api/movements/external-transfer \
  -H 'Content-Type: application/json' \
  -d '{"amount":120,"currency":"EUR","destinationIban":"ES00DEMO1234567890"}'
```

**rejected-transfer** (default 85 EUR, will be rejected):
```bash
curl -s -X POST http://localhost:3001/api/movements/external-transfer \
  -H 'Content-Type: application/json' \
  -d '{"amount":85,"currency":"EUR","destinationIban":"ES00FAIL1234567890"}'
```

**insufficient-funds**:
```bash
curl -s -X POST http://localhost:3001/api/demo/insufficient-funds \
  -H 'Content-Type: application/json' -d '{}'
```

**random-activity**:
```bash
curl -s -X POST http://localhost:3001/api/demo/random-activity \
  -H 'Content-Type: application/json' -d '{}'
```

After triggering, show the response (which will include a `correlationId`). Tell the user they can trace the flow with `/banking-events {correlationId}` or watch it unfold in the dashboard at http://localhost:3000.

If no argument is provided, list the available flows and ask the user which one to trigger.
