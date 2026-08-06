// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, OrNotFound } from "./utils/schemaHelpers";

/**
 * Zod schema for a single Script record.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `apiVersion`: API version of the script
 * - `isInactive`: boolean indicating if the script is inactive
 * - `scriptType`: type of the script
 * - `name`: name of the script
 * - `scriptId`: unique identifier for the script
 * - `owner`: owner of the script
 * - `scriptFile`: file associated with the script
 * - `notifyEmails`: emails to notify
 * - `description`: description of the script
 * - `urlNs`: optional URL for NetSuite context
 * - `urlDetail`: optional URL for additional context
 * - `urlScriptLogs`: optional URL for script logs
 */
const ScriptSchema = z.object({
  id: zNetSuite.numberFromString.schema,
  apiVersion: zNetSuite.stringOrEmpty.schema,
  isInactive: zNetSuite.booleanFromTF.schema,
  scriptType: zNetSuite.stringOrEmpty.schema,
  name: zNetSuite.stringOrEmpty.schema,
  scriptId: zNetSuite.stringOrEmpty.schema,
  owner: zNetSuite.stringOrEmpty.schema,
  scriptFile: zNetSuite.stringOrEmpty.schema,
  notifyEmails: zNetSuite.stringOrEmpty.schema,
  description: zNetSuite.stringOrEmpty.schema,
  // additional properties
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
  urlScriptLogs: z.string().optional(),
});

const ScriptBundle: ZEntityBundle<typeof ScriptSchema, "Script"> =
  zHelpers.zCreateBundle(ScriptSchema, {
    meta: { entity: "Script", plural: "Scripts" },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { ScriptBundle };
export type Script = typeof ScriptBundle.types.single;
export type Scripts = typeof ScriptBundle.types.array;

// Convenience union for single entity
export const scriptOrNotFoundSchema = orNotFoundSchema(ScriptSchema);
export type ScriptOrNotFound = OrNotFound<Script>;

// Convenience union for multiple entities
export const scriptsOrNotFoundSchema = orNotFoundSchema(
  ScriptBundle.schema.array()
);
export type ScriptsOrNotFound = OrNotFound<Scripts>;
