import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";
import { ZodError } from "zod";
import { AppError } from "../utils/app-error";

export const validate =
  (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      if (parsed.body) {
        req.body = parsed.body;
      }
      if (parsed.query) {
        const query = req.query as any;
        Object.keys(query).forEach((key) => delete query[key]);
        Object.assign(query, parsed.query);
      }
      if (parsed.params) {
        const params = req.params as any;
        Object.keys(params).forEach((key) => delete params[key]);
        Object.assign(params, parsed.params);
      }
      next();
    } catch (error: any) {
      const message = error.issues
        ? error.issues.map((issue: any) => issue.message).join(", ")
        : error.message || "Invalid request";
      next(new AppError(message, 400));
    }
  };
