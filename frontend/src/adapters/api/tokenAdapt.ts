// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file Shared Token view-model helpers.
 */

import type { Token } from '@suiteworks/suitetools-shared';

/**
 * Enrich a validated Token with navigation URLs.
 * @param token - Validated token payload.
 * @returns Token with urlNs and urlDetail.
 */
export function adaptToken(token: Token): Token {
  return {
    ...token,
    urlNs: token.urlNs ?? `/app/setup/accesstoken.nl?id=${token.id}`,
    urlDetail: token.urlDetail ?? `#/token/${token.id}`,
  };
}
