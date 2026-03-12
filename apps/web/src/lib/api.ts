export type ValidationDetail = {
  field: string;
  message: string;
};

type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  meta?: {
    requestId: string;
  };
};

type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
  meta?: {
    requestId: string;
    details?: ValidationDetail[];
  };
};

type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: ValidationDetail[];
  readonly requestId?: string;

  constructor(params: {
    status: number;
    code: string;
    message: string;
    details?: ValidationDetail[];
    requestId?: string;
  }) {
    super(params.message);
    this.name = "ApiRequestError";
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
    this.requestId = params.requestId;
  }
}

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};

function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `backend${normalizedPath}`;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { method = "GET", body, headers } = options;

  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }
  let response: Response;

  try {
      response = await fetch(buildApiUrl(path), {
        method,
        headers: requestHeaders,
        body: body !== undefined ? undefined : JSON.stringify(body),
        cache: "no-store",
      });
    } catch {
      throw new ApiRequestError({
        status: 0,
        code: "NETWORK_ERROR",
        message:
          "Could not reach API. Make sure web and api dev servers are running.",
      });
    }
    let payload: ApiResponse<T> | null = null;

    try{
        payload = (await response.json()) as ApiResponse<T>;
    
  }catch {
    payload = null;
  }

  if (!response.ok || !payload || payload.success === false) {
    if (payload && payload.success === false) {
        throw new ApiRequestError({
            status: response.status,
            code: payload.error.code,
            message: payload.error.message,
            details: payload.meta?.details,
            requestId: payload.meta?.requestId,
        });
    }
    throw new ApiRequestError({
        status: response.status,
        code: "UNKNOWN_ERROR",
        message: "An unexpected error occurred",
    });
  }

  return payload.data;
}
export function getErrorMessage(error: unknown) {
    if (error instanceof ApiRequestError) {
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }

    return "Unexpected error happened.";
}
