import type { Request, Response } from "express";
import { messages } from "../constants/messages.js";
import type {
  ForgotPasswordInput,
  RefreshSessionInput,
  SigninInput,
  SignupInput,
  UpdateProfileInput,
} from "../schemas/auth.schema.js";
import { authService } from "../services/auth.service.js";
import { success } from "../utils/api-response.js";

export const signup = async (req: Request, res: Response) =>
  success(res, await authService.signup(req.body as SignupInput), messages.auth.userCreated, 201);

export const signin = async (req: Request, res: Response) =>
  success(res, await authService.signin(req.body as SigninInput), messages.auth.signinSuccess);

export const refreshSession = async (req: Request, res: Response) =>
  success(res, await authService.refreshSession(req.body as RefreshSessionInput), messages.auth.tokenRefreshed);

export const logout = async (req: Request, res: Response) => {
  await authService.logout(req.body as RefreshSessionInput);
  return success(res, null, messages.auth.logoutSuccess);
};

export const forgotPassword = async (req: Request, res: Response) =>
  success(
    res,
    await authService.createResetToken(req.body as ForgotPasswordInput),
    messages.password.resetRequested
  );

export const resetPassword = async (req: Request, res: Response) => {
  await authService.resetPassword(req.params.token as string, req.body.password as string);
  return success(res, null, messages.auth.passwordUpdated);
};

export const profile = async (req: Request, res: Response) =>
  success(res, await authService.getProfile(req.user!.id));

export const updateProfile = async (req: Request, res: Response) =>
  success(
    res,
    await authService.updateProfile(req.user!.id, req.body as UpdateProfileInput, req.file),
    messages.auth.profileUpdated
  );
