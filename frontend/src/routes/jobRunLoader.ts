// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file jobRunLoader.ts
 * @description
 * Route data loader for the `/jobRun/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getJobRun } from '../adapters/api/jobRun';
import type { JobRun } from '@suiteworks/suitetools-shared';

/**
 * Loader for the `/jobRun/:id` route.
 * Awaits the record before returning so the page receives a concrete `JobRun`
 * (avoids Suspense/Await envelope confusion that previously asserted the wrong shape).
 * @param args - Loader arguments provided by the router.
 * @returns An object with a resolved `jobRun` record.
 */
export async function jobRunLoader(args: LoaderFunctionArgs): Promise<{ jobRun: JobRun }> {
  const id = Number(args.params.id);
  try {
    const jobRun = await getJobRun(id);
    return { jobRun };
  } catch (err) {
    console.error('router:getJobRun() failed', err);
    throw err;
  }
}

export type JobRunLoaderData = Awaited<ReturnType<typeof jobRunLoader>>;
