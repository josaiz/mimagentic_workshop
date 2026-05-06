FROM node:24-slim AS build
WORKDIR /app
COPY package.json ./
COPY packages/event-contracts/package.json packages/event-contracts/package.json
COPY services/movement-orchestrator/package.json services/movement-orchestrator/package.json
COPY services/event-log-service/package.json services/event-log-service/package.json
COPY services/external-transfer-service/package.json services/external-transfer-service/package.json
COPY services/notification-service/package.json services/notification-service/package.json
COPY apps/web-dashboard/package.json apps/web-dashboard/package.json
RUN npm install --workspace @agentic-banking-lab/web-dashboard --include-workspace-root=false
COPY apps/web-dashboard apps/web-dashboard
WORKDIR /app/apps/web-dashboard
RUN npm run build

FROM node:24-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/web-dashboard/.next/standalone ./
COPY --from=build /app/apps/web-dashboard/.next/static apps/web-dashboard/.next/static
COPY --from=build /app/apps/web-dashboard/public apps/web-dashboard/public
EXPOSE 3000
CMD ["node", "apps/web-dashboard/server.js"]
