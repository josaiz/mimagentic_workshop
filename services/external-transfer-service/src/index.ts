import express from "express";
import cors from "cors";
import { createHash } from "node:crypto";
import { Kafka, type Producer } from "kafkajs";
import {
  BANKING_EVENTS_TOPIC,
  createBankingEvent,
  type BankingEvent,
  type MovementPayload
} from "@agentic-banking-lab/event-contracts";

const port = Number(process.env.PORT ?? 3004);
const brokers = (process.env.KAFKA_BOOTSTRAP_SERVERS ?? "localhost:9092").split(",");
const kafka = new Kafka({ clientId: "external-transfer-service", brokers });
const producer: Producer = kafka.producer();

function deterministicUuid(seed: string): string {
  const bytes = createHash("sha256").update(seed).digest().subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

async function publish(event: BankingEvent<object>) {
  await producer.send({
    topic: BANKING_EVENTS_TOPIC,
    messages: [{ key: event.correlationId, value: JSON.stringify(event) }]
  });
}

async function handleReserved(event: BankingEvent<MovementPayload>) {
  if (event.eventType !== "AccountDebitReserved" || event.payload.movementType !== "EXTERNAL_TRANSFER") {
    return;
  }

  const requested = createBankingEvent("ExternalTransferRequested", "external-transfer-service", event.payload, {
    correlationId: event.correlationId,
    causationId: event.eventId,
    aggregateId: event.aggregateId,
    eventId: deterministicUuid(`ExternalTransferRequested:${event.eventId}`),
    idempotencyKey: `${event.payload.movementId}_external_requested`
  });
  await publish(requested);

  const rejected =
    event.payload.amount <= 0 || String(event.payload.destinationIban ?? "").toUpperCase().includes("FAIL");
  const terminal = createBankingEvent(
    rejected ? "ExternalTransferRejected" : "ExternalTransferCompleted",
    "external-transfer-service",
    {
      ...event.payload,
      status: rejected ? "REJECTED" : "COMPLETED",
      reason: rejected ? "External transfer simulation rejected this destination or amount." : undefined
    },
    {
      correlationId: event.correlationId,
      causationId: requested.eventId,
      aggregateId: event.aggregateId,
      eventId: deterministicUuid(`ExternalTransferTerminal:${event.eventId}`),
      idempotencyKey: `${event.payload.movementId}_external_terminal`
    }
  );
  await publish(terminal);
}

async function startConsumer() {
  await producer.connect();
  const consumer = kafka.consumer({ groupId: "external-transfer-service" });
  await consumer.connect();
  await consumer.subscribe({ topic: BANKING_EVENTS_TOPIC, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) {
        return;
      }
      await handleReserved(JSON.parse(message.value.toString()));
    }
  });
}

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN ?? "http://localhost:3000" }));
app.get("/health", (_req, res) => {
  res.json({ status: "UP", service: "external-transfer-service" });
});

await startConsumer();
app.listen(port, () => console.log(`external-transfer-service listening on ${port}`));
