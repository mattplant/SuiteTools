// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple JobRun entities for SuiteTools.
 * @description
 * Fetches and validates an array of JobRun records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, jobRunsOrNotFoundSchema } from "@suiteworks/suitetools-shared";
import type { JobRuns } from "@suiteworks/suitetools-shared";
import type { CriteriaFields } from "../../components/shared/criteria/types";
import { makeListAdapter } from "./adapterUtils";

const jobRunsRequestResponseSchema = makeRequestResponseSchema(jobRunsOrNotFoundSchema);

/**
 * Fetch and validate a list of `JobRun` records using optional criteria.
 * Always returns a `JobRuns` array, empty if none found.
 */
export const getJobRuns = makeListAdapter<JobRuns[number], CriteriaFields, "job" | "completed">(
  "jobRuns",
  jobRunsRequestResponseSchema,
  ["job", "completed"] as const,
);
