// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file scriptLogLoader.ts
 * @description
 * Route data loader for the `/scriptLog/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getScriptLog } from '../adapters/api/scriptLog';
import type { ScriptLog } from '@suiteworks/suitetools-shared';
import type { NotFound } from '../api/types';

/**
 * Loader for the `/scriptLog/:id` route.
 * @param args - Loader arguments provided by the router.
 * @param args.params - Object containing the route parameters.
 * @param args.params.id - The `id` segment from the route (as a string).
 * @returns An object with a `scriptLog` property containing a promise that resolves to a `ScriptLog | NotFound` record.
 */
export async function scriptLogLoader(args: LoaderFunctionArgs): Promise<{ scriptLog: Promise<ScriptLog | NotFound> }> {
  const { params } = args;
  return {
    scriptLog: getScriptLog(Number(params.id)).catch((err) => {
      console.error('router:getScriptLog() failed', err);
      throw err;
    }),
  };
}

export type ScriptLogLoaderData = Awaited<ReturnType<typeof scriptLogLoader>>;
