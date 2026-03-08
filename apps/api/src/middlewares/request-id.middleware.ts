import { randomUUID } from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export function requestIdMiddleware(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  const requestId = randomUUID();

  res.locals.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  next();
}
