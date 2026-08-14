// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving a single JobRun entity from SuiteTools.
 * @description
 * Fetches and validates a single JobRun record by ID, returning either a fully typed JobRun object or throwing NotFound.
 * Pattern: Schema → Adapter → View
 * - Always validate via shared bundle `.schema`
 * - Transform only on success; propagate `NotFound` via SuiteError
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, jobRunOrNotFoundSchema } from "@suiteworks/suitetools-shared";
import type { JobRun } from "@suiteworks/suitetools-shared";
import { makeSingularAdapter } from "./adapterUtils";

/**
 * Transform a validated `JobRun` payload into the enriched view model used by the frontend.
 * @param jobRun - The validated JobRun payload to enrich.
 * @returns The enriched JobRun object with navigation URLs.
 */
function adaptJobRun(jobRun: JobRun): JobRun {
  return { ...jobRun, urlDetail: `#/jobRun/${jobRun.id}`, urlJob: `#/job/${jobRun.jobId}` };
}

const jobRunRequestResponseSchema = makeRequestResponseSchema(jobRunOrNotFoundSchema);

/**
 * Fetch and validate a single `JobRun` record by ID.
 * - Uses shared schemas for runtime validation and type inference.
 * - Adds `urlDetail` and `urlJob` to valid `JobRun` records.
 * @param id - The ID of the job run to retrieve.
 * @returns A Promise resolving to a JobRun object.
 */
export const getJobRun = makeSingularAdapter<JobRun>("jobRun", jobRunRequestResponseSchema, adaptJobRun);
