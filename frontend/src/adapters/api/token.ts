// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Adapter for a single TBA access token.
 *
 * @fileoverview
 * A `makeSingularAdapter` configuration, plus `addTokenLastLogin`, which merges the last-login
 * timestamp out of the settings payload onto a token row.
 *
 * @remarks
 * The enrichment is a separate step rather than part of the adapt function because the
 * timestamp lives in settings, not on the token record — the caller must already hold settings
 * to apply it. Matching is by token name, so a renamed token loses its last-login until the
 * settings payload catches up.
 *
 * @see ./tokens.ts – the list form, including the plural enrichment
 * @see ./settings.ts – where the lastLogins payload comes from
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, tokenOrNotFoundSchema } from "@suiteworks/suitetools-shared";
import type { Settings, Token } from "@suiteworks/suitetools-shared";
import { makeSingularAdapter } from "./adapterUtils";
import { adaptToken } from "./tokenAdapt";

const tokenRequestResponseSchema = makeRequestResponseSchema(tokenOrNotFoundSchema);

/**
 * Fetch and validate a single `Token` record by ID.
 * @param id - Token internal id.
 */
export const getToken = makeSingularAdapter<Token>("token", tokenRequestResponseSchema, adaptToken);

/**
 * Merge last-login timestamp from settings into a token row.
 * @param record - Token row to enrich.
 * @param settings - SuiteTools settings.
 */
export function addTokenLastLogin(record: Token, settings: Settings | undefined): Token {
  if (settings?.lastLogins?.data && Array.isArray(settings.lastLogins.data) && settings.lastLogins.data.length > 0) {
    const lastLogins = settings.lastLogins.data.filter((entry) => entry.name.type === "token");
    const lastLogin = lastLogins.find((entry) => entry.name.name === record.name);
    if (lastLogin) {
      record.lastLogin = lastLogin.lastLogin;
    }
  }

  return record;
}
