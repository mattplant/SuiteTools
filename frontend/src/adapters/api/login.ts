// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter helpers for a single Login Audit row (from list results).
 * Login Audit has no stable RESTlet singular endpoint; the modal reads from the loaded list.
 */

import { LoginBundle } from '@suiteworks/suitetools-shared';
import type { Login, NotFound } from '@suiteworks/suitetools-shared';

/**
 * Resolve a login row by synthetic list id from already-loaded results.
 * @param id - Synthetic id assigned by the backend cleaner (1-based row index).
 * @param lines - Current login list rows.
 */
export async function getLoginFromResults(id: number, lines?: readonly unknown[]): Promise<Login | NotFound> {
  if (!lines) {
    return { message: 'No login records found', code: 'NOT_FOUND' };
  }

  LoginBundle.assertMany(lines);
  const record = lines.find((line) => line.id === id);
  return record ?? { message: `Login record with id ${id} not found`, code: 'NOT_FOUND' };
}
