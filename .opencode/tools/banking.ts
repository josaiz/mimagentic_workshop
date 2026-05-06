import { readFile } from "node:fs/promises";
import path from "node:path";
import { tool } from "@opencode-ai/plugin";

type ServiceProbe = {
  name: string;
  url: string;
  expectText?: string;
};

type FlowName =
  | "salary"
  | "external-transfer"
  | "rejected-transfer"
  | "investment"
  | "mortgage"
  | "insufficient-funds"
  | "random-activity";

const DEFAULT_EVENT_LOG_URL = "http://localhost:3002";
const DEFAULT_ORCHESTRATOR_URL = "http://localhost:3001";

const serviceProbes: ServiceProbe[] = [
  {
    name: "web-dashboard",
    url: "http://localhost:3000",
    expectText: "Agentic Banking Lab",
  },
  { name: "movement-orchestrator", url: "http://localhost:3001/health" },
  { name: "event-log-service", url: "http://localhost:3002/health" },
  { name: "notification-service", url: "http://localhost:3003/health" },
  { name: "external-transfer-service", url: "http://localhost:3004/health" },
  { name: "account-service", url: "http://localhost:8081/health" },
  { name: "mortgage-service", url: "http://localhost:8082/health" },
  { name: "investment-service", url: "http://localhost:8083/health" },
];

function timeoutSignal(timeoutMs: number): {
  signal: AbortSignal;
  clear: () => void;
} {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

async function fetchText(
  url: string,
  timeoutMs: number,
): Promise<{ ok: boolean; status: number; text: string }> {
  const timeout = timeoutSignal(timeoutMs);
  try {
    const response = await fetch(url, { signal: timeout.signal });
    return {
      ok: response.ok,
      status: response.status,
      text: await response.text(),
    };
  } finally {
    timeout.clear();
  }
}

async function fetchJson(url: string, timeoutMs: number): Promise<unknown> {
  const response = await fetchText(url, timeoutMs);
  if (!response.ok) {
    throw new Error(
      `GET ${url} returned ${response.status}: ${response.text.slice(0, 300)}`,
    );
  }
  return JSON.parse(response.text);
}

async function postJson(
  url: string,
  body: object,
  timeoutMs: number,
): Promise<unknown> {
  const timeout = timeoutSignal(timeoutMs);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: timeout.signal,
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(
        `POST ${url} returned ${response.status}: ${text.slice(0, 300)}`,
      );
    }
    return JSON.parse(text);
  } finally {
    timeout.clear();
  }
}

function sortedDifference(left: string[], right: string[]): string[] {
  const rightSet = new Set(right);
  return left.filter((item) => !rightSet.has(item)).sort();
}

function extractEventTypesFromSource(source: string): string[] {
  const block = source.match(/EVENT_TYPES\s*=\s*\[([\s\S]*?)\]\s*as const/);
  if (!block) return [];
  return [...block[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]).sort();
}

