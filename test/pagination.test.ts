import test from "node:test";
import assert from "node:assert/strict";
import { getPagination } from "../src/utils/pagination";

test("getPagination normalizes invalid values and caps limit", () => {
  assert.deepEqual(getPagination({ page: 0, limit: 999 }), {
    page: 1,
    limit: 100,
    skip: 0,
  });
});

test("getPagination calculates skip correctly", () => {
  assert.deepEqual(getPagination({ page: 3, limit: 5 }), {
    page: 3,
    limit: 5,
    skip: 10,
  });
});
