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
import type { BaseSchema } from "../domain/baseSchema";

/**
 * Internal Zod schema for the base request–response envelope.
 * Not exported directly to avoid encouraging direct Zod coupling outside the schema workspace.
 * The `_` prefix signals "for internal composition only".
 */
const _zRequestResponse = z.object({
  /** Numeric status code returned from the API (e.g., 200, 404). */
  status: z.number().int().min(100).max(599),

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
 * Wrap a payload Zod schema in an API envelope and expose a BaseSchema<T> so consumers remain Zod‑free.
 * - Returns only the typed envelope fields (status?, message?, data)
 * - Omits optional keys when undefined to satisfy exactOptionalPropertyTypes
 * @typeParam S - The Zod schema type for the payload.
 * @param payloadSchema - The Zod schema describing the payload.
 * @returns A BaseSchema<T> with a `.parse()` method that validates the envelope.
 */
export function makeRequestResponseSchema<S extends z.ZodTypeAny>(
  payloadSchema: S
): BaseSchema<z.output<S>> {
  const envelope = z.object({
    status: z.number().optional(),
    message: z.string().optional(),
    data: payloadSchema,
  });

  return {
    parse: (input: unknown) => {
      // Parse with Zod, then project into the exact BaseSchema shape.
      // Single, contained cast to stabilize the inferred object type.
      const r = envelope.parse(input) as {
        status?: number;
        message?: string;
        data: z.output<S>;
      };

      const out: {
        data: z.output<S>;
        status?: number;
        message?: string;
      } = { data: r.data };

      if (r.status !== undefined) out.status = r.status;
      if (r.message !== undefined) out.message = r.message;

      return out;
    },
  };
}
