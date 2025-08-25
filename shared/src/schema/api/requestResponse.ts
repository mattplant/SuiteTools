// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file Defines the base request–response envelope schema for SuiteTools.
 * @description
 * Provides a single source of truth for the minimal structure of an API
 * request–response pair in SuiteTools. This file is part of the Schema → Adapter → View
 * pipeline and:
 * - Keeps Zod usage private to the schema workspace
 * - Exports a runtime schema for validation
 * - Exports a static type for compile‑time safety
 * - Serves as the base for endpoint‑specific request–response shapes
 *
 * @remarks
 * Adapters should import only the exported `requestResponse` or narrow it
 * with `.extend()` in endpoint schema files — never the internal `_zRequestResponse`.
 * See also: `schema/endpointTemplate.ts` for the narrowed‑envelope pattern.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { z } from "zod";

/**
 * Internal Zod schema for the base request–response envelope.
 * Not exported directly to avoid encouraging direct Zod coupling outside the schema workspace.
 * The `_` prefix signals "for internal composition only".
 */
const _zRequestResponse = z.object({
  /**
   * Numeric status code returned from the API (e.g., 200, 404).
   *
   * @remarks
   * Currently optional during migration; will be required once all endpoints conform.
   */
  status: z
    .number()
    .optional()
    .describe("TEMP: will be required after migration"),

  /** Arbitrary payload; refine in endpoint schemas for stronger type‑safety. */
  data: z.unknown(),

  /** Optional human‑readable message from the API (e.g., error description). */
  message: z.string().optional(),
});

/**
 * Runtime schema for the base request–response envelope.
 * @remarks For generic handling in transport layers — not for typed endpoints.
 */
export { _zRequestResponse as requestResponse };

/**
 * Static TypeScript type inferred from the base request–response schema.
 *
 * @example
 * ```ts
 * function logMessage(res: RequestResponse) {
 *   if (res.message) console.log(res.message);
 * }
 * ```
 */
export type RequestResponse = z.infer<typeof _zRequestResponse>;

export type Envelope<Payload> = {
  status?: number;
  message?: string;
  data: Payload;
};

/**
 * Creates a schema for the standard API response envelope around a payload schema.
 * Fully generic: preserves payload type so `.parse()` is type-safe.
 */
/**
 * Factory to create a new request–response schema with additional fields.
 *
 * @typeParam T - Additional Zod shape to merge with the base schema.
 * @param shape - Additional fields for the extended envelope.
 * @returns A Zod schema that includes the base request–response fields and your additional fields.
 */
export function makeRequestResponseSchema<S extends z.ZodTypeAny>(
  payloadSchema: S
) {
  return z.object({
    status: z.number().optional(),
    message: z.string().optional(),
    data: payloadSchema,
  }) as unknown as z.ZodType<
    Envelope<z.infer<S>>,
    // omit Def — let Zod supply it internally
    Envelope<z.input<S>>
  >;
}
