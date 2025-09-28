// SPDX-License-Identifier: GPL-3.0-or-later

import { SuiteError } from "../base/SuiteError";

/**
 * Error thrown when a requested resource cannot be found.
 *
 * Complements the `NotFound` domain primitive by representing
 * a runtime exception rather than a data payload.
 *
 * Includes structured context with the resource type and ID.
 */
export class NotFoundError extends SuiteError {
  constructor(resource: string, id: string | number) {
    super(`${resource} with ID ${id} was not found`, {
      context: { resource, id },
    });
  }
}
