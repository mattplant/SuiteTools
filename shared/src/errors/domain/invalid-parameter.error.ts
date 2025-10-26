// SPDX-License-Identifier: GPL-3.0-or-later

import { SuiteError } from "../base/SuiteError";

/**
 * Error thrown when a request parameter is invalid or missing.
 *
 * Used for API endpoint validation, query parameters, and request body validation.
 */
export class InvalidParameterError extends SuiteError {
  public readonly code = "INVALID_PARAMETER";
  public readonly severity = "warning";

  /**
   * Creates an InvalidParameterError.
   *
   * @param parameterName - The name of the invalid parameter
   * @param value - The invalid value provided (optional)
   * @param reason - Human-readable explanation of why it's invalid (optional)
   * @param cause - Underlying error or value (optional)
   *
   * @example
   * throw new InvalidParameterError("endpoint", "invalid_endpoint", "Endpoint not recognized");
   * throw new InvalidParameterError("id", undefined, "Missing required parameter");
   */
  constructor(
    parameterName: string,
    value?: unknown,
    reason?: string,
    cause?: unknown
  ) {
    const message = reason
      ? `Invalid parameter: ${parameterName}=${String(value)} - ${reason}`
      : `Invalid parameter: ${parameterName}=${String(value)}`;

    super(message, {
      context: { parameterName, value, reason },
      cause,
    });
  }
}
