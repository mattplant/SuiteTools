// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file guards.ts
 * @description
 * Runtime type guards for SuiteTools error classes.
 *
 * Provides a generic guard factory to reduce duplication,
 * plus specific guards for each canonical error type.
 */

import { SuiteError } from "../base";
import { NetSuiteApiError } from "../integration/netsuite-api.error";
import { NotFoundError } from "../domain/not-found.error";
import { SchemaValidationError } from "../domain/schema-validation.error";

/**
 * Generic factory for creating runtime type guards for error subclasses.
 *
 * @param ctor - The error class constructor.
 * @returns A type guard function that checks if a value is an instance of the given class.
 *
 * @example
 * const isSuiteError = makeErrorGuard(SuiteError);
 * if (isSuiteError(err)) {
 *   // err is narrowed to SuiteError
 * }
 */
function makeErrorGuard<T extends Error>(
  ctor: abstract new (...args: any[]) => T
): (err: unknown) => err is T {
  return (err: unknown): err is T => err instanceof ctor;
}

/** Runtime check for any SuiteTools-defined error. */
export const isSuiteError = makeErrorGuard(SuiteError);

/** Runtime check for NetSuiteApiError. */
export const isNetSuiteApiError = makeErrorGuard(NetSuiteApiError);

/** Runtime check for NotFoundError. */
export const isNotFoundError = makeErrorGuard(NotFoundError);

/** Runtime check for SchemaValidationError. */
export const isSchemaValidationError = makeErrorGuard(SchemaValidationError);
