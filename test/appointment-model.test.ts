import test from "node:test";
import assert from "node:assert/strict";
import AppointmentModel from "../src/models/appointment.model";

test("appointment model defines a unique index for scheduled doctor slots", () => {
  const indexes = AppointmentModel.schema.indexes();
  assert.ok(
    indexes.some(
      ([fields, options]) =>
        fields.doctor === 1 &&
        fields.appointmentDate === 1 &&
        options?.unique === true &&
        options?.partialFilterExpression?.status === "scheduled"
    )
  );
});

test("appointment model defines a unique index for scheduled user slots", () => {
  const indexes = AppointmentModel.schema.indexes();
  assert.ok(
    indexes.some(
      ([fields, options]) =>
        fields.user === 1 &&
        fields.appointmentDate === 1 &&
        options?.unique === true &&
        options?.partialFilterExpression?.status === "scheduled"
    )
  );
});
