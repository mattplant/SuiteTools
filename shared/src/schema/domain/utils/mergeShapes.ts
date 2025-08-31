// SPDX-License-Identifier: GPL-3.0-or-later

import type { z } from "zod";

/**
 * Utility type to combine two Zod shapes into one.
 *
 * @example
 * const Extended = z.object({ foo: z.string() });
 * type ExtendedType = z.infer<MergeShapes<typeof base.shape, typeof Extended.shape>>;
 */
export type MergeShapes<
  A extends z.ZodRawShape,
  B extends z.ZodRawShape,
> = z.ZodObject<A & B>;
