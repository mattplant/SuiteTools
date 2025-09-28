// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file Schema/domain utilities for SuiteTools.
 * @description
 * Shared helpers for schema/domain logic:
 * - MergeShapes: combine Zod shapes
 * - orNotFoundSchema / OrNotFound: union schema with NotFound
 * - toArray: normalize `T[] | NotFound` into `T[]`
 */

import type { z } from "zod";
import { NotFoundBundle } from "../../../domain/notFound";
import type { NotFound } from "../../../domain/notFound";
import { isNotFound } from "../../../typeGuards/isNotFound.guard";

/* -------------------------------------------------------------------------- */
/* MergeShapes                                                                */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* orNotFound                                                                 */
/* -------------------------------------------------------------------------- */

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
    _output: z.infer<TSchema> | NotFound;
    _input: z.input<TSchema> | NotFound;
  };
}

/**
 * Generic union type: `Entity | NotFound`
 */
export type OrNotFound<TEntity> = TEntity | NotFound;

/* -------------------------------------------------------------------------- */
/* toArray                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Converts a `T[] | NotFound` result into a plain `T[]`.
 * Always returns an array, empty if `NotFound`.
 */
export function toArray<T>(res: readonly T[] | NotFound): T[] {
  return isNotFound(res) ? [] : [...res];
}
