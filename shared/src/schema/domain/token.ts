// SPDX-License-Identifier: GPL-3.0-or-later

import { z } from "zod";
import { zNetSuite } from "../zNetSuite";
import { zHelpers } from "../zodUtils";
import type { ZEntityBundle } from "../zodUtils";
import { orNotFoundSchema, OrNotFound } from "./utils/schemaHelpers";

/**
 * Zod schema for a single Token-Based Authentication (TBA) access token.
 *
 * Fields:
 * - `id`: unique numeric identifier
 * - `name`: token name
 * - `userName`: entity the token was issued for
 * - `roleName`: role associated with the token
 * - `integrationName`: integration application name
 * - `state`: revoked flag as Yes/No (legacy UI shape)
 * - `dateCreated`: creation timestamp
 * - `createdBy`: employee who created the token
 * - `lastLogin`: optional last-login timestamp from settings job
 * - `urlNs` / `urlDetail`: optional navigation URLs
 */
const TokenSchema = z.object({
  id: zNetSuite.numberFromString.schema,
  name: zNetSuite.stringOrEmpty.schema,
  userName: zNetSuite.stringOrEmpty.schema,
  roleName: zNetSuite.stringOrEmpty.schema,
  integrationName: zNetSuite.stringOrEmpty.schema,
  state: zNetSuite.stringOrEmpty.schema,
  dateCreated: zNetSuite.stringOrEmpty.schema,
  createdBy: zNetSuite.stringOrEmpty.schema,
  lastLogin: z.string().optional(),
  urlNs: z.string().optional(),
  urlDetail: z.string().optional(),
});

const TokenBundle: ZEntityBundle<typeof TokenSchema, "Token"> =
  zHelpers.zCreateBundle(TokenSchema, {
    meta: { entity: "Token", plural: "Tokens" },
  });

export { TokenBundle };
export type Token = typeof TokenBundle.types.single;
export type Tokens = typeof TokenBundle.types.array;

export const tokenOrNotFoundSchema = orNotFoundSchema(TokenSchema);
export type TokenOrNotFound = OrNotFound<Token>;

export const tokensOrNotFoundSchema = orNotFoundSchema(
  TokenBundle.schema.array()
);
export type TokensOrNotFound = OrNotFound<Tokens>;
