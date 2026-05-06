FROM node:24-slim AS build
WORKDIR /app
COPY package.json ./
COPY packages/event-contracts/package.json packages/event-contracts/package.json
COPY services/movement-orchestrator/package.json services/movement-orchestrator/package.json
COPY services/event-log-service/package.json services/event-log-service/package.json
COPY services/external-transfer-service/package.json services/external-transfer-service/package.json
COPY services/notification-service/package.json services/notification-service/package.json
COPY apps/web-dashboard/package.json apps/web-dashboard/package.json
RUN npm install --workspace @agentic-banking-lab/event-contracts --workspace @agentic-banking-lab/external-transfer-service --include-workspace-root=false
COPY packages/event-contracts packages/event-contracts
COPY services/external-transfer-service services/external-transfer-service
RUN npm run build -w @agentic-banking-lab/event-contracts && npm run build -w @agentic-banking-lab/external-transfer-service

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/packages/event-contracts packages/event-contracts
COPY --from=build /app/services/external-transfer-service services/external-transfer-service
WORKDIR /app/services/external-transfer-service
CMD ["node", "dist/index.js"]
