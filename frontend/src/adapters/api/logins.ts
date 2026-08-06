// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving Login Audit records.
 */

import { makeRequestResponseSchema, loginsOrNotFoundSchema } from '@suiteworks/suitetools-shared';
import type { Logins } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { makeListAdapter } from './adapterUtils';

const loginsRequestResponseSchema = makeRequestResponseSchema(loginsOrNotFoundSchema);

/**
 * Join multi-select criteria into a comma-separated query param, omitting empties.
 * @param values - Multi-select field values.
 */
function multiSelectParam(values: string[] | string | undefined): string | undefined {
  if (values == null) {
    return undefined;
  }
  const list = (Array.isArray(values) ? values : [values]).filter((value) => value !== '' && value != null);
  return list.length > 0 ? list.join(',') : undefined;
}

/**
 * Build RESTlet query params from picked login criteria.
 * @param fields - Picked login list criteria.
 */
function toLoginUrlParams(fields: Partial<CriteriaFields>): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  if (fields.rows != null) {
    params.rows = String(fields.rows);
  }
  if (fields.active) {
    params.active = fields.active;
  }
  if (fields.integrationName) {
    params.integrationName = fields.integrationName;
  }
  if (fields.tokenName) {
    params.tokenName = fields.tokenName;
  }
  const users = multiSelectParam(fields.users);
  if (users) {
    params.users = users;
  }
  const roles = multiSelectParam(fields.roles);
  if (roles) {
    params.roles = roles;
  }
  return params;
}

/**
 * Fetch and validate a list of `Login` records using optional criteria.
 * Always returns a `Logins` array, empty if none found.
 */
export const getLogins = makeListAdapter<
  Logins[number],
  CriteriaFields,
  'rows' | 'active' | 'integrationName' | 'tokenName' | 'users' | 'roles'
>(
  'logins',
  loginsRequestResponseSchema,
  ['rows', 'active', 'integrationName', 'tokenName', 'users', 'roles'] as const,
  { mapParams: toLoginUrlParams },
);
