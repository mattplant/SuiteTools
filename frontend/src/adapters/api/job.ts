// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving a single Job entity from SuiteTools.
 * @description
 * Fetches and validates a single Job record by ID, returning either a fully typed Job object or throwing NotFound.
 * Pattern: Schema → Adapter → View
 * - Always validate via shared bundle `.schema`
 * - Transform only on success; propagate `NotFound` via SuiteError
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, jobOrNotFoundSchema, PostEndpoint } from '@suiteworks/suitetools-shared';
import type { Job, RequestResponse } from '@suiteworks/suitetools-shared';
import { makeSingularAdapter } from './adapterUtils';
import { postData } from './netSuiteClient';

/**
 * Transform a validated `Job` payload into the enriched view model used by the frontend.
 * @param job - The validated Job payload to enrich.
 * @returns The enriched Job object with navigation URLs.
 */
function adaptJob(job: Job): Job {
  return {
    ...job,
    urlDetail: `#/job/${job.id}`,
  };
}

const jobRequestResponseSchema = makeRequestResponseSchema(jobOrNotFoundSchema);

/**
 * Fetch and validate a single `Job` record by ID.
 * - Uses shared schemas for runtime validation and type inference.
 * - Adds `urlDetail` to valid `Job` records.
 * @param id - The ID of the job to retrieve.
 * @returns A Promise resolving to a Job object.
 */
export const getJob = makeSingularAdapter<Job>('job', jobRequestResponseSchema, adaptJob);

type InitiateJobPayload = {
  id: number;
  data?: unknown;
};

/**
 * Initiate a SuiteTools job (or all jobs when id is 0).
 * @param payload - Job id and optional Map/Reduce input data.
 * @returns The API response envelope.
 */
export async function initiateJob(payload: InitiateJobPayload): Promise<RequestResponse> {
  console.log('[job:initiateJob] initiated', payload);
  return postData(PostEndpoint.INITIATEJOB, payload);
}
