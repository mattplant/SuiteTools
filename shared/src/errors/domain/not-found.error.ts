// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Thrown when a requested resource does not exist.
 *
 * @fileoverview
 * The exception half of the not-found pair. Backend API handlers throw this; the frontend sees
 * it as a normalised error response rather than a bare 404.
 *
 * @remarks
 * Severity is `warning`, not `error` — a missing record is a normal outcome of a user-supplied
 * id, and paging it as an error creates noise. Use the `NotFound` domain value instead when
 * absence is an expected result rather than a failure.
 *
 * @see ../../domain/notFound.ts – the returned-value counterpart
 * @see ../base/SuiteError.ts – the code/severity contract
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { SuiteError } from "../base/SuiteError";

/**
 * Error thrown when a requested resource cannot be found.
 */
export class NotFoundError extends SuiteError {
  public readonly code = "NOT_FOUND";
  public readonly severity = "warning";

  constructor(resource: string, id: string | number, cause?: unknown) {
    super(`${resource} with ID ${id} was not found`, { context: { resource, id }, cause });
  }
}
