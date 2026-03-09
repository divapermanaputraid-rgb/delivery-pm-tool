import type { NextFunction, Request, Response } from "express";
import { sendError } from "../utils/response.js";
import { AppError } from "../errors/app-error.js";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const requestId = res.locals.requestId ?? "unknown";

  if (error instanceof AppError) {
    if (error.statusCode >= 500) {
      console.error(`[${requestId}]`, error);
    }
    return sendError(res, {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
      meta: error.meta,
    });
  }

  console.error(`[${requestId}]`, error);
  return sendError(res, {
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
}
