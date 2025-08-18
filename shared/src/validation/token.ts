import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import { zHelpers } from "./zodUtils";
import type { ZEntityBundleWithoutNormalize } from "./zodUtils";

/**
 * Zod schema for a single Token record.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `name`: name of the job
 * - `isinactive`: boolean indicating if the job is inactive
 * - `config`: JSON string configuration for the job
 * - `description`: description of the job
 * - `scheduled`: boolean indicating if the job is scheduled
 * - `notify`: boolean indicating if notifications are enabled
 * - `lastRun`: optional timestamp of the last run
 * - `urlDetail`: optional URL for additional context
 */
const TokenSchema = z.object({
  id: z.number().positive(),
  name: z.string(),
  userName: z.string(),
  roleName: z.string(),
  integrationName: z.string(),

  state: z.string(), // TODO: change to boolean
  // state: zNetSuite.booleanFromTF.schema,

  dateCreated: z.string(), // ISO date string?
  createdBy: z.string(),
  lastLogin: z.string().optional(), // ISO date string?
  // additional properties
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const TokenBundle: ZEntityBundleWithoutNormalize<typeof TokenSchema, "Token"> =
  zHelpers.zCreateEntity(TokenSchema, {
    meta: { entity: "Token" },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { TokenBundle };
export type Token = typeof TokenBundle.types.single;
export type Tokens = typeof TokenBundle.types.array;
