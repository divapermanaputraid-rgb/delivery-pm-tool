import type { Response } from "express";

type SuccessMeta = Record<string, unknown>;

type SuccessResponse<T> = {
  success: true;
  data: T;
  meta: {
    requestId: string;
  } & SuccessMeta;
};

type ErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
  meta: {
    requestId: string;
  } & Record<string, unknown>;
};

function getRequestId(res: Response): string {
  return res.locals.requestId ?? "unknown";
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  options?: {
    statusCode?: number;
    meta?: Record<string, unknown>;
  },
) {
  const body: SuccessResponse<T> = {
    success: true,
    data,
    meta: {
      requestId: getRequestId(res),
      ...(options?.meta ?? {}),
    },
  };
  return res.status(options?.statusCode ?? 200).json(body);
}

export function sendError(
  res: Response,
  options: {
    statusCode: number;
    code: string;
    message: string;
    meta?: Record<string, unknown>;
  },
) {
  const body: ErrorResponse = {
    success: false,
    error: {
      code: options.code,
      message: options.message,
    },
    meta: {
      requestId: getRequestId(res),
      ...(options.meta ?? {}),
    },
  };
  return res.status(options.statusCode).json(body);
}
