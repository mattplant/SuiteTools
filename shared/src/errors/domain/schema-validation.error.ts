// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Thrown when Zod validation fails at a trust boundary.
 *
 * @fileoverview
 * Carries the raw `ZodIssue[]` alongside the schema name, so a failure can be logged
 * machine-readably and still rendered for a human. Raised by the backend's request and
 * response validators.
 *
 * @remarks
 * Holds issues rather than a formatted string on purpose: formatting at the throw site loses
 * the paths that make a validation failure diagnosable. This is the one error class that
 * depends on a Zod *type* — a type-only import, so the `/errors` subpath stays runtime-free.
 *
 * @see ../base/SuiteError.ts – the code/severity contract
 * @see ../../errors-entry.ts – why the Zod runtime must not leak in here
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

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
  /** Stable taxonomy code for schema validation failures. */
  public readonly code = "SCHEMA_VALIDATION_ERROR";

  /** Severity level for governance and logging. */
  public readonly severity = "error" as const;

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
