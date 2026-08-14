// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file jobRunLoader.ts
 * @description Route data loader for the `/jobRun/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { getJobRun } from "../adapters/api/jobRun";
import { makeEntityLoader } from "./loaderUtils";

/** Loader for the `/jobRun/:id` route. */
export const jobRunLoader = makeEntityLoader("jobRun", "Job run", getJobRun);

export type JobRunLoaderData = Awaited<ReturnType<typeof jobRunLoader>>;
