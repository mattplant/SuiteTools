// SPDX-License-Identifier: GPL-3.0-or-later

import type { z } from "zod";
import { NotFoundBundle } from "../notFound";
import type { NotFound } from "../notFound";

/**
 * Creates a union schema: `Entity | NotFound`
 *
 * The inferred type of the returned schema is automatically
 * `z.infer<TSchema> | NotFound`.
 */
export function orNotFoundSchema<TSchema extends z.ZodTypeAny>(
  entitySchema: TSchema
) {
  return entitySchema.or(NotFoundBundle.schema) as z.ZodUnion<
    [TSchema, typeof NotFoundBundle.schema]
  > & {
    // Convenience type alias for the inferred output
    _output: z.infer<TSchema> | NotFound;
    _input: z.input<TSchema> | NotFound;
  };
}
/**
 * Generic union type: `Entity | NotFound`
 */
export type OrNotFound<TEntity> = TEntity | NotFound;
