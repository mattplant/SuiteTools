// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Adapter for a single Job record, plus job initiation.
 *
 * @fileoverview
 * `getJob` is a thin `makeSingularAdapter` configuration. `initiateJob` is the part worth
 * knowing about: it POSTs a payload that asks the backend to start a Map/Reduce run, so this
 * module both reads and triggers work.
 *
 * @remarks
 * `initiateJob` returns the raw `RequestResponse` rather than an adapted entity — the caller
 * needs the status to decide what to show, and there is no Job record to adapt yet. A
 * successful response means the job was queued, not that it finished.
 *
 * @see ./adapterUtils.ts – the singular-adapter contract
 * @see ./jobRun.ts – the record produced once a run completes
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, jobOrNotFoundSchema, PostEndpoint } from "@suiteworks/suitetools-shared";
import type { Job, RequestResponse } from "@suiteworks/suitetools-shared";
import { makeSingularAdapter } from "./adapterUtils";
import { postData } from "./netSuiteClient";

/**
 * Transform a validated `Job` payload into the enriched view model used by the frontend.
 * @param job - The validated Job payload to enrich.
 * @returns The enriched Job object with navigation URLs.
 */
function adaptJob(job: Job): Job {
  return { ...job, urlDetail: `#/job/${job.id}` };
}

const jobRequestResponseSchema = makeRequestResponseSchema(jobOrNotFoundSchema);

/**
 * Fetch and validate a single `Job` record by ID.
 * - Uses shared schemas for runtime validation and type inference.
 * - Adds `urlDetail` to valid `Job` records.
 * @param id - The ID of the job to retrieve.
 * @returns A Promise resolving to a Job object.
 */
export const getJob = makeSingularAdapter<Job>("job", jobRequestResponseSchema, adaptJob);

type InitiateJobPayload = { id: number; data?: unknown };

/**
 * Initiate a SuiteTools job (or all jobs when id is 0).
 * @param payload - Job id and optional Map/Reduce input data.
 * @returns The API response envelope.
 */
export async function initiateJob(payload: InitiateJobPayload): Promise<RequestResponse> {
  return postData(PostEndpoint.INITIATEJOB, payload);
}
