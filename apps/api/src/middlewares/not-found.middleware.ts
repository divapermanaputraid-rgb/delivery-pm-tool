import type { Request, Response } from "express";
import { sendError } from "../utils/response.js";

export function notFoundHandler(req: Request, res: Response) {
  //   const requestId = res.locals.requestId ?? "unknown";

  return sendError(res, {
    statusCode: 404,
    code: "NOT_FOUND",
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}
