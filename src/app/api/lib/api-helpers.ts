import { NextResponse } from "next/server";
import type { ApiResponse } from "@/types/dashboard.types";

/**
 * 200 / 201 success response.
 * @param data    The payload to send.
 * @param status  HTTP status code (default: 200).
 */
export function ok<T>(data: T, status: 200 | 201 = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data } satisfies ApiResponse<T>, { status });
}

/**
 * Generic error response.
 * @param message Human-readable error description.
 * @param status  HTTP status code (default: 400).
 */
export function apiError(
  message: string,
  status: 400 | 401 | 403 | 404 | 409 | 422 | 500 = 400
): NextResponse<ApiResponse<never>> {
  return NextResponse.json({ error: message } satisfies ApiResponse<never>, { status });
}

/** 401 Unauthorized */
export function unauthorized(): NextResponse<ApiResponse<never>> {
  return apiError("Unauthorized", 401);
}

/** 404 Not Found */
export function notFound(msg = "Not found"): NextResponse<ApiResponse<never>> {
  return apiError(msg, 404);
}

/** 500 Internal Server Error */
export function serverError(err: unknown): NextResponse<ApiResponse<never>> {
  const message = err instanceof Error ? err.message : "Internal server error";
  console.error("[API Error]", err);
  return apiError(message, 500);
}

/** 400 Bad Request */
export function badRequest(msg = "Bad request"): NextResponse<ApiResponse<never>> {
  return apiError(msg, 400);
}
