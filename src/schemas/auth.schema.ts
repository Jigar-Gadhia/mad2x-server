import { z } from "zod";

export const signupSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1),
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(6),
    mobile: z.string().trim().optional(),
    age: z.coerce.number().int().min(0).optional(),
    address: z.string().trim().optional(),
  }),
});

export const signinSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
  }),
});

export const refreshSessionSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    password: z.string().min(6),
  }),
  params: z.object({
    token: z.string().trim().min(1),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    mobile: z.string().trim().optional(),
    age: z.coerce.number().int().min(0).optional(),
    address: z.string().trim().optional(),
  }),
});

export type SignupInput = z.infer<typeof signupSchema>["body"];
export type SigninInput = z.infer<typeof signinSchema>["body"];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type RefreshSessionInput = z.infer<typeof refreshSessionSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
