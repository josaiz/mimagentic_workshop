import { randomUUID } from "node:crypto";

export const BANKING_EVENTS_TOPIC = "banking.events";

export const EVENT_TYPES = [
  "MoneyMovementRequested",
  "SalaryReceived",
  "AccountDebitReserved",
  "AccountDebitRejected",
  "AccountDebitCommitted",
  "AccountDebitReleased",
  "AccountCredited",
  "ExternalTransferRequested",
  "ExternalTransferCompleted",
  "ExternalTransferRejected",
  "FundContributionRequested",
  "FundContributionCompleted",
  "FundContributionRejected",
  "MortgageRepaymentRequested",
  "MortgageRepaymentCompleted",
  "MortgageRepaymentRejected",
  "NotificationCreated"
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type MoneyMovementType =
  | "EXTERNAL_TRANSFER"
  | "INVESTMENT_FUND"
  | "MORTGAGE_REPAYMENT";

export interface BankingEvent<TPayload = Record<string, unknown>> {
  eventId: string;
  eventType: EventType;
  eventVersion: number;
  occurredAt: string;
  producer: string;
  correlationId: string;
  causationId: string | null;
  idempotencyKey: string | null;
  aggregateId: string | null;
  payload: TPayload;
}

export interface MovementPayload {
  movementId: string;
  movementType: MoneyMovementType;
  sourceAccountId: string;
  amount: number;
  currency: "EUR";
  destinationIban?: string;
  fundId?: string;
  mortgageId?: string;
  reason?: string;
}

export interface SalaryPayload {
  accountId: string;
  amount: number;
  currency: "EUR";
  employerName: string;
}

export function createBankingEvent<TPayload extends object>(
  eventType: EventType,
  producer: string,
  payload: TPayload,
  options: {
    correlationId?: string;
    causationId?: string | null;
    idempotencyKey?: string | null;
    aggregateId?: string | null;
    eventId?: string;
  } = {}
): BankingEvent<TPayload> {
  const eventId = options.eventId ?? randomUUID();
  return {
    eventId,
    eventType,
    eventVersion: 1,
    occurredAt: new Date().toISOString(),
    producer,
    correlationId: options.correlationId ?? randomUUID(),
    causationId: options.causationId ?? null,
    idempotencyKey: options.idempotencyKey ?? null,
    aggregateId: options.aggregateId ?? null,
    payload
  };
}
