// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving Login Audit records.
 */

import {
  makeRequestResponseSchema,
  loginsOrNotFoundSchema,
  isNotFound,
  toArray,
} from '@suiteworks/suitetools-shared';
import type { Logins } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { getData } from './netSuiteClient';

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
 * Build RESTlet query params, omitting empty / undefined values.
 * @param fields - Login list criteria.
 */
function toLoginUrlParams(fields: CriteriaFields): Record<string, string> {
  const params: Record<string, string> = {};
  if (fields.rows) {
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
 * @param fields - Criteria to filter the login audit list.
 */
export async function getLogins(fields: CriteriaFields): Promise<Logins> {
  console.log('[logins:getLogins] criteria: %o', fields);

  const response = await getData('logins', toLoginUrlParams(fields));
  const parsed = loginsRequestResponseSchema.parse(response);

  if (isNotFound(parsed.data)) {
    return [];
  }

  return toArray<Logins[number]>(parsed.data);
}
