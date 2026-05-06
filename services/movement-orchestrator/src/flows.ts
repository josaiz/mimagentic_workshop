import { randomUUID } from "node:crypto";
import { createBankingEvent, type BankingEvent } from "@agentic-banking-lab/event-contracts";
import {
  type ExternalTransferInput,
  type InvestmentContributionInput,
  type MortgageRepaymentInput,
  type SalaryInput
} from "./validation.js";

function movementId(prefix: string): string {
  return `${prefix}_${randomUUID()}`;
}

export function buildExternalTransferEvent(input: ExternalTransferInput): BankingEvent {
  const id = movementId("transfer");
  return createBankingEvent(
    "MoneyMovementRequested",
    "movement-orchestrator",
    {
      movementId: id,
      movementType: "EXTERNAL_TRANSFER",
      sourceAccountId: input.sourceAccountId,
      amount: input.amount,
      currency: input.currency,
      destinationIban: input.destinationIban
    },
    {
      aggregateId: input.sourceAccountId,
      idempotencyKey: id
    }
  );
}

export function buildInvestmentContributionEvent(input: InvestmentContributionInput): BankingEvent {
  const id = movementId("investment");
  return createBankingEvent(
    "MoneyMovementRequested",
    "movement-orchestrator",
    {
      movementId: id,
      movementType: "INVESTMENT_FUND",
      sourceAccountId: input.sourceAccountId,
      amount: input.amount,
      currency: input.currency,
      fundId: input.fundId
    },
    {
      aggregateId: input.sourceAccountId,
      idempotencyKey: id
    }
  );
}

export function buildMortgageRepaymentEvent(input: MortgageRepaymentInput): BankingEvent {
  const id = movementId("mortgage");
  return createBankingEvent(
    "MoneyMovementRequested",
    "movement-orchestrator",
    {
      movementId: id,
      movementType: "MORTGAGE_REPAYMENT",
      sourceAccountId: input.sourceAccountId,
      amount: input.amount,
      currency: input.currency,
      mortgageId: input.mortgageId
    },
    {
      aggregateId: input.sourceAccountId,
      idempotencyKey: id
    }
  );
}

export function buildSalaryEvent(input: SalaryInput): BankingEvent {
  return createBankingEvent(
    "SalaryReceived",
    "movement-orchestrator",
    {
      accountId: input.accountId,
      amount: input.amount,
      currency: input.currency,
      employerName: input.employerName
    },
    {
      aggregateId: input.accountId,
      idempotencyKey: `salary_${randomUUID()}`
    }
  );
}
