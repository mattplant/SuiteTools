// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple Role entities for SuiteTools.
 * @description
 * Fetches and validates an array of Role records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * - Validates via shared `.schema`
 * - Accepts `CriteriaFields` for query parameters
 * - Always returns a `Roles` array (empty if none found)
 * - Minimal envelope; no paging/meta yet
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, rolesOrNotFoundSchema, isNotFound, toArray } from '@suiteworks/suitetools-shared';
import type { Roles } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { getData } from './netSuiteClient';

const rolesRequestResponseSchema = makeRequestResponseSchema(rolesOrNotFoundSchema);

/**
 * Fetch and validate a list of `Role` records using optional criteria.
 * Always returns a `Roles` array, empty if none found.
 * @param fields - Criteria to filter the roles list (active, owners, etc.).
 * @returns A Promise resolving to a `Roles` array (empty if none found).
 * @throws {ZodError} When the response fails schema validation.
 * @throws {Error} When the underlying request fails (network, auth, etc.).
 */
export async function getRoles(fields: CriteriaFields): Promise<Roles> {
  console.log('[roles:getRoles] criteria: %o', fields);

  const urlParams = {
    active: fields.active,
  };

  const response = await getData('roles', urlParams);
  const parsed = rolesRequestResponseSchema.parse(response);

  if (isNotFound(parsed.data)) return [];

  return toArray<Roles[number]>(parsed.data);
}
