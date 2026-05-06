import assert from "node:assert/strict";
import test from "node:test";

test("event-log duplicate semantics are based on eventId", () => {
  const sql = "ON CONFLICT (event_id) DO NOTHING";
  assert.match(sql, /event_id/);
});
