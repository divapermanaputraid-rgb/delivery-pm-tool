import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../errors/app-error.js";

export function validateRequest(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message,
      }));

      return next(
        new AppError({
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          statusCode: 400,
          meta: {
            details,
          },
        }),
      );
    }
    req.body = result.data;
    next();
  };
}
