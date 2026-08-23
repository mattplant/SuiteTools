// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The canonical "not found" shape, as data rather than an exception.
 *
 * @fileoverview
 * A found-or-absent result crosses the wire as a value, so absence needs a shape the schema
 * layer can validate. `orNotFoundSchema` unions this with any entity schema, and `isNotFound`
 * narrows it back out on the frontend.
 *
 * @remarks
 * `code` is a literal, not a string: it is what discriminates the union, so widening it would
 * silently break every `isNotFound` narrowing. Distinct from `NotFoundError` — that is thrown,
 * this is returned.
 *
 * @see ../schema/domain/utils/schemaHelpers.ts – orNotFoundSchema and toArray
 * @see ../errors/domain/not-found.error.ts – the thrown counterpart
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { z } from "zod";

/**
 * Canonical "Not Found" domain primitive.
 * Minimal, universal shape for representing absence across SuiteTools.
 */
export const notFoundSchema = z.object({
  message: z.string(),
  code: z.literal("NOT_FOUND"), // always required, always literal
});

/**
 * Strongly typed NotFound object.
 */
export type NotFound = z.infer<typeof notFoundSchema>;

/**
 * Bundle form — consistent with other entities for imports like:
 * import { NotFoundBundle } from '@suiteworks/suitetools-shared';
 */
export const NotFoundBundle = { schema: notFoundSchema, name: "NotFound" } as const;
