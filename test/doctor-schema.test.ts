import test from "node:test";
import assert from "node:assert/strict";
import { doctorQuerySchema } from "../src/schemas/doctor.schema";

test("doctorQuerySchema normalizes legacy pagination fields", () => {
  const parsed = doctorQuerySchema.parse({
    query: { pageNumber: "2", pageSize: "5", search: "cardio", order: "desc" },
  });

  assert.deepEqual(parsed.query, {
    page: 2,
    limit: 5,
    search: "cardio",
    order: "desc",
  });
});

test("doctorQuerySchema handles empty query strings as undefined", () => {
  const parsed = doctorQuerySchema.parse({
    query: { page: "", limit: "", search: "", available: "", sortBy: "" },
  });

  assert.deepEqual(parsed.query, {
    page: undefined,
    limit: undefined,
    search: undefined,
    available: undefined,
    sortBy: undefined,
  });
});
