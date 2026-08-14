// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple Job entities for SuiteTools.
 * @description
 * Fetches and validates an array of Job records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, jobsOrNotFoundSchema } from "@suiteworks/suitetools-shared";
import type { Jobs } from "@suiteworks/suitetools-shared";
import type { CriteriaFields } from "../../components/shared/criteria/types";
import { makeListAdapter } from "./adapterUtils";

const jobsRequestResponseSchema = makeRequestResponseSchema(jobsOrNotFoundSchema);

/**
 * Fetch and validate a list of `Job` records using optional criteria.
 * Always returns a `Jobs` array, empty if none found.
 */
export const getJobs = makeListAdapter<Jobs[number], CriteriaFields, "active">("jobs", jobsRequestResponseSchema, [
  "active",
] as const);
