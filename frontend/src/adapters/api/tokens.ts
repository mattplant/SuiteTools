// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving TBA access tokens.
 */

import {
  makeRequestResponseSchema,
  tokensOrNotFoundSchema,
  isNotFound,
  toArray,
} from '@suiteworks/suitetools-shared';
import type { Settings, Tokens } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { getData } from './netSuiteClient';
import { adaptToken } from './tokenAdapt';
import { integrationLookupKey } from './integrationsScrape';

export { adaptToken } from './tokenAdapt';

const tokensRequestResponseSchema = makeRequestResponseSchema(tokensOrNotFoundSchema);

/**
 * Build RESTlet query params, omitting empty / undefined values.
 * URLSearchParams stringifies `undefined` as `"undefined"`, which breaks SuiteQL filters.
 * @param fields - Token list criteria.
 */
function toTokenUrlParams(fields: CriteriaFields): Record<string, string> {
  const params: Record<string, string> = {};
  if (fields.active) {
    params.active = fields.active;
  }
  return params;
}

/**
 * Fetch and validate a list of `Token` records using optional criteria.
 * Active/revoked is filtered server-side; name filters are applied client-side.
 * @param fields - Optional filters (active, integration, user, role).
 */
export async function getTokens(fields: CriteriaFields): Promise<Tokens> {
  console.log('[tokens:getTokens] criteria: %o', fields);

  const response = await getData('tokens', toTokenUrlParams(fields));
  const parsed = tokensRequestResponseSchema.parse(response);

  if (isNotFound(parsed.data)) {
    return [];
  }

  let rows = toArray<Tokens[number]>(parsed.data).map(adaptToken);

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
  if (
    settings?.lastLogins?.data &&
    Array.isArray(settings.lastLogins.data) &&
    settings.lastLogins.data.length > 0
  ) {
    const lastLogins = settings.lastLogins.data.filter((entry) => entry.name.type === 'token');

    tokens.forEach((token) => {
      const lastLogin = lastLogins.find((entry) => entry.name.name === token.name);
      if (lastLogin) {
        token.lastLogin = lastLogin.lastLogin;
      }
    });
  }

  return tokens;
}
