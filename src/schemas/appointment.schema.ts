import { z } from "zod";
import { emptyToUndefined, objectIdSchema } from "./common.schema.js";

export const createAppointmentSchema = z.object({
  body: z.object({
    doctorId: objectIdSchema,
    appointmentDate: z.coerce.date().refine((value) => value.getTime() > Date.now(), {
      message: "Appointment date must be in the future.",
    }),
    notes: z.string().trim().max(500).optional(),
  }),
});

export const appointmentQuerySchema = z.object({
  query: z.object({
    status: emptyToUndefined(z.enum(["scheduled", "cancelled", "completed"]).optional()),
  }),
});

export const appointmentParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>["body"];
export type AppointmentQueryInput = z.infer<typeof appointmentQuerySchema>["query"];
