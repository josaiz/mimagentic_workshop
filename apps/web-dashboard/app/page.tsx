"use client";

import {
  Activity,
  BadgeEuro,
  BanknoteArrowDown,
  CircleDollarSign,
  Landmark,
  RadioTower,
  RefreshCcw,
  Send,
  ShieldAlert,
  WalletCards
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Account = {
  accountId: string;
  ownerName: string;
  currency: string;
  availableBalance: number;
  reservedBalance: number;
  bookedDebitTotal: number;
};

type BankingEvent = {
  eventId: string;
  eventType: string;
  eventVersion: number;
  occurredAt: string;
  producer: string;
  correlationId: string;
  causationId: string | null;
  aggregateId: string | null;
  payload: Record<string, unknown>;
};

type ServiceStatus = {
  name: string;
  url: string;
  status: "UP" | "DOWN";
};

const accountUrl = process.env.NEXT_PUBLIC_ACCOUNT_SERVICE_URL ?? "http://localhost:8081";
const eventLogUrl = process.env.NEXT_PUBLIC_EVENT_LOG_SERVICE_URL ?? "http://localhost:3002";
const orchestratorUrl = process.env.NEXT_PUBLIC_MOVEMENT_ORCHESTRATOR_URL ?? "http://localhost:3001";

const services: ServiceStatus[] = [
  { name: "account-service", url: `${accountUrl}/health`, status: "DOWN" },
  { name: "movement-orchestrator", url: `${orchestratorUrl}/health`, status: "DOWN" },
  { name: "event-log-service", url: `${eventLogUrl}/health`, status: "DOWN" },
  { name: "mortgage-service", url: "http://localhost:8082/health", status: "DOWN" },
  { name: "investment-service", url: "http://localhost:8083/health", status: "DOWN" },
  { name: "external-transfer-service", url: "http://localhost:3004/health", status: "DOWN" },
  { name: "notification-service", url: "http://localhost:3003/health", status: "DOWN" }
];

const currency = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" });

function shortId(value: string | null | undefined) {
  return value ? value.slice(0, 8) : "-";
}

function eventTone(type: string) {
  if (type.includes("Rejected")) return "tone-red";
  if (type.includes("Completed") || type.includes("Committed") || type.includes("Credited")) return "tone-green";
  if (type.includes("Reserved") || type.includes("Requested")) return "tone-yellow";
  return "tone-blue";
}

export default function Dashboard() {
  const [account, setAccount] = useState<Account | null>(null);
  const [events, setEvents] = useState<BankingEvent[]>([]);
  const [flow, setFlow] = useState<BankingEvent[]>([]);
  const [selectedCorrelation, setSelectedCorrelation] = useState<string | null>(null);
  const [serviceStatuses, setServiceStatuses] = useState<ServiceStatus[]>(services);
  const [externalAmount, setExternalAmount] = useState(100);
  const [investmentAmount, setInvestmentAmount] = useState(150);
  const [mortgageAmount, setMortgageAmount] = useState(250);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const selectedEvent = useMemo(
    () => events.find((event) => event.correlationId === selectedCorrelation),
    [events, selectedCorrelation]
  );

  async function fetchAccount() {
    const response = await fetch(`${accountUrl}/accounts/acc_main_001`, { cache: "no-store" });
    if (response.ok) {
      setAccount(await response.json());
    }
  }

  async function fetchEvents() {
    const response = await fetch(`${eventLogUrl}/api/events?limit=100`, { cache: "no-store" });
    if (response.ok) {
      setEvents(await response.json());
    }
  }

  async function fetchHealth() {
    const next = await Promise.all(
      services.map(async (service) => {
        try {
          const response = await fetch(service.url, { cache: "no-store" });
          return { ...service, status: response.ok ? "UP" : "DOWN" } satisfies ServiceStatus;
        } catch {
          return { ...service, status: "DOWN" } satisfies ServiceStatus;
        }
      })
    );
    setServiceStatuses(next);
  }

  async function selectCorrelation(correlationId: string) {
    setSelectedCorrelation(correlationId);
    const response = await fetch(`${eventLogUrl}/api/events/correlation/${correlationId}`, { cache: "no-store" });
    if (response.ok) {
      setFlow(await response.json());
    }
  }

  async function trigger(label: string, path: string, body: Record<string, unknown> = {}) {
    setBusyAction(label);
    try {
      const response = await fetch(`${orchestratorUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const result = await response.json();
      if (result.correlationId) {
        await selectCorrelation(result.correlationId);
      }
      await fetchEvents();
      await fetchAccount();
    } finally {
      setBusyAction(null);
    }
  }

  useEffect(() => {
    void fetchAccount();
    void fetchEvents();
    void fetchHealth();
    const interval = window.setInterval(() => {
      void fetchAccount();
      void fetchHealth();
    }, 4000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const stream = new EventSource(`${eventLogUrl}/api/events/stream`);
    stream.addEventListener("banking-event", (message) => {
      const event = JSON.parse((message as MessageEvent).data) as BankingEvent;
      setEvents((current) => [event, ...current.filter((item) => item.eventId !== event.eventId)].slice(0, 100));
      if (event.correlationId === selectedCorrelation) {
        void selectCorrelation(event.correlationId);
      }
      void fetchAccount();
    });
    stream.onerror = () => {
      void fetchEvents();
    };
    return () => stream.close();
  }, [selectedCorrelation]);

  return (
    <main>
      <header className="topbar">
        <div>
          <h1>Agentic Banking Lab</h1>
          <p>Event-driven microservices playground for OpenCode workshops</p>
        </div>
        <button className="iconButton" type="button" onClick={() => void fetchEvents()} aria-label="Refresh events">
          <RefreshCcw size={18} />
        </button>
      </header>

      <section className="overviewGrid">
        <div className="panel accountPanel">
          <div className="panelHeader">
            <WalletCards size={18} />
            <h2>Account Summary</h2>
          </div>
          <div className="balance">{account ? currency.format(Number(account.availableBalance)) : "Loading"}</div>
          <div className="metricGrid">
            <span>Owner</span>
            <strong>{account?.ownerName ?? "-"}</strong>
            <span>Account</span>
            <strong>{account?.accountId ?? "-"}</strong>
            <span>Reserved</span>
            <strong>{account ? currency.format(Number(account.reservedBalance)) : "-"}</strong>
            <span>Booked debits</span>
            <strong>{account ? currency.format(Number(account.bookedDebitTotal)) : "-"}</strong>
          </div>
        </div>

        <div className="panel statusPanel">
          <div className="panelHeader">
            <RadioTower size={18} />
            <h2>Service Status</h2>
          </div>
          <div className="serviceGrid">
            {serviceStatuses.map((service) => (
              <div className="serviceRow" key={service.name}>
                <span>{service.name}</span>
                <span className={service.status === "UP" ? "statusUp" : "statusDown"}>{service.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="workGrid">
        <div className="panel actionPanel">
          <div className="panelHeader">
            <Activity size={18} />
            <h2>Actions</h2>
          </div>
          <ActionRow
            icon={<Send size={18} />}
            label="External Transfer"
            amount={externalAmount}
            setAmount={setExternalAmount}
            busy={busyAction}
            onRun={() =>
              trigger("External Transfer", "/api/movements/external-transfer", {
                amount: externalAmount,
                currency: "EUR",
                destinationIban: "ES00DEMO1234567890"
              })
            }
          />
          <ActionRow
            icon={<CircleDollarSign size={18} />}
            label="Investment"
            amount={investmentAmount}
            setAmount={setInvestmentAmount}
            busy={busyAction}
            onRun={() =>
              trigger("Investment", "/api/movements/investment-contribution", {
                amount: investmentAmount,
                currency: "EUR",
                fundId: "fund_global_index"
              })
            }
          />
          <ActionRow
            icon={<Landmark size={18} />}
            label="Mortgage"
            amount={mortgageAmount}
            setAmount={setMortgageAmount}
            busy={busyAction}
            onRun={() =>
              trigger("Mortgage", "/api/movements/mortgage-repayment", {
                amount: mortgageAmount,
                currency: "EUR",
                mortgageId: "mortgage_001"
              })
            }
          />
          <div className="quickActions">
            <button type="button" onClick={() => trigger("Salary", "/api/demo/salary", {})}>
              <BanknoteArrowDown size={18} />
              Salary
            </button>
            <button type="button" onClick={() => trigger("Insufficient Funds", "/api/demo/insufficient-funds", {})}>
              <ShieldAlert size={18} />
              Insufficient Funds
            </button>
            <button type="button" onClick={() => trigger("Random Activity", "/api/demo/random-activity", {})}>
              <BadgeEuro size={18} />
              Random Activity
            </button>
          </div>
        </div>

        <div className="panel timelinePanel">
          <div className="panelHeader">
            <Activity size={18} />
            <h2>Event Timeline</h2>
          </div>
          <div className="timeline">
            {events.map((event) => (
              <button
                className={`eventRow ${selectedCorrelation === event.correlationId ? "selected" : ""}`}
                key={event.eventId}
                type="button"
                onClick={() => void selectCorrelation(event.correlationId)}
              >
                <span className={`badge ${eventTone(event.eventType)}`}>{event.eventType}</span>
                <span>{event.producer}</span>
                <span>{new Date(event.occurredAt).toLocaleTimeString()}</span>
                <span>corr {shortId(event.correlationId)}</span>
                <span>cause {shortId(event.causationId)}</span>
                <strong>
                  {typeof event.payload.amount === "number" ? currency.format(event.payload.amount) : ""}
                </strong>
              </button>
            ))}
            {events.length === 0 ? <div className="emptyState">No events yet</div> : null}
          </div>
        </div>

        <div className="panel detailPanel">
          <div className="panelHeader">
            <RadioTower size={18} />
            <h2>Flow Detail</h2>
          </div>
          {selectedCorrelation ? (
            <>
              <div className="correlationHeader">
                <span>Correlation</span>
                <strong>{shortId(selectedCorrelation)}</strong>
                <span>{String(selectedEvent?.payload.movementType ?? selectedEvent?.eventType ?? "Selected flow")}</span>
              </div>
              <div className="flowList">
                {flow.map((event, index) => (
                  <div className="flowItem" key={event.eventId}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <strong>{event.eventType}</strong>
                      <p>{event.producer}</p>
                    </div>
                  </div>
                ))}
              </div>
              <pre>{flow[flow.length - 1] ? JSON.stringify(flow[flow.length - 1], null, 2) : "{}"}</pre>
            </>
          ) : (
            <div className="emptyState">Select a correlation</div>
          )}
        </div>
      </section>
    </main>
  );
}

function ActionRow({
  icon,
  label,
  amount,
  setAmount,
  busy,
  onRun
}: {
  icon: React.ReactNode;
  label: string;
  amount: number;
  setAmount: (value: number) => void;
  busy: string | null;
  onRun: () => void;
}) {
  return (
    <div className="actionRow">
      <label>
        <span>{label}</span>
        <input type="number" min="1" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
      </label>
      <button type="button" disabled={busy !== null} onClick={onRun}>
        {icon}
        Run
      </button>
    </div>
  );
}
