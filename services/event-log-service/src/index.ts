import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { initDb, listCorrelation, listEvents } from "./db.js";
import { addClient } from "./stream.js";
import { startConsumer } from "./consumer.js";

const app = express();
app.use(cors({ origin: config.corsOrigin }));

app.get("/health", (_req, res) => {
  res.json({ status: "UP", service: "event-log-service" });
});

app.get("/api/events", async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit ?? 100), 500);
    res.json(await listEvents(limit));
  } catch (error) {
    next(error);
  }
});

app.get("/api/events/correlation/:correlationId", async (req, res, next) => {
  try {
    res.json(await listCorrelation(req.params.correlationId));
  } catch (error) {
    next(error);
  }
});

app.get("/api/events/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();
  addClient(res);
});

await initDb();
await startConsumer();

app.listen(config.port, () => {
  console.log(`event-log-service listening on ${config.port}`);
});
