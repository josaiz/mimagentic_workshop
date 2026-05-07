Query the event-log-service to retrieve banking events.

If a correlation ID was provided with this command, fetch that specific correlation timeline:

```bash
curl -s "http://localhost:3002/api/events/correlation/$ARGUMENTS" | jq .
```

If no correlation ID was provided, fetch the 50 most recent events:

```bash
curl -s "http://localhost:3002/api/events?limit=50" | jq .
```

After fetching, analyze and present the events clearly:

- Show each event's `eventType`, `correlationId`, `causationId`, `timestamp`, and which service produced it
- Group by flow (correlation) when showing recent events
- For a correlation timeline: show events in causal order (by `causationId` chain), label each step of the flow, and identify the terminal state (was the flow completed, rejected, or still in progress?)
- If the event-log-service is not reachable, suggest running `/platform-up`

**Usage:**
- `/banking-events` — show recent 50 events
- `/banking-events corr-abc-123` — trace full timeline for correlation ID `corr-abc-123`
