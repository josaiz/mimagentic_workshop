import assert from "node:assert/strict";
import test from "node:test";
import { externalTransferSchema } from "./validation.js";

test("external transfer defaults source account and currency", () => {
  const parsed = externalTransferSchema.parse({
    amount: 100,
    destinationIban: "ES00DEMO1234567890"
  });

  assert.equal(parsed.sourceAccountId, "acc_main_001");
  assert.equal(parsed.currency, "EUR");
});

test("external transfer rejects non-positive amount", () => {
  assert.throws(() => externalTransferSchema.parse({ amount: -1, destinationIban: "ES00DEMO1234567890" }));
});
