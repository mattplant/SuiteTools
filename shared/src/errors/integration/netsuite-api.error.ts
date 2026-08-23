// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Thrown when a NetSuite API call fails.
 *
 * @fileoverview
 * Wraps a failed request with the endpoint, HTTP status and any NetSuite error code, so a
 * failure can be told apart from a SuiteTools bug when it surfaces in logs.
 *
 * @remarks
 * `service` is fixed to "NetSuite" so integration errors stay greppable if other services are
 * ever added alongside. `status` and `nsErrorCode` are optional because NetSuite does not
 * always return either — treat their absence as unknown, not as success.
 *
 * @see ../base/SuiteError.ts – the code/severity contract
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

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
      /** Extra wire context merged into the error context (e.g. Zod issues). */
      context?: Record<string, unknown>;
    },
  ) {
    super(message, {
      cause: opts.cause,
      context: {
        service: "NetSuite",
        endpoint: opts.endpoint,
        status: opts.status,
        nsErrorCode: opts.nsErrorCode,
        ...opts.context,
      },
    });

    this.endpoint = opts.endpoint;
    this.status = opts.status;
    this.nsErrorCode = opts.nsErrorCode;
  }
}
