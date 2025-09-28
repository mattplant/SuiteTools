// SPDX-License-Identifier: GPL-3.0-or-later

import type { ZodIssue } from "zod";
import { SuiteError } from "../base/SuiteError";

/**
 * Error thrown when a Zod schema validation fails.
 *
 * Complements the schema layer by representing a runtime exception
 * rather than a data payload. Includes structured context with the
 * schema name and validation issues for both human‑readable and
 * machine‑readable logging.
 */
export class SchemaValidationError extends SuiteError {
  /**
   * The list of Zod issues that caused validation to fail.
   */
  public readonly issues: ZodIssue[];

  /**
   * Constructs a new SchemaValidationError.
   *
   * @param schema - The name or identifier of the schema being validated.
   * @param issues - The array of Zod issues returned by validation.
   */
  constructor(schema: string, issues: ZodIssue[]) {
    super(`Validation failed for schema "${schema}".`, {
      cause: issues, // raw array for structured logging or programmatic inspection
      context: { schema, issues }, // included in toString() and toJSON()
    });
    this.issues = issues;
  }
}
