import { z } from "zod";
import { zNetSuite } from "./zNetSuite";
import { zHelpers } from "./zodUtils";
import type { ZEntityBundleWithoutNormalize } from "./zodUtils";

/**
 * Zod schema for a single User record.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `isinactive`: boolean indicating if the user is inactive
 * - `email`: email address of the user
 * - `name`: full name of the user
 * - `supervisor`: optional supervisor name
 * - `title`: job title of the user
 * - `lastLogin`: optional timestamp of the last login
 * - `role_names`: optional string of role names
 * - `urlNs`: optional URL for NetSuite context
 * - `urlDetail`: optional URL for additional context
 */
const UserSchema = z.object({
  id: z.number().positive(),
  isinactive: zNetSuite.booleanFromTF.schema,
  email: z.string(),
  name: z.string(),
  supervisor: z.string().optional().nullable(),
  title: z.string(),
  // SUPPLEMENTAL PROPERTIES
  lastLogin: z.string().optional(),
  role_names: z.string().optional(),
  // ADDITIONAL PROPERTIES
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const UserBundle: ZEntityBundleWithoutNormalize<typeof UserSchema, "User"> =
  zHelpers.zCreateEntity(UserSchema, {
    meta: { entity: "User" },
  });

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { UserBundle };
export type User = typeof UserBundle.types.single;
export type Users = typeof UserBundle.types.array;
