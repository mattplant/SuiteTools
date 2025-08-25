import { z } from "zod";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";

/**
 * Zod schema for a standard "Not Found" API payload.
 *
 * Fields:
 * - `message`: human‑readable description of the missing resource.
 * - `code` (optional): machine‑readable error or status code.
 */
const schema = z.object({
  message: z.string(),
  code: z.string().optional(),
});

/**
 * Entity bundle for "NotFound" payloads.
 * Exposes:
 * - `.schema` — the underlying Zod schema
 * - `.types.single` — the single payload TypeScript type
 * - `.types.array` — array form of the payload (rare for NotFound, but standardized)
 */
const NotFoundBundle: ZEntityBundle<typeof schema, "NotFound"> =
  zHelpers.zCreateBundle(schema, {
    meta: { entity: "NotFound", plural: "NotFounds" },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { NotFoundBundle };
export type NotFound = typeof NotFoundBundle.types.single;
export type NotFounds = typeof NotFoundBundle.types.array;
