// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file typeGuards/isNotFound.guard.ts
 * @description
 * Runtime type guard for the {@link NotFound} domain payload.
 *
 * Ensures that an unknown value matches the expected NotFound shape
 * (`{ code: "NOT_FOUND"; ... }`).
 */

import type { NotFound } from "../domain/notFound";

/**
 * Runtime check for a NotFound payload.
 */
export function isNotFound(data: unknown): data is NotFound {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as Record<string, unknown>).code === "NOT_FOUND"
  );
}
