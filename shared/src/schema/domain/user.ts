// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, OrNotFound } from "./utils/schemaHelpers";

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
const schema = z.object({
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

const UserBundle: ZEntityBundle<typeof schema, "User"> = zHelpers.zCreateBundle(
  schema,
  {
    meta: { entity: "User", plural: "Users" },
  }
);

// ───────────────────────────────────────────────────────────
// Public Exports
// ───────────────────────────────────────────────────────────

export { UserBundle };
export type User = typeof UserBundle.types.single;
export type Users = typeof UserBundle.types.array;

// Convenience union for single entity
export const userOrNotFoundSchema = orNotFoundSchema(schema);
export type UserOrNotFound = OrNotFound<User>;

// Convenience union for multiple entities
export const usersOrNotFoundSchema = orNotFoundSchema(
  UserBundle.schema.array()
);
export type UsersOrNotFound = OrNotFound<Users>;
