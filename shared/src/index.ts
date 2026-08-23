// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Root barrel for `@suiteworks/suitetools-shared`.
 *
 * @fileoverview
 * The `.` export in package.json and a rollup input, so this file is the package's public
 * surface: anything re-exported here is API that frontend and backend may rely on. Curation
 * happens in the sub-barrels — `domain`, `schema`, `typeGuards`, `errors`, `api` — each of
 * which owns what it exposes.
 *
 * @remarks
 * Pulls in the Zod runtime through `schema`, which is why backend code that only needs error
 * classes imports the `/errors` subpath instead. Adding an export here is a public API change.
 *
 * @see ./errors-entry.ts – the Zod-free subpath for backend scripts
 * @see ../rollup.config.js – the three inputs that define what ships
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

// -------------------- Domain primitives --------------------
export * from "./domain";

// -------------------- Schema layer --------------------
export * from "./schema";

// -------------------- Type guards --------------------
export * from "./typeGuards";

// -------------------- Errors --------------------
export * from "./errors";

// -------------------- API --------------------
export * from "./api";
