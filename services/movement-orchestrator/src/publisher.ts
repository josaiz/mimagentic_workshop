import { Kafka, type Producer } from "kafkajs";
import { BANKING_EVENTS_TOPIC, type BankingEvent } from "@agentic-banking-lab/event-contracts";
import { config } from "./config.js";

let producer: Producer | null = null;

export async function getProducer(): Promise<Producer> {
  if (producer) {
    return producer;
  }
  const kafka = new Kafka({
    clientId: "movement-orchestrator",
    brokers: config.kafkaBootstrapServers
  });
  producer = kafka.producer();
  await producer.connect();
  return producer;
}

export async function publishEvent(event: BankingEvent): Promise<void> {
  const kafkaProducer = await getProducer();
  await kafkaProducer.send({
    topic: BANKING_EVENTS_TOPIC,
    messages: [
      {
        key: event.correlationId,
        value: JSON.stringify(event),
        headers: {
          eventType: event.eventType,
          producer: event.producer
        }
      }
    ]
  });
}