function extractEventTypesFromDocs(docs: string): string[] {
  return [...docs.matchAll(/^- `([^`]+)`/gm)].map((match) => match[1]).sort();
}

function flowRequest(
  flow: FlowName,
  amount: number,
): { path: string; body: object } {
  switch (flow) {
    case "salary":
      return {
        path: "/api/demo/salary",
        body: {
          amount: amount || 3200,
          currency: "EUR",
          employerName: "MIM Agentic Labs",
        },
      };
    case "external-transfer":
      return {
        path: "/api/movements/external-transfer",
        body: {
          amount: amount || 120,
          currency: "EUR",
          destinationIban: "ES00DEMO1234567890",
        },
      };
    case "rejected-transfer":
      return {
        path: "/api/movements/external-transfer",
        body: {
          amount: amount || 85,
          currency: "EUR",
          destinationIban: "ES00FAIL1234567890",
        },
      };
    case "investment":
      return {
        path: "/api/movements/investment-contribution",
        body: {
          amount: amount || 250,
          currency: "EUR",
          fundId: "fund_global_index",
        },
      };
    case "mortgage":
      return {
        path: "/api/movements/mortgage-repayment",
        body: {
          amount: amount || 650,
          currency: "EUR",
          mortgageId: "mortgage_001",
        },
      };
    case "insufficient-funds":
      return { path: "/api/demo/insufficient-funds", body: {} };
    case "random-activity":
      return { path: "/api/demo/random-activity", body: {} };
  }
}

export const health = tool({
  description:
    "Check local Agentic Banking Lab service health endpoints and dashboard reachability.",
  args: {
    timeoutMs: tool.schema
      .number()
      .int()
      .min(250)
      .max(30000)
      .default(2500)
      .describe("Per-service timeout in milliseconds."),
  },
  async execute(args, context) {
    context.metadata({ title: "Checking banking lab health" });
    const results = await Promise.all(
      serviceProbes.map(async (service) => {
        try {
          const response = await fetchText(service.url, args.timeoutMs);
          const contentOk = service.expectText
            ? response.text.includes(service.expectText)
            : true;
          return {
            name: service.name,
            url: service.url,
            status: response.ok && contentOk ? "UP" : "DOWN",
            httpStatus: response.status,
            note: contentOk
              ? undefined
              : `Response did not include ${service.expectText}`,
          };
        } catch (error) {
          return {
            name: service.name,
            url: service.url,
            status: "DOWN",
            note: error instanceof Error ? error.message : String(error),
          };
        }
      }),
    );

    return {
      output: JSON.stringify(results, null, 2),
      metadata: { services: results },
    };
  },
});

export const events = tool({
  description:
    "Read recent banking events or one correlation timeline from event-log-service.",
  args: {
    correlationId: tool.schema
      .string()
      .optional()
      .describe("Optional correlation ID to inspect."),
    limit: tool.schema
      .number()
      .int()
      .min(1)
      .max(200)
      .default(50)
      .describe("Recent event limit when no correlation ID is provided."),
    eventLogUrl: tool.schema
      .string()
      .url()
      .default(DEFAULT_EVENT_LOG_URL)
      .describe("Base URL for event-log-service."),
    timeoutMs: tool.schema
      .number()
      .int()
      .min(250)
      .max(30000)
      .default(5000)
      .describe("HTTP timeout in milliseconds."),
  },
  async execute(args, context) {
    context.metadata({
      title: args.correlationId
        ? "Fetching correlation events"
        : "Fetching recent events",
    });
    const url = args.correlationId
      ? `${args.eventLogUrl}/api/events/correlation/${encodeURIComponent(args.correlationId)}`
      : `${args.eventLogUrl}/api/events?limit=${args.limit}`;
    const data = await fetchJson(url, args.timeoutMs);
    return {
      output: JSON.stringify(data, null, 2),
      metadata: { url, correlationId: args.correlationId ?? null },
    };
  },
});

export const contractCatalog = tool({
  description:
    "Compare banking event types across TypeScript contracts, envelope schema, and docs.",
  args: {
    root: tool.schema
      .string()
      .optional()
      .describe("Repository root. Defaults to the OpenCode session directory."),
    includeDocs: tool.schema
      .boolean()
      .default(true)
      .describe("Include docs/EVENTS.md in the comparison."),
  },
  async execute(args, context) {
    context.metadata({ title: "Comparing event contract catalog" });
    const root = args.root ?? context.directory;
    const source = await readFile(
      path.join(root, "packages/event-contracts/src/index.ts"),
      "utf8",
    );
    const envelope = JSON.parse(
      await readFile(
        path.join(root, "packages/event-contracts/events/envelope.schema.json"),
        "utf8",
      ),
    );
    const docs = args.includeDocs
      ? await readFile(path.join(root, "docs/EVENTS.md"), "utf8")
      : "";

    const sourceTypes = extractEventTypesFromSource(source);
    const schemaTypes = [
      ...((envelope.properties?.eventType?.enum ?? []) as string[]),
    ].sort();
    const docsTypes = args.includeDocs ? extractEventTypesFromDocs(docs) : [];

    const catalog = {
      topic: "banking.events",
      counts: {
        typescript: sourceTypes.length,
        envelopeSchema: schemaTypes.length,
        docs: docsTypes.length,
      },
      drift: {
        missingFromSchema: sortedDifference(sourceTypes, schemaTypes),
        missingFromTypescript: sortedDifference(schemaTypes, sourceTypes),
        missingFromDocs: args.includeDocs
          ? sortedDifference(sourceTypes, docsTypes)
          : [],
        documentedButMissingFromTypescript: args.includeDocs
          ? sortedDifference(docsTypes, sourceTypes)
          : [],
      },
      eventTypes: {
        typescript: sourceTypes,
        envelopeSchema: schemaTypes,
        docs: docsTypes,
      },
    };

    return {
      output: JSON.stringify(catalog, null, 2),
      metadata: catalog,
    };
  },
});

export const triggerFlow = tool({
  description:
    "Trigger one known demo banking flow through movement-orchestrator. This writes events to the local lab.",
  args: {
    flow: tool.schema
      .enum([
        "salary",
        "external-transfer",
        "rejected-transfer",
        "investment",
        "mortgage",
        "insufficient-funds",
        "random-activity",
      ])
      .describe("Known demo flow to trigger."),
    amount: tool.schema
      .number()
      .min(0)
      .max(1000000)
      .default(0)
      .describe("Optional amount for flows that accept one."),
    orchestratorUrl: tool.schema
      .string()
      .url()
      .default(DEFAULT_ORCHESTRATOR_URL)
      .describe("Base URL for movement-orchestrator."),
    timeoutMs: tool.schema
      .number()
      .int()
      .min(250)
      .max(30000)
      .default(5000)
      .describe("HTTP timeout in milliseconds."),
  },
  async execute(args, context) {
    context.metadata({ title: `Triggering ${args.flow}` });
    const request = flowRequest(args.flow, args.amount);
    const response = await postJson(
      `${args.orchestratorUrl}${request.path}`,
      request.body,
      args.timeoutMs,
    );
    return {
      output: JSON.stringify(
        {
          flow: args.flow,
          endpoint: `${args.orchestratorUrl}${request.path}`,
          body: request.body,
          response,
        },
        null,
        2,
      ),
      metadata: {
        flow: args.flow,
        path: request.path,
        body: request.body,
        response,
      },
    };
  },
});
