import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import type { ZodBundle } from "./zodUtils";

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
export const BaseScriptLog = z.object({
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

/**
 * Currently no transformations are applied to the ScriptLog schema.
 */
const CleanedScriptLog = BaseScriptLog.transform((data) => {
  return data;
});

export type ScriptLog = z.infer<typeof CleanedScriptLog>;
export type ScriptLogs = ScriptLog[];

/**
 * Bundled schema + helpers for ScriptLog
 */
export const ScriptLog: ZodBundle<ScriptLog> =
  zNetSuite.createBundle(CleanedScriptLog);
