// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file scriptLogLoader.ts
 * @description
 * Route data loader for the `/scriptLog/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getScriptLog } from '../adapters/api/scriptLog';
import type { ScriptLog } from '@suiteworks/suitetools-shared';
import { mapLoaderError } from './loaderUtils';

/**
 * Loader for the `/scriptLog/:id` route.
 * @param args - Loader arguments provided by the router.
 * @param args.params - Object containing the route parameters.
 * @param args.params.id - The `id` segment from the route (as a string).
 * @returns An object with a `scriptLog` property containing a promise that resolves to a `ScriptLog`.
 */
export async function scriptLogLoader(args: LoaderFunctionArgs): Promise<{ scriptLog: Promise<ScriptLog> }> {
  const { params } = args;
  return {
    scriptLog: getScriptLog(Number(params.id)).catch((err) => mapLoaderError(err, 'Script log')),
  };
}

export type ScriptLogLoaderData = Awaited<ReturnType<typeof scriptLogLoader>>;
