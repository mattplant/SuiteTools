// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Entry point for the `/contracts` subpath — type-only, zero runtime.
 *
 * @fileoverview
 * Backing the `@suiteworks/suitetools-shared/contracts` subpath export, and a rollup input.
 * Carries interfaces and types that cross the wire, so a consumer can type a response without
 * linking any runtime code at all.
 *
 * @remarks
 * Currently exposes only `errors/contracts` (`ErrorResponse`), and has no importers yet — it is
 * a declared part of the package surface rather than dead code, and removing it would be a
 * breaking change to package.json exports. Keep it type-only: a runtime export here defeats
 * the point of the subpath.
 *
 * @see ./errors-entry.ts – error classes, when the runtime is wanted
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

// Error contracts (ErrorResponse interface)
export * from "./errors/contracts";

// Add other contract types here as needed
// export * from "./api/contracts";
// export * from "./domain/contracts";
