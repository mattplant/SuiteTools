// SPDX-License-Identifier: GPL-3.0-or-later

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
export const NotFoundBundle = {
  schema: notFoundSchema,
  name: "NotFound",
} as const;
