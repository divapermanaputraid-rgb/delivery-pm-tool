import type { Request, Response } from "express";

export function notFoundHandler(req: Request, res: Response) {
  const requestId = res.locals.requestId ?? "unknown";

  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: `Route ${req.method} ${req.originalUrl} not found`,
      requestId,
    },
  });
}
