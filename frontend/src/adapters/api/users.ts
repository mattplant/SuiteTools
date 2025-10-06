// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple User entities for SuiteTools.
 * @description
 * Fetches and validates an array of User records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * - Validates via shared `.schema`
 * - Accepts `CriteriaFields` for query parameters
 * - Always returns a `Users` array (empty if none found)
 * - Minimal envelope; no paging/meta yet
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, usersOrNotFoundSchema, isNotFound, toArray } from '@suiteworks/suitetools-shared';
import type { Users } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { getData } from './netSuiteClient';

const usersRequestResponseSchema = makeRequestResponseSchema(usersOrNotFoundSchema);

/**
 * Fetch and validate a list of `User` records using optional criteria.
 * Always returns a `Users` array, empty if none found.
 * @param fields - Criteria to filter the users list (active, roles, owners, etc.).
 * @returns A Promise resolving to a `Users` array (empty if none found).
 * @throws {ZodError} When the response fails schema validation.
 * @throws {Error} When the underlying request fails (network, auth, etc.).
 */
export async function getUsers(fields: CriteriaFields): Promise<Users> {
  console.log('[users:getUsers] criteria: %o', fields);

  const urlParams = {
    active: fields.active,
    roles: fields.roles,
    owners: fields.owners,
  };

  const response = await getData('users', urlParams);
  const parsed = usersRequestResponseSchema.parse(response);

  if (isNotFound(parsed.data)) return [];

  return toArray<Users[number]>(parsed.data);
}
