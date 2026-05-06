---
description: Generate realistic demo banking activity.
---

Use `@data-agent` guidance and run:

```bash
make demo-data
```

If the user asks for more activity:

```bash
python3 tools/demo-data-generator/generate.py --events 20
```

Confirm that events appear in the dashboard timeline.
