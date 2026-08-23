// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Adapter for the TBA access tokens list.
 *
 * @fileoverview
 * A `makeListAdapter` configuration that then filters further in the browser. Only `active` is
 * forwarded to the API; integration, user and role filters are applied to the returned rows
 * here.
 *
 * @remarks
 * That split is the thing to preserve: the endpoint understands `active` and nothing else, so
 * moving a filter server-side means changing the backend, and adding one client-side means it
 * runs after paging. Integration matching goes through `integrationLookupKey` because the
 * names are not byte-identical across sources.
 *
 * @see ./adapterUtils.ts – the list-adapter contract and pickCriteria whitelist
 * @see ./integrationsScrape.ts – the lookup key used for integration matching
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, tokensOrNotFoundSchema } from "@suiteworks/suitetools-shared";
import type { Settings, Tokens } from "@suiteworks/suitetools-shared";
import type { CriteriaFields } from "../../components/shared/criteria/types";
import { makeListAdapter } from "./adapterUtils";
import { adaptToken } from "./tokenAdapt";
import { integrationLookupKey } from "./integrationsScrape";

export { adaptToken } from "./tokenAdapt";

const tokensRequestResponseSchema = makeRequestResponseSchema(tokensOrNotFoundSchema);

const fetchTokensBase = makeListAdapter<Tokens[number], CriteriaFields, "active">(
  "tokens",
  tokensRequestResponseSchema,
  ["active"] as const,
  { adaptItem: adaptToken },
);

/**
 * Fetch and validate a list of `Token` records using optional criteria.
 * Active/revoked is filtered server-side; name filters are applied client-side.
 * @param fields - Optional filters (active, integration, user, role).
 */
export async function getTokens(fields: CriteriaFields): Promise<Tokens> {
  let rows = await fetchTokensBase(fields);

  if (fields.integrationName) {
    const key = integrationLookupKey(fields.integrationName);
    rows = rows.filter((row) => integrationLookupKey(row.integrationName) === key);
  }
  if (fields.userName) {
    rows = rows.filter((row) => row.userName === fields.userName);
  }
  if (fields.roleName) {
    rows = rows.filter((row) => row.roleName === fields.roleName);
  }

  return rows;
}

/**
 * Merge last-login timestamps from settings into token rows.
 * @param tokens - Token rows to enrich.
 * @param settings - SuiteTools settings.
 */
export function addTokenLastLogins(tokens: Tokens, settings: Settings | undefined): Tokens {
  if (settings?.lastLogins?.data && Array.isArray(settings.lastLogins.data) && settings.lastLogins.data.length > 0) {
    const lastLogins = settings.lastLogins.data.filter((entry) => entry.name.type === "token");

    tokens.forEach((token) => {
      const lastLogin = lastLogins.find((entry) => entry.name.name === token.name);
      if (lastLogin) {
        token.lastLogin = lastLogin.lastLogin;
      }
    });
  }

  return tokens;
}
