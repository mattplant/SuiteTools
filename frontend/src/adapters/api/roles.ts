// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple Role entities for SuiteTools.
 * @description
 * Fetches and validates an array of Role records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, rolesOrNotFoundSchema } from '@suiteworks/suitetools-shared';
import type { Roles } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { makeListAdapter } from './adapterUtils';

const rolesRequestResponseSchema = makeRequestResponseSchema(rolesOrNotFoundSchema);

/**
 * Fetch and validate a list of `Role` records using optional criteria.
 * Always returns a `Roles` array, empty if none found.
 */
export const getRoles = makeListAdapter<Roles[number], CriteriaFields, 'active'>(
  'roles',
  rolesRequestResponseSchema,
  ['active'] as const,
);
