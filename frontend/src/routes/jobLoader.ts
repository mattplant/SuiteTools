// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file jobLoader.ts
 * @description
 * Route data loader for the `/job/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getJob } from '../adapters/api/job';
import type { Job } from '@suiteworks/suitetools-shared';
import { NotFoundError } from '@suiteworks/suitetools-shared';
import { mapLoaderError } from './loaderUtils';

/**
 * Loader for the `/job/:id` route.
 * @param args - Loader arguments provided by the router.
 * @param args.params - Object containing the route parameters.
 * @param args.params.id - The `id` segment from the route (as a string).
 * @returns An object with a `job` property containing a promise that resolves to a `Job` record.
 */
export async function jobLoader(args: LoaderFunctionArgs): Promise<{ job: Promise<Job> }> {
  const { params } = args;
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    // e.g. `/job/undefined` when JobRun.jobId was missing (stale wire keys).
    throw new NotFoundError('Job', params.id ?? '');
  }
  return {
    job: getJob(id).catch((err) => mapLoaderError(err, 'Job')),
  };
}

export type JobLoaderData = Awaited<ReturnType<typeof jobLoader>>;
