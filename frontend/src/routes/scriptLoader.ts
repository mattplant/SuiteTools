// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file scriptLoader.ts
 * @description
 * Route data loader for the `/script/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getScript } from '../adapters/api/script';
import type { Script } from '@suiteworks/suitetools-shared';

/**
 * Loader for the `/script/:id` route.
 * Awaits the record before returning so the page receives a concrete `Script`.
 * @param args - Loader arguments provided by the router.
 * @returns An object with a resolved `script` record.
 */
export async function scriptLoader(args: LoaderFunctionArgs): Promise<{ script: Script }> {
  const id = Number(args.params.id);
  try {
    const script = await getScript(id);
    return { script };
  } catch (err) {
    console.error('router:getScript() failed', err);
    throw err;
  }
}

export type ScriptLoaderData = Awaited<ReturnType<typeof scriptLoader>>;
