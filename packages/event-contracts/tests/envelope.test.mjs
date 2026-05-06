import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const schema = JSON.parse(fs.readFileSync(new URL("../events/envelope.schema.json", import.meta.url)));
const ajv = new Ajv2020();
addFormats(ajv);
const validate = ajv.compile(schema);

test("validates a representative event envelope", () => {
  const ok = validate({
    eventId: "10000000-0000-4000-8000-000000000001",
    eventType: "MoneyMovementRequested",
    eventVersion: 1,
    occurredAt: "2026-05-05T10:30:00.000Z",
    producer: "movement-orchestrator",
    correlationId: "10000000-0000-4000-8000-000000000002",
    causationId: null,
    idempotencyKey: "demo-key",
    aggregateId: "acc_main_001",
    payload: {}
  });

  assert.equal(ok, true, JSON.stringify(validate.errors));
});
