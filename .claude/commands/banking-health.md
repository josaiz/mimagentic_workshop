Check the health of all Agentic Banking Lab services by calling each health endpoint.

Run these curl commands and report the result for each service (UP / DOWN / error):

```bash
curl -s --max-time 3 http://localhost:3000 | grep -c "Agentic Banking Lab" && echo "web-dashboard: UP" || echo "web-dashboard: DOWN"
curl -s --max-time 3 http://localhost:3001/health
curl -s --max-time 3 http://localhost:3002/health
curl -s --max-time 3 http://localhost:3003/health
curl -s --max-time 3 http://localhost:3004/health
curl -s --max-time 3 http://localhost:8081/health
curl -s --max-time 3 http://localhost:8082/health
curl -s --max-time 3 http://localhost:8083/health
```

Present a clean status table:

| Service | Port | Status |
|---|---|---|
| web-dashboard | 3000 | UP / DOWN |
| movement-orchestrator | 3001 | UP / DOWN |
| event-log-service | 3002 | UP / DOWN |
| notification-service | 3003 | UP / DOWN |
| external-transfer-service | 3004 | UP / DOWN |
| account-service | 8081 | UP / DOWN |
| mortgage-service | 8082 | UP / DOWN |
| investment-service | 8083 | UP / DOWN |

If any service is DOWN, suggest running `/platform-up` to diagnose.

If the platform is not started at all, instruct the user to run `make up` first.
