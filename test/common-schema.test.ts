import test from "node:test";
import assert from "node:assert/strict";
import { objectIdSchema } from "../src/schemas/common.schema";

test("objectIdSchema accepts valid Mongo ids", () => {
  assert.equal(objectIdSchema.parse("507f1f77bcf86cd799439011"), "507f1f77bcf86cd799439011");
});

test("objectIdSchema rejects invalid Mongo ids", () => {
  assert.throws(() => objectIdSchema.parse("invalid-id"), /Invalid MongoDB id/);
});
