import { z } from "zod";
import { emptyToUndefined, objectIdSchema } from "./common.schema.js";

const positiveInt = z.coerce.number().int().min(1);
const sortField = z.enum([
  "doctorName",
  "specialityName",
  "hospital",
  "location",
  "experience",
  "reviews",
  "patients",
  "consultationFee",
]);
const sortOrder = z.enum(["asc", "desc"]);
const doctorBodySchema = z.object({
  doctorName: z.string().trim().min(1),
  specialityName: z.string().trim().min(1),
  hospital: z.string().trim().min(1),
  about: z.string().trim().min(1).optional(),
  patients: z.coerce.number().int().min(0).optional(),
  experience: z.coerce.number().int().min(0).optional(),
  reviews: z.coerce.number().int().min(0).optional(),
  consultationFee: z.coerce.number().min(0).optional(),
  location: z.string().trim().min(1).optional(),
  available: z.coerce.boolean().optional(),
});

export const doctorQuerySchema = z.object({
  query: z
    .object({
      page: z.preprocess((v) => (v === "" ? undefined : v), positiveInt.optional()),
      limit: z.preprocess((v) => (v === "" ? undefined : v), positiveInt.optional()),
      pageNumber: z.preprocess((v) => (v === "" ? undefined : v), positiveInt.optional()),
      pageSize: z.preprocess((v) => (v === "" ? undefined : v), positiveInt.optional()),
      search: z.string().trim().optional(),
      speciality: z.string().trim().optional(),
      hospital: z.string().trim().optional(),
      location: z.string().trim().optional(),
      available: z.preprocess((v) => {
        if (v === "true") return true;
        if (v === "false") return false;
        return undefined;
      }, z.boolean().optional()),
      sortBy: sortField.optional(),
      order: sortOrder.optional(),
    })
    .transform(({ page, limit, pageNumber, pageSize, ...rest }) => ({
      page: page ?? pageNumber,
      limit: limit ?? pageSize,
      ...rest,
    })),
});

export const doctorParamsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const createDoctorSchema = z.object({
  body: doctorBodySchema,
});

export const updateDoctorSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
  body: doctorBodySchema.partial().refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required.",
  }),
});

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>["body"];
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>["body"];
