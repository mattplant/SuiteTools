// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple JobRun entities for SuiteTools.
 * @description
 * Fetches and validates an array of JobRun records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * - Validates via shared `.schema`
 * - Accepts `CriteriaFields` for query parameters
 * - Always returns a `JobRuns` array (empty if none found)
 * - Minimal envelope; no paging/meta yet
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, jobRunsOrNotFoundSchema, isNotFound, toArray } from '@suiteworks/suitetools-shared';
import type { JobRuns } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { getData } from './netSuiteClient';

const jobRunsRequestResponseSchema = makeRequestResponseSchema(jobRunsOrNotFoundSchema);

/**
 * Fetch and validate a list of `JobRun` records using optional criteria.
 * Always returns a `JobRuns` array, empty if none found.
 * @param fields - Criteria to filter the job runs list (job, completed, etc.).
 * @returns A Promise resolving to a `JobRuns` array (empty if none found).
 * @throws {ZodError} When the response fails schema validation.
 * @throws {Error} When the underlying request fails (network, auth, etc.).
 */
export async function getJobRuns(fields: CriteriaFields): Promise<JobRuns> {
  console.log('[jobRuns:getJobRuns] criteria: %o', fields);

  const urlParams = {
    job: fields.job,
    completed: fields.completed,
  };

  const response = await getData('jobRuns', urlParams);
  const parsed = jobRunsRequestResponseSchema.parse(response);

  if (isNotFound(parsed.data)) return [];

  return toArray<JobRuns[number]>(parsed.data);
}
