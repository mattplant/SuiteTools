import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import { zHelpers } from "./zodUtils";
import type { ZEntityBundle } from "./zodUtils";

/**
 * Zod schema for a single Script record.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `apiversion`: API version of the script
 * - `isinactive`: boolean indicating if the script is inactive
 * - `scripttype`: type of the script
 * - `name`: name of the script
 * - `scriptid`: unique identifier for the script
 * - `owner`: owner of the script
 * - `scriptfile`: file associated with the script
 * - `notifyemails`: emails to notify
 * - `description`: description of the script
 * - `urlNs`: optional URL for NetSuite context
 * - `urlDetail`: optional URL for additional context
 * - `urlScriptLogs`: optional URL for script logs
 */
const ScriptSchema = z.object({
  id: z.number().positive(),
  apiversion: z.string(),
  isinactive: zNetSuite.booleanFromTF.schema,
  scripttype: z.string(),
  name: z.string(),
  scriptid: z.string(),
  owner: z.string(),
  scriptfile: z.string(),
  notifyemails: zNetSuite.stringOrEmpty.schema,
  description: zNetSuite.stringOrEmpty.schema,
  // additional properties
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
  urlScriptLogs: z.string().optional(),
});

const ScriptBundle: ZEntityBundle<typeof ScriptSchema, "Script"> =
  zHelpers.zCreateBundle(ScriptSchema, {
    // normalize: (d) => ({ ...d, id: Number(d.id) }),
    meta: { entity: "Script", plural: "Scripts" },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { ScriptBundle };
export type Script = typeof ScriptBundle.types.single;
export type Scripts = typeof ScriptBundle.types.array;
