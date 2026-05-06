import { Kafka } from "kafkajs";
import { BANKING_EVENTS_TOPIC, type BankingEvent } from "@agentic-banking-lab/event-contracts";
import { config } from "./config.js";
import { storeEvent } from "./db.js";
import { broadcast } from "./stream.js";

export async function startConsumer(): Promise<void> {
  const kafka = new Kafka({
    clientId: "event-log-service",
    brokers: config.kafkaBootstrapServers
  });
  const consumer = kafka.consumer({ groupId: "event-log-service" });
  await consumer.connect();
  await consumer.subscribe({ topic: BANKING_EVENTS_TOPIC, fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) {
        return;
      }
      const event = JSON.parse(message.value.toString()) as BankingEvent;
      const inserted = await storeEvent(event);
      if (inserted) {
        broadcast(event);
      }
    }
  });
}
