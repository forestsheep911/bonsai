import type { HttpResponseInit } from "@azure/functions";

export function jsonResponse(status: number, body: unknown): HttpResponseInit {
  return {
    status,
    jsonBody: body,
    headers: {
      "Cache-Control": "no-store",
    },
  };
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
): HttpResponseInit {
  return jsonResponse(status, {
    ok: false,
    error: {
      code,
      message,
    },
  });
}
