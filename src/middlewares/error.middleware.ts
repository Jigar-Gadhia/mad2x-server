import type { NextFunction, Request, Response } from "express";
import { messages } from "../constants/messages";

export const notFound = (req: Request, _res: Response, next: NextFunction) => {
  const error = new Error(`${messages.common.notFound} ${req.method} ${req.originalUrl}`) as Error & {
    statusCode?: number;
  };

  error.statusCode = 404;
  next(error);
};

export const errorHandler = (
  error: Error & { statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const isCastError = "name" in error && error.name === "CastError";
  const isDuplicateKeyError = "code" in error && error.code === 11000;

  return res.status(error.statusCode || (isCastError ? 400 : isDuplicateKeyError ? 409 : 500)).json({
    success: false,
    message: isCastError
      ? messages.common.invalidId
      : isDuplicateKeyError
        ? messages.common.duplicateResource
        : error.message || messages.common.serverError,
  });
};
