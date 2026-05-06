---
description: Suggest or run tests for a named flow.
arguments: FLOW_NAME
---

Given `$ARGUMENTS`, identify relevant services, event types, and tests. Prefer running focused unit tests and describing the manual smoke path:

```bash
make up
make demo-data
```

For a flow such as `mortgage-repayment`, show which events should appear in order and where balance changes should be visible.
