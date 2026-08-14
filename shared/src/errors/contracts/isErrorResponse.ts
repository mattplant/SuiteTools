// SPDX-License-Identifier: GPL-3.0-or-later

import type { ErrorResponse } from "./ErrorResponse";

const SEVERITIES = new Set(["info", "warning", "error", "fatal"]);

/**
 * Structural check for a serialized API {@link ErrorResponse}.
 *
 * Distinct from the success envelope (`{ status, data, message? }`):
 * error payloads carry top-level `code` and never include `data`.
 */
export function isErrorResponse(value: unknown): value is ErrorResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const v = value as Record<string, unknown>;

  // Success / soft-404 envelopes always include `data`.
  if ("data" in v) {
    return false;
  }

  if (typeof v.status !== "number" || typeof v.code !== "string" || typeof v.message !== "string") {
    return false;
  }

  if (v.severity !== undefined && !SEVERITIES.has(String(v.severity))) {
    return false;
  }

  if (v.context !== undefined && (typeof v.context !== "object" || v.context === null || Array.isArray(v.context))) {
    return false;
  }

  return true;
}

/**
 * Normalize a wire payload into a complete {@link ErrorResponse}.
 * @returns Normalized error response, or `null` if the value is not an error payload.
 */
export function parseErrorResponse(value: unknown): ErrorResponse | null {
  if (!isErrorResponse(value)) {
    return null;
  }

  const severity = value.severity && SEVERITIES.has(value.severity) ? value.severity : "error";

  const out: ErrorResponse = { status: value.status, code: value.code, message: value.message, severity };

  if (value.context) {
    out.context = value.context;
  }

  return out;
}
