import * as bcrypt from "bcryptjs";
import { messages } from "../constants/messages.js";
import logger from "../config/logger.js";
import UserModel from "../models/user.model.js";
import type {
  ForgotPasswordInput,
  RefreshSessionInput,
  SigninInput,
  SignupInput,
  UpdateProfileInput,
} from "../schemas/auth.schema.js";
import { AppError } from "../utils/app-error.js";
import { formatProfilePic } from "../utils/format-profile-pic.js";
import {
  generateResetToken,
  hashToken,
  signRefreshToken,
  signToken,
  verifyRefreshToken,
} from "../utils/token.js";

type UserJson = Record<string, unknown>;
type SanitizedUser = UserJson & { id: string; profilePic: string | null };
type UserDocument = InstanceType<typeof UserModel> & {
  password: string;
  role?: "user" | "admin";
  profilePic?: { data?: Buffer; contentType?: string } | null;
  refreshToken?: string;
  resetToken?: string;
};

const sanitizeUser = (user: InstanceType<typeof UserModel>): SanitizedUser => {
  const currentUser = user as UserDocument;
  const payload = currentUser.toJSON() as unknown as UserJson;
  return {
    ...payload,
    id: currentUser.id,
    profilePic: formatProfilePic(currentUser.profilePic),
  };
};

const buildSession = (user: InstanceType<typeof UserModel>) => {
  const currentUser = user as UserDocument;
  const token = signToken({ id: user.id, role: currentUser.role || "user" });
  const refreshToken = signRefreshToken({ id: user.id, role: currentUser.role || "user" });

  return { token, refreshToken, user: sanitizeUser(user) };
};

const signup = async (payload: SignupInput) => {
  const existingUser = await UserModel.findOne({ email: payload.email });
  if (existingUser) throw new AppError(messages.auth.userExists, 409);

  const user = await UserModel.create({
    ...payload,
    password: await bcrypt.hash(payload.password, 10),
    refreshToken: undefined,
  });

  const session = buildSession(user);
  user.refreshToken = hashToken(session.refreshToken);
  await user.save();

  return session;
};

const signin = async ({ email, password }: SigninInput) => {
  const user = (await UserModel.findOne({ email })) as UserDocument | null;
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(messages.auth.invalidCredentials, 401);
  }

  const session = buildSession(user);
  user.refreshToken = hashToken(session.refreshToken);
  await user.save();

  return session;
};

const refreshSession = async ({ refreshToken }: RefreshSessionInput) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await UserModel.findById(payload?.id);

    if (!user || (user as UserDocument).refreshToken !== hashToken(refreshToken)) {
      throw new AppError(messages.auth.invalidRefreshToken, 401);
    }

    const session = buildSession(user);
    user.refreshToken = hashToken(session.refreshToken);
    await user.save();

    return session;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(messages.auth.invalidRefreshToken, 401);
  }
};

const logout = async ({ refreshToken }: RefreshSessionInput) => {
  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await UserModel.findById(payload?.id);
    if (user?.refreshToken === hashToken(refreshToken)) {
      user.refreshToken = undefined;
      await user.save();
    }
  } catch {
    return;
  }
};

const getProfile = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new AppError(messages.common.userNotFound, 404);
  return sanitizeUser(user);
};

const updateProfile = async (
  userId: string,
  updateData: UpdateProfileInput,
  file?: Express.Multer.File
) => {
  const update = {
    ...updateData,
    ...(file
      ? {
          profilePic: {
            data: file.buffer,
            contentType: file.mimetype,
          },
        }
      : {}),
  } as const;

  const user = await UserModel.findByIdAndUpdate(userId, update, {
    new: true,
    runValidators: true,
  });

  if (!user) throw new AppError(messages.common.userNotFound, 404);
  return sanitizeUser(user);
};

const createResetToken = async ({ email }: ForgotPasswordInput) => {
  const user = await UserModel.findOne({ email });
  if (!user) return {};

  const resetToken = generateResetToken();
  user.resetToken = hashToken(resetToken);
  user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  if (process.env.NODE_ENV !== "production") {
    logger.info(`Password reset token for ${email}: ${resetToken}`);
    return { resetToken };
  }

  return {};
};

const resetPassword = async (token: string, password: string) => {
  const user = await UserModel.findOne({
    resetToken: hashToken(token),
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user) throw new AppError(messages.auth.invalidToken, 400);

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  user.refreshToken = undefined;
  await user.save();
};

export const authService = {
  signup,
  signin,
  refreshSession,
  logout,
  getProfile,
  updateProfile,
  createResetToken,
  resetPassword,
};

export {
  signup,
  signin,
  refreshSession,
  logout,
  getProfile,
  updateProfile,
  createResetToken,
  resetPassword,
};
