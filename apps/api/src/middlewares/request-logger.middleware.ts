import type { NextFunction, Request, Response } from "express";

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const startTime = Date.now();

  res.on("finish", () => {
    const durationMs = Date.now() - startTime;
    const requestId = res.locals.requestId ?? "unknown";

    console.log(
      `[${requestId}] ${req.method} ${req.originalUrl} - ${res.statusCode} ${durationMs}ms`,
    );
  });

  next();
}
