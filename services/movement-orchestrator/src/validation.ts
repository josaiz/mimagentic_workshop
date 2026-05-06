import { z } from "zod";

const amount = z.coerce.number().positive().max(1_000_000);
const currency = z.literal("EUR").default("EUR");
const sourceAccountId = z.string().min(1).default("acc_main_001");

export const externalTransferSchema = z.object({
  sourceAccountId,
  amount,
  currency,
  destinationIban: z.string().min(8).default("ES00DEMO1234567890")
});

export const investmentContributionSchema = z.object({
  sourceAccountId,
  amount,
  currency,
  fundId: z.string().min(1).default("fund_global_index")
});

export const mortgageRepaymentSchema = z.object({
  sourceAccountId,
  amount,
  currency,
  mortgageId: z.string().min(1).default("mortgage_001")
});

export const salarySchema = z.object({
  accountId: z.string().min(1).default("acc_main_001"),
  amount: amount.default(3200),
  currency,
  employerName: z.string().min(1).default("MIM Agentic Labs")
});

export type ExternalTransferInput = z.infer<typeof externalTransferSchema>;
export type InvestmentContributionInput = z.infer<typeof investmentContributionSchema>;
export type MortgageRepaymentInput = z.infer<typeof mortgageRepaymentSchema>;
export type SalaryInput = z.infer<typeof salarySchema>;
