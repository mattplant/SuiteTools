// SPDX-License-Identifier: GPL-3.0-or-later

import { SuiteError } from "../base/SuiteError";

/**
 * Error thrown when an unexpected error occurs that doesn't fit other categories.
 *
 * Used as a wrapper for caught errors that are not SuiteError subclasses,
 * or for truly unexpected situations that indicate a bug or system issue.
 *
 * This should NOT be used for expected error conditions - use a more specific
 * error class instead. If you find yourself using this frequently for the same
 * scenario, consider creating a dedicated error class.
 */
export class UnexpectedError extends SuiteError {
  public readonly code = "UNEXPECTED_ERROR";
  public readonly severity = "error";

  /**
   * Creates an UnexpectedError.
   *
   * @param operation - The operation that failed (e.g., "process()", "parseData()")
   * @param cause - The underlying error or unexpected value
   * @param context - Additional debugging context (optional)
   *
   * @example
   * try {
   *   // some operation
   * } catch (err) {
   *   throw new UnexpectedError("process()", err, { endpoint: "users" });
   * }
   */
  constructor(
    operation: string,
    cause: unknown,
    context?: Record<string, unknown>
  ) {
    const causeMessage = cause instanceof Error ? cause.message : String(cause);
    const message = `Unexpected error in ${operation}: ${causeMessage}`;

    super(message, {
      context: { operation, ...context },
      cause,
    });
  }
}
