// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple Job entities for SuiteTools.
 * @description
 * Fetches and validates an array of Job records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * - Validates via shared `.schema`
 * - Accepts `CriteriaFields` for query parameters
 * - Always returns a `Jobs` array (empty if none found)
 * - Minimal envelope; no paging/meta yet
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, jobsOrNotFoundSchema, isNotFound, toArray } from '@suiteworks/suitetools-shared';
import type { Jobs } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { getData } from './netSuiteClient';

const jobsRequestResponseSchema = makeRequestResponseSchema(jobsOrNotFoundSchema);

/**
 * Fetch and validate a list of `Job` records using optional criteria.
 * Always returns a `Jobs` array, empty if none found.
 * @param fields - Criteria to filter the jobs list (active, etc.).
 * @returns A Promise resolving to a `Jobs` array (empty if none found).
 * @throws {ZodError} When the response fails schema validation.
 * @throws {Error} When the underlying request fails (network, auth, etc.).
 */
export async function getJobs(fields: CriteriaFields): Promise<Jobs> {
  console.log('[jobs:getJobs] criteria: %o', fields);

  const urlParams = {
    active: fields.active,
  };

  const response = await getData('jobs', urlParams);
  const parsed = jobsRequestResponseSchema.parse(response);

  if (isNotFound(parsed.data)) return [];

  return toArray<Jobs[number]>(parsed.data);
}
