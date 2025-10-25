// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file errors-entry.ts
 * @description
 * Lightweight entry point for error classes only.
 * Excludes Zod runtime dependencies and utility functions
 * to minimize bundle size for backend NetSuite scripts.
 *
 * This entry point is used via the subpath export:
 * `@suiteworks/suitetools-shared/errors`
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
