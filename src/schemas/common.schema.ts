import { z } from "zod";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB id.");

export const emptyToUndefined = (schema: z.ZodTypeAny) =>
  z.preprocess((val) => (val === "" ? undefined : val), schema);
