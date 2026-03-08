import type { NextFunction, Request, Response } from "express";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const requestId = res.locals.requestId ?? "unknown";
  console.error(`[${requestId}]`, error);

  res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error",
      requestId,
    },
  });
}
