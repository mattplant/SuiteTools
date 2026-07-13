// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, OrNotFound } from "./utils/schemaHelpers";

/**
 * Zod schema for a single Login Audit entry.
 */
export const LoginSchema = z.object({
  id: zNetSuite.numberFromString.schema,
  date: zNetSuite.stringOrEmpty.schema,
  status: zNetSuite.stringOrEmpty.schema,
  oauthappname: z.string().optional().nullable(),
  oauthaccesstokenname: z.string().optional().nullable(),
  user: z
    .preprocess((val) => {
      if (val === null || val === undefined || val === "") return null;
      return typeof val === "string" ? Number(val) : val;
    }, z.number().nullable())
    .optional(),
  username: z.string().optional().nullable(),
  role: z
    .preprocess((val) => {
      if (val === null || val === undefined || val === "") return null;
      return typeof val === "string" ? Number(val) : val;
    }, z.number().nullable())
    .optional(),
  rolename: z.string().optional().nullable(),
  emailaddress: z.string().optional().nullable(),
  ipaddress: zNetSuite.stringOrEmpty.schema,
  requesturi: zNetSuite.stringOrEmpty.schema,
  detail: z.string().optional().nullable(),
  secchallenge: z.string().optional().nullable(),
  useragent: z.string().optional().nullable(),
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const LoginBundle: ZEntityBundle<typeof LoginSchema, "Login"> =
  zHelpers.zCreateBundle(LoginSchema, {
    meta: { entity: "Login", plural: "Logins" },
  });

export { LoginBundle };
export type Login = typeof LoginBundle.types.single;
export type Logins = typeof LoginBundle.types.array;

export const loginOrNotFoundSchema = orNotFoundSchema(LoginSchema);
export type LoginOrNotFound = OrNotFound<Login>;

export const loginsOrNotFoundSchema = orNotFoundSchema(
  LoginBundle.schema.array()
);
export type LoginsOrNotFound = OrNotFound<Logins>;
