// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Entry point for the `/errors` subpath — error classes with no Zod runtime.
 *
 * @fileoverview
 * Backing the `@suiteworks/suitetools-shared/errors` subpath export, and a rollup input in its
 * own right. Exists so NetSuite scripts can throw and catch SuiteTools errors without pulling
 * the schema layer into a FileCabinet bundle. Five backend modules import through it.
 *
 * @remarks
 * Deliberately omits `errors/utils` and `errors/vendors`: those reach the Zod runtime and the
 * error factories, which is exactly the weight this entry exists to avoid. Re-exporting them
 * here would silently inflate every backend bundle.
 *
 * @see ./index.ts – the full surface, Zod included
 * @see ./errors/base – SuiteError, the root of the hierarchy
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

// Base error class
export * from "./errors/base";

// Error contracts (ErrorResponse interface)
export * from "./errors/contracts";

// Domain errors (NotFoundError, SchemaValidationError)
export * from "./errors/domain";

// Integration errors
export * from "./errors/integration";

// NOTE: Excludes errors/utils and errors/vendors to avoid pulling in:
// - Zod runtime (ZodError)
// - Error factories and handlers
// Backend code should only import specific error classes it needs
