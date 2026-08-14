// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, OrNotFound } from "./utils/schemaHelpers";

/**
 * Zod schema for a single script log entry.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `timestamp`: ISO8601 string (validated via `Date.parse`)
 * - `type`: log level / type (empty when SuiteQL returns null)
 * - `scriptType`: script category (empty when SuiteQL returns null)
 * - `owner`: script owner display string
 * - `scriptName`: script display name
 * - `title`: human-readable title
 * - `detail`: detailed message or payload
 * - `urlNs`, `urlDetail` (optional): additional context properties
 */
export const schema = z.object({
  id: z.number(),
  timestamp: z.string().refine((s) => !Number.isNaN(Date.parse(s)), { message: "Invalid ISO timestamp" }),
  type: zNetSuite.stringOrEmpty.schema,
  scriptType: zNetSuite.stringOrEmpty.schema,
  owner: zNetSuite.stringOrEmpty.schema,
  scriptName: zNetSuite.stringOrEmpty.schema,
  title: zNetSuite.stringOrEmpty.schema,
  detail: z.string().optional().nullable(),
  // ADDITIONAL PROPERTIES
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const ScriptLogBundle: ZEntityBundle<typeof schema, "ScriptLog"> = zHelpers.zCreateBundle(schema, {
  meta: { entity: "ScriptLog", plural: "ScriptLogs" },
});

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { ScriptLogBundle };
export type ScriptLog = typeof ScriptLogBundle.types.single;
export type ScriptLogs = typeof ScriptLogBundle.types.array;

// Convenience union for single entity
export const scriptLogOrNotFoundSchema = orNotFoundSchema(schema);
export type ScriptLogOrNotFound = OrNotFound<ScriptLog>;

// Convenience union for multiple entities
export const scriptLogsOrNotFoundSchema = orNotFoundSchema(ScriptLogBundle.schema.array());
export type ScriptLogsOrNotFound = OrNotFound<ScriptLogs>;
