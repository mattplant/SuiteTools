// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file Defines the base HTTP response schema and helpers for SuiteTools.
 * @description
 * Single source of truth for the minimal structure of an HTTP response in SuiteTools.
 * Part of the Schema → Adapter → View pipeline:
 * - Keeps Zod usage private to the schema workspace
 * - Exports a runtime schema for validation
 * - Exports a static type for compile‑time safety
 * - Provides a factory for building typed, validated response schemas for specific endpoints
 *
 * @remarks
 * Adapters should import only the exported `httpResponse` or use `makeHttpResponseSchema`
 * — never the internal `_zHttpResponse`.
 * See also: `schema/endpointTemplate.ts` for the narrowed‑envelope pattern.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { z } from "zod";

/**
 * Internal base HTTP response schema.
 * Not exported directly to avoid encouraging raw Zod coupling outside the schema workspace.
 */
const _zHttpResponse = z.object({
  /** Numeric status code returned from the API (e.g., 200, 404). */
  status: z.number().int().min(100).max(599),
});

/** Public runtime schema safe for adapters to extend or parse. */
export { _zHttpResponse as httpResponse };

/** Static TypeScript type inferred from the base HTTP response schema. */
export type HttpResponse = z.infer<typeof _zHttpResponse>;

/** Utility type to merge the base shape with endpoint‑specific shapes. */
type MergeShapes<
  A extends z.ZodRawShape,
  B extends z.ZodRawShape,
> = z.ZodObject<A & B>;

/**
 * Factory to create a new HTTP response schema with additional fields.
 *
 * @typeParam T - Additional Zod shape to merge with the base schema.
 * @param shape - Additional fields for the extended response.
 * @returns A Zod schema including both the base HTTP response fields and your additional fields.
 */
export function makeHttpResponseSchema<T extends z.ZodRawShape>(
  shape: T
): MergeShapes<typeof _zHttpResponse.shape, T> {
  return _zHttpResponse.extend(shape);
}
