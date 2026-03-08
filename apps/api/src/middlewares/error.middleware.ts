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
  console.error(`[${requestId}]`, error);

  if (error instanceof AppError) {
    return sendError(res, {
      statusCode: error.statusCode,
      code: error.code,
      message: error.message,
    });
  }

  return sendError(res, {
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
  });
}
