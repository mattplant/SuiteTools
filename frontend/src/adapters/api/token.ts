// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving a single TBA access token.
 */

import { makeRequestResponseSchema, tokenOrNotFoundSchema } from '@suiteworks/suitetools-shared';
import type { Settings, Token } from '@suiteworks/suitetools-shared';
import { makeSingularAdapter } from './adapterUtils';
import { adaptToken } from './tokenAdapt';

const tokenRequestResponseSchema = makeRequestResponseSchema(tokenOrNotFoundSchema);

/**
 * Fetch and validate a single `Token` record by ID.
 * @param id - Token internal id.
 */
export const getToken = makeSingularAdapter<Token>('token', tokenRequestResponseSchema, adaptToken);

/**
 * Merge last-login timestamp from settings into a token row.
 * @param record - Token row to enrich.
 * @param settings - SuiteTools settings.
 */
export function addTokenLastLogin(record: Token, settings: Settings | undefined): Token {
  if (
    settings?.lastLogins?.data &&
    Array.isArray(settings.lastLogins.data) &&
    settings.lastLogins.data.length > 0
  ) {
    const lastLogins = settings.lastLogins.data.filter((entry) => entry.name.type === 'token');
    const lastLogin = lastLogins.find((entry) => entry.name.name === record.name);
    if (lastLogin) {
      record.lastLogin = lastLogin.lastLogin;
    }
  }

  return record;
}
