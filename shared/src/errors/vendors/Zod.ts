// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file Zod.ts
 * @description
 * Centralized re-exports of Zod runtime and type-only symbols.
 *
 * This indirection allows SuiteTools to:
 * - Use `ZodError` safely at runtime (e.g. instanceof checks in backend code)
 * - Import `ZodIssue` as a type-only symbol without pulling in runtime code
 * - Swap or alias Zod types in the future (see TODO below)
 *
 * @todo Replace `ZodIssue` import with:
 *   `export type { $ZodIssue as ZodIssue } from "@zod/core";`
 *   once upstream migration is complete.
 */

// Runtime: required for instanceof checks in backend or anywhere Zod is actually present
export { ZodError } from "zod";

// Type-only: safe to import anywhere (frontend, backend)
export type { ZodIssue } from "zod";
