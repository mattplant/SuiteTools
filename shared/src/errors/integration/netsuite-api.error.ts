// SPDX-License-Identifier: GPL-3.0-or-later

import { SuiteError } from "../base/SuiteError";

/**
 * Error thrown when a NetSuite API request fails.
 *
 * Includes structured context with the service name, endpoint,
 * HTTP status, and optional NetSuite error code.
 */
export class NetSuiteApiError extends SuiteError {
  /** Machine-readable taxonomy code. */
  public readonly code = "NETSUITE_API_ERROR";

  /** Severity level for governance and logging. */
  public readonly severity = "error" as const;

  /** The service name (always "NetSuite"). */
  public readonly service = "NetSuite";

  /** The API endpoint that was called. */
  public readonly endpoint: string;

  /** The HTTP status code returned by the API. */
  public readonly status: number | undefined;

  /** Optional NetSuite error code returned in the response. */
  public readonly nsErrorCode: string | undefined;

  /**
   * Constructs a new NetSuiteApiError.
   *
   * @param message - Human-readable error message.
   * @param opts - Additional error details including endpoint, status, code, and cause.
   */
  constructor(
    message: string,
    opts: {
      endpoint: string;
      status?: number;
      nsErrorCode?: string;
      cause?: unknown;
    }
  ) {
    super(message, {
      cause: opts.cause,
      context: {
        service: "NetSuite",
        endpoint: opts.endpoint,
        status: opts.status,
        nsErrorCode: opts.nsErrorCode,
      },
    });

    this.endpoint = opts.endpoint;
    this.status = opts.status;
    this.nsErrorCode = opts.nsErrorCode;
  }
}
