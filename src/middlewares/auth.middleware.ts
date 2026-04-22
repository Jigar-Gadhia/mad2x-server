import type { NextFunction, Request, Response } from "express";
import { messages } from "../constants/messages.js";
import { AppError } from "../utils/app-error.js";
import { verifyToken } from "../utils/token.js";

export const auth = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : header;

  if (!token) return next(new AppError(messages.auth.unauthorized, 401));

  try {
    req.user = verifyToken(token);
    next();
  } catch {
    next(new AppError(messages.auth.invalidToken, 401));
  }
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== "admin") return next(new AppError(messages.auth.forbidden, 403));
  next();
};
