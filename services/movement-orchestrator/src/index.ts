import cors from "cors";
import express from "express";
import { z } from "zod";
import { config } from "./config.js";
import {
  buildExternalTransferEvent,
  buildInvestmentContributionEvent,
  buildMortgageRepaymentEvent,
  buildSalaryEvent
} from "./flows.js";
import { publishEvent } from "./publisher.js";
import {
  externalTransferSchema,
  investmentContributionSchema,
  mortgageRepaymentSchema,
  salarySchema
} from "./validation.js";

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "UP", service: "movement-orchestrator" });
});

async function acceptEvent(res: express.Response, event: ReturnType<typeof buildExternalTransferEvent>) {
  await publishEvent(event);
  res.status(202).json({
    accepted: true,
    correlationId: event.correlationId,
    message: "Movement accepted for asynchronous processing"
  });
}

function handleError(res: express.Response, error: unknown) {
  if (error instanceof z.ZodError) {
    res.status(400).json({ accepted: false, message: "Invalid request", issues: error.issues });
    return;
  }
  console.error(error);
  res.status(500).json({ accepted: false, message: "Unexpected orchestrator error" });
}

app.post("/api/movements/external-transfer", async (req, res) => {
  try {
    await acceptEvent(res, buildExternalTransferEvent(externalTransferSchema.parse(req.body)));
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/movements/investment-contribution", async (req, res) => {
  try {
    await acceptEvent(res, buildInvestmentContributionEvent(investmentContributionSchema.parse(req.body)));
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/movements/mortgage-repayment", async (req, res) => {
  try {
    await acceptEvent(res, buildMortgageRepaymentEvent(mortgageRepaymentSchema.parse(req.body)));
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/demo/salary", async (req, res) => {
  try {
    await acceptEvent(res, buildSalaryEvent(salarySchema.parse(req.body)));
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/demo/insufficient-funds", async (_req, res) => {
  try {
    await acceptEvent(
      res,
      buildExternalTransferEvent({
        sourceAccountId: config.accountId,
        amount: 999999,
        currency: "EUR",
        destinationIban: "ES00DEMO1234567890"
      })
    );
  } catch (error) {
    handleError(res, error);
  }
});

app.post("/api/demo/random-activity", async (_req, res) => {
  try {
    const pick = Math.floor(Math.random() * 5);
    const events = [
      buildExternalTransferEvent({
        sourceAccountId: config.accountId,
        amount: 45 + Math.round(Math.random() * 150),
        currency: "EUR",
        destinationIban: pick === 3 ? "ES00FAIL1234567890" : "ES00DEMO1234567890"
      }),
      buildInvestmentContributionEvent({
        sourceAccountId: config.accountId,
        amount: 25 + Math.round(Math.random() * 300),
        currency: "EUR",
        fundId: "fund_global_index"
      }),
      buildMortgageRepaymentEvent({
        sourceAccountId: config.accountId,
        amount: 100 + Math.round(Math.random() * 500),
        currency: "EUR",
        mortgageId: "mortgage_001"
      }),
      buildSalaryEvent({
        accountId: config.accountId,
        amount: 3200,
        currency: "EUR",
        employerName: "MIM Agentic Labs"
      }),
      buildExternalTransferEvent({
        sourceAccountId: config.accountId,
        amount: 999999,
        currency: "EUR",
        destinationIban: "ES00DEMO1234567890"
      })
    ];
    await acceptEvent(res, events[pick]);
  } catch (error) {
    handleError(res, error);
  }
});

app.listen(config.port, () => {
  console.log(`movement-orchestrator listening on ${config.port}`);
});
