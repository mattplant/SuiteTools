// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file contracts-entry.ts
 * @description
 * Entry point for type-only contracts and interfaces.
 * Provides pure TypeScript types without runtime dependencies.
 *
 * This entry point is used via the subpath export:
 * `@suiteworks/suitetools-shared/contracts`
 */

// Error contracts (ErrorResponse interface)
export * from "./errors/contracts";

// Add other contract types here as needed
// export * from "./api/contracts";
// export * from "./domain/contracts";
