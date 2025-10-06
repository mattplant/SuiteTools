// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Serialized error response contract for API boundaries.
 * Used by backend controllers and consumed by frontend clients.
 */
export interface ErrorResponse {
  status: number;
  code: string;
  message: string;
  severity: "info" | "warning" | "error" | "fatal";
  context?: Record<string, unknown>;
}
