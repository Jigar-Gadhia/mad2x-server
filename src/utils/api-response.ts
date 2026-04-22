import type { Response } from "express";

export const success = <T>(res: Response, data: T, message = "Success", statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data });
