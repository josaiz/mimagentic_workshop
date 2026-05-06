import express from "express";
import cors from "cors";
import { createHash } from "node:crypto";
import { Kafka, type Producer } from "kafkajs";
import {
  BANKING_EVENTS_TOPIC,
  createBankingEvent,
  type BankingEvent
} from "@agentic-banking-lab/event-contracts";

const terminalEvents = new Set([
  "AccountDebitRejected",
  "ExternalTransferCompleted",
  "ExternalTransferRejected",
  "FundContributionCompleted",
  "FundContributionRejected",
  "MortgageRepaymentCompleted",
  "MortgageRepaymentRejected",
  "AccountCredited"
]);

const port = Number(process.env.PORT ?? 3003);
const brokers = (process.env.KAFKA_BOOTSTRAP_SERVERS ?? "localhost:9092").split(",");
const kafka = new Kafka({ clientId: "notification-service", brokers });
const producer: Producer = kafka.producer();
const emitted = new Set<string>();

function deterministicUuid(seed: string): string {
  const bytes = createHash("sha256").update(seed).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function messageFor(event: BankingEvent): string {
  if (event.eventType === "AccountCredited") {
    return `Account credited from ${event.payload.employerName ?? "income simulation"}.`;
  }
  if (event.eventType.endsWith("Rejected")) {
    return `${event.eventType} for correlation ${event.correlationId.slice(0, 8)}.`;
  }
  return `${event.eventType} completed for correlation ${event.correlationId.slice(0, 8)}.`;
}

async function publishNotification(source: BankingEvent) {
  if (!terminalEvents.has(source.eventType) || emitted.has(source.eventId)) {
    return;
  }
  emitted.add(source.eventId);
  const severity = source.eventType.endsWith("Rejected") ? "WARNING" : "SUCCESS";
  const notification = createBankingEvent(
    "NotificationCreated",
    "notification-service",
    {
      notificationId: `notif_${source.eventId}`,
      severity,
      message: messageFor(source),
      sourceEventType: source.eventType
    },
    {
      correlationId: source.correlationId,
      causationId: source.eventId,
      aggregateId: source.aggregateId,
      eventId: deterministicUuid(`NotificationCreated:${source.eventId}`),
      idempotencyKey: `notification_${source.eventId}`
    }
  );
  await producer.send({
    topic: BANKING_EVENTS_TOPIC,
    messages: [{ key: notification.correlationId, value: JSON.stringify(notification) }]
  });
}

async function startConsumer() {
  await producer.connect();
  const consumer = kafka.consumer({ groupId: "notification-service" });
  await consumer.connect();
  await consumer.subscribe({ topic: BANKING_EVENTS_TOPIC, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) {
        return;
      }
      await publishNotification(JSON.parse(message.value.toString()));
    }
  });
}

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));
app.get("/health", (_req, res) => {
  res.json({ status: "UP", service: "notification-service" });
});

await startConsumer();
app.listen(port, () => console.log(`notification-service listening on ${port}`));
