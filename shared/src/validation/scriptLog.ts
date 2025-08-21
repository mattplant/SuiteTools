import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import { zHelpers } from "./zodUtils";
import type { ZEntityBundle } from "./zodUtils";

/**
 * Zod schema for a single script log entry.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `timestamp`: ISO8601 string (validated via `Date.parse`)
 * - `type`: arbitrary string (consider swapping for an `enum`)
 * - `scripttype`: string category
 * - `owner`: name of the script owner
 * - `scriptname`: script identifier
 * - `title`: human-readable title
 * - `detail`: detailed message or payload
 * - `urlNs`, `urlDetail` (optional): additional context properties
 */
export const ScriptLogSchema = z.object({
  id: z.number(),
  timestamp: z.string().refine((s) => !Number.isNaN(Date.parse(s)), {
    message: "Invalid ISO timestamp",
  }),
  type: z.string(),
  scripttype: z.string(),
  owner: z.string(),
  scriptname: z.string(),
  title: z.string(),
  detail: z.string().optional().nullable(),
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const ScriptLogBundle: ZEntityBundle<typeof ScriptLogSchema, "ScriptLog"> =
  zHelpers.zCreateBundle(ScriptLogSchema, {
    meta: { entity: "ScriptLog", plural: "ScriptLogs" },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { ScriptLogBundle };
export type ScriptLog = typeof ScriptLogBundle.types.single;
export type ScriptLogs = typeof ScriptLogBundle.types.array;
