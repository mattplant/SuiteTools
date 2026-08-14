// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, OrNotFound } from "./utils/schemaHelpers";

/**
 * Zod schema for a single Login Audit entry.
 *
 * Multi-word SuiteQL fields use camelCase wire keys. Nullable string columns
 * use `stringOrEmpty` so list endpoints tolerate SuiteQL `null`.
 */
export const LoginSchema = z.object({
  id: zNetSuite.numberFromString.schema,
  date: zNetSuite.stringOrEmpty.schema,
  status: zNetSuite.stringOrEmpty.schema,
  oauthAppName: zNetSuite.stringOrEmpty.schema,
  oauthAccessTokenName: zNetSuite.stringOrEmpty.schema,
  user: z
    .preprocess((val) => {
      if (val === null || val === undefined || val === "") return null;
      return typeof val === "string" ? Number(val) : val;
    }, z.number().nullable())
    .optional(),
  userName: zNetSuite.stringOrEmpty.schema,
  role: z
    .preprocess((val) => {
      if (val === null || val === undefined || val === "") return null;
      return typeof val === "string" ? Number(val) : val;
    }, z.number().nullable())
    .optional(),
  roleName: zNetSuite.stringOrEmpty.schema,
  emailAddress: zNetSuite.stringOrEmpty.schema,
  ipAddress: zNetSuite.stringOrEmpty.schema,
  requestUri: zNetSuite.stringOrEmpty.schema,
  detail: z.string().optional().nullable(),
  secChallenge: zNetSuite.stringOrEmpty.schema,
  userAgent: zNetSuite.stringOrEmpty.schema,
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const LoginBundle: ZEntityBundle<typeof LoginSchema, "Login"> = zHelpers.zCreateBundle(LoginSchema, {
  meta: { entity: "Login", plural: "Logins" },
});

export { LoginBundle };
export type Login = typeof LoginBundle.types.single;
export type Logins = typeof LoginBundle.types.array;

export const loginOrNotFoundSchema = orNotFoundSchema(LoginSchema);
export type LoginOrNotFound = OrNotFound<Login>;

export const loginsOrNotFoundSchema = orNotFoundSchema(LoginBundle.schema.array());
export type LoginsOrNotFound = OrNotFound<Logins>;
