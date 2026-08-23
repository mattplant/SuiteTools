// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Schema utilities shared by every domain schema.
 *
 * @fileoverview
 * Twelve domain schemas build on these three helpers: `MergeShapes` to compose Zod shapes,
 * `orNotFoundSchema` to union an entity with the not-found shape, and `toArray` to normalise
 * `T[] | NotFound` down to `T[]` at the call site.
 *
 * @remarks
 * `orNotFoundSchema` is what makes absence representable without every schema restating it, so
 * a change to the union shape here reaches all twelve. `toArray` collapses not-found to an
 * empty array — callers that must distinguish "none" from "absent" should narrow with
 * `isNotFound` before calling it.
 *
 * @see ../../../domain/notFound.ts – the shape being unioned in
 * @see ../../../typeGuards/isNotFound.guard.ts – narrowing back out
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
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
export type MergeShapes<A extends z.ZodRawShape, B extends z.ZodRawShape> = z.ZodObject<A & B>;

/* -------------------------------------------------------------------------- */
/* orNotFound                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Creates a union schema: `Entity | NotFound`
 *
 * The inferred type of the returned schema is automatically
 * `z.infer<TSchema> | NotFound`.
 */
export function orNotFoundSchema<TSchema extends z.ZodTypeAny>(entitySchema: TSchema) {
  return entitySchema.or(NotFoundBundle.schema) as z.ZodUnion<[TSchema, typeof NotFoundBundle.schema]> & {
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
