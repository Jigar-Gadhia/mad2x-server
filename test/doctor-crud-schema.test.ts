import test from "node:test";
import assert from "node:assert/strict";
import { createDoctorSchema, updateDoctorSchema } from "../src/schemas/doctor.schema";

test("createDoctorSchema accepts required doctor fields", () => {
  assert.doesNotThrow(() =>
    createDoctorSchema.parse({
      body: {
        doctorName: "Dr. Aarya Mehta",
        specialityName: "Cardiology",
        hospital: "City Care Hospital",
      },
    })
  );
});

test("updateDoctorSchema requires at least one field", () => {
  assert.throws(
    () =>
      updateDoctorSchema.parse({
        params: { id: "doctor-id" },
        body: {},
      }),
    /At least one field is required/
  );
});
