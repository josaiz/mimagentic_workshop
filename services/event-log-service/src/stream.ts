import type { Response } from "express";
import type { BankingEvent } from "@agentic-banking-lab/event-contracts";

const clients = new Set<Response>();

export function addClient(res: Response): void {
  clients.add(res);
  res.write("event: ready\ndata: {\"status\":\"connected\"}\n\n");
  res.on("close", () => {
    clients.delete(res);
  });
}

export function broadcast(event: BankingEvent): void {
  const body = `event: banking-event\ndata: ${JSON.stringify(event)}\n\n`;
  for (const client of clients) {
    client.write(body);
  }
}
