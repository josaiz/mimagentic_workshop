import { Pool } from "pg";
import type { BankingEvent } from "@agentic-banking-lab/event-contracts";
import { config } from "./config.js";

export const pool = new Pool(config.postgres);

export async function initDb(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS events (
      id BIGSERIAL PRIMARY KEY,
      event_id TEXT UNIQUE NOT NULL,
      event_type TEXT NOT NULL,
      event_version INTEGER NOT NULL,
      occurred_at TIMESTAMPTZ NOT NULL,
      producer TEXT NOT NULL,
      correlation_id TEXT NOT NULL,
      causation_id TEXT,
      aggregate_id TEXT,
      payload JSONB NOT NULL,
      raw_event JSONB NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);
}

export async function storeEvent(event: BankingEvent): Promise<boolean> {
  const result = await pool.query(
    `INSERT INTO events (
       event_id, event_type, event_version, occurred_at, producer, correlation_id,
       causation_id, aggregate_id, payload, raw_event
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     ON CONFLICT (event_id) DO NOTHING`,
    [
      event.eventId,
      event.eventType,
      event.eventVersion,
      event.occurredAt,
      event.producer,
      event.correlationId,
      event.causationId,
      event.aggregateId,
      event.payload,
      event
    ]
  );
  return (result.rowCount ?? 0) > 0;
}

export async function listEvents(limit: number) {
  const result = await pool.query(
    `SELECT raw_event
       FROM events
      ORDER BY occurred_at DESC, id DESC
      LIMIT $1`,
    [limit]
  );
  return result.rows.map((row) => row.raw_event);
}

export async function listCorrelation(correlationId: string) {
  const result = await pool.query(
    `SELECT raw_event
       FROM events
      WHERE correlation_id = $1
      ORDER BY occurred_at ASC, id ASC`,
    [correlationId]
  );
  return result.rows.map((row) => row.raw_event);
}
