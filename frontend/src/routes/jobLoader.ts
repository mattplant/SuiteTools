// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file jobLoader.ts
 * @description Route data loader for the `/job/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { getJob } from '../adapters/api/job';
import { makeEntityLoader } from './loaderUtils';

/**
 * Loader for the `/job/:id` route (deferred for Suspense/`Await`).
 * Rejects non-finite / ≤0 ids before fetch (e.g. `/job/undefined` from stale wire keys).
 */
export const jobLoader = makeEntityLoader('job', 'Job', getJob, {
  requirePositiveId: true,
});

export type JobLoaderData = Awaited<ReturnType<typeof jobLoader>>;
