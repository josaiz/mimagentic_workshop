---
description: Generate realistic demo banking activity.
agent: data-agent
---

Use `@data-agent` and the `workshop-facilitation` skill.

Default action:

```bash
make demo-data
```

If the user asks for a bigger timeline:

```bash
python3 tools/demo-data-generator/generate.py --events 20
```

If the user wants individual flows, use the `banking_triggerFlow` custom tool for known flows:

- `salary`
- `external-transfer`
- `rejected-transfer`
- `investment`
- `mortgage`
- `insufficient-funds`
- `random-activity`

After generating activity, confirm:

- dashboard timeline receives events,
- correlation detail opens for at least one flow,
- account available/reserved balances still make sense,
- participants can explain one success and one rejection.
