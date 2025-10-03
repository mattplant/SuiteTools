// SPDX-License-Identifier: GPL-3.0-or-later

import { SuiteError } from "../base/SuiteError";

/**
 * Error thrown when a requested resource cannot be found.
 */
export class NotFoundError extends SuiteError {
  public readonly code = "NOT_FOUND";
  public readonly severity = "warning";

  constructor(resource: string, id: string | number, cause?: unknown) {
    super(`${resource} with ID ${id} was not found`, {
      context: { resource, id },
      cause,
    });
  }
}
