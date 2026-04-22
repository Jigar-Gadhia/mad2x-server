import test from "node:test";
import assert from "node:assert/strict";
import {
  refreshSessionSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
} from "../src/schemas/auth.schema";

test("signupSchema accepts valid payload", () => {
  assert.doesNotThrow(() =>
    signupSchema.parse({
      body: { name: "Jigar", email: "jigar@example.com", password: "secret12" },
    })
  );
});

test("signinSchema rejects missing fields", () => {
  assert.throws(() => signinSchema.parse({ body: { email: "" } }), /Invalid email|Required/);
});

test("resetPasswordSchema rejects short passwords", () => {
  assert.throws(
    () => resetPasswordSchema.parse({ body: { password: "123" }, params: { token: "abc" } }),
    /at least 6 character/
  );
});

test("refreshSessionSchema requires refresh token", () => {
  assert.throws(() => refreshSessionSchema.parse({ body: {} }), /Required/);
});
