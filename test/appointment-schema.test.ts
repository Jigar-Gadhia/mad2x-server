import test from "node:test";
import assert from "node:assert/strict";
import { appointmentQuerySchema, createAppointmentSchema } from "../src/schemas/appointment.schema";

test("createAppointmentSchema accepts a future appointment", () => {
  assert.doesNotThrow(() =>
    createAppointmentSchema.parse({
      body: {
        doctorId: "507f1f77bcf86cd799439011",
        appointmentDate: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      },
    })
  );
});

test("createAppointmentSchema rejects past appointments", () => {
  assert.throws(
    () =>
      createAppointmentSchema.parse({
        body: {
          doctorId: "507f1f77bcf86cd799439011",
          appointmentDate: new Date(Date.now() - 60 * 1000).toISOString(),
        },
      }),
    /future/
  );
});

test("appointmentQuerySchema accepts status filter", () => {
  const parsed = appointmentQuerySchema.parse({ query: { status: "scheduled" } });
  assert.equal(parsed.query.status, "scheduled");
});
