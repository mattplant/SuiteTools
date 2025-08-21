import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import { zHelpers } from "./zodUtils";
import type { ZEntityBundle } from "./zodUtils";

/**
 * Zod schema for a single Role record.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `isinactive`: boolean indicating if the role is inactive
 * - `name`: name of the role
 * - `centertype`: type of center associated with the role
 * - `issalesrole`: boolean indicating if the role is a sales role
 * - `issupportrole`: boolean indicating if the role is a support role
 * - `iswebserviceonlyrole`: boolean indicating if the role is web service only
 * - `urlNs`: optional URL for NetSuite context
 * - `urlDetail`: optional URL for additional context
 */
const RoleSchema = z.object({
  id: z.number().positive(),
  isinactive: zNetSuite.booleanFromTF.schema,
  name: z.string(),
  centertype: z.string(),
  issalesrole: zNetSuite.booleanFromTF.schema,
  issupportrole: zNetSuite.booleanFromTF.schema,
  iswebserviceonlyrole: zNetSuite.booleanFromTF.schema,
  // additional properties
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const RoleBundle: ZEntityBundle<typeof RoleSchema, "Role"> =
  zHelpers.zCreateBundle(RoleSchema, {
    meta: { entity: "Role", plural: "Roles" },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { RoleBundle };
export type Role = typeof RoleBundle.types.single;
export type Roles = typeof RoleBundle.types.array;
