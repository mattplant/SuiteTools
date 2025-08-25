// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";

/**
 * Shape returned when an entity is not found.
 * Keep this schema minimal and universal.
 */
export const notFoundSchema = z.object({
  message: z.string(),
  code: z.literal("NOT_FOUND").default("NOT_FOUND"),
});

export type NotFound = z.infer<typeof notFoundSchema>;

/**
 * Bundle form — consistent with other entities for imports like:
 * import { NotFoundBundle } from '@suiteworks/suitetools-shared';
 */
export const NotFoundBundle = {
  schema: notFoundSchema,
  name: "NotFound",
} as const;
