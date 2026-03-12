import { NextRequest, NextResponse } from "next/server";

const apiBaseUrl = (
  process.env.API_PROXY_TARGET ?? "http://localhost:3001"
).replace(/\/$/, "");

function buildTargetUrl(pathSegments: string[], request: NextRequest) {
  const joinedPath = pathSegments.join("/");
  const search = request.nextUrl.search;
  return `${apiBaseUrl}/api/v1/${joinedPath}${search}`;
}

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  const targetUrl = buildTargetUrl(path, request);

  const requestHeaders = new Headers();
  const contentType = request.headers.get("content-type");

  if (contentType) {
    requestHeaders.set("content-type", contentType);
  }

  let upstreamResponse: Response;

  try {
    upstreamResponse = await fetch(targetUrl, {
      method: request.method,
      headers: requestHeaders,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.text(),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "PROXY_UPSTREAM_UNREACHABLE",
          message: "Could not reach upstream API server.",
        },
        meta: {
          requestId: crypto.randomUUID(),
        },
      },
      {
        status: 502,
      },
    );
  }

  const responseText = await upstreamResponse.text();
  const responseContentType =
    upstreamResponse.headers.get("content-type") ??
    "application/json; charset=utf-8";

  return new NextResponse(responseText, {
    status: upstreamResponse.status,
    headers: {
      "content-type": responseContentType,
    },
  });
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  return proxyRequest(request, context);
}
