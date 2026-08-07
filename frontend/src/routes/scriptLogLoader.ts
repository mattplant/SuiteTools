// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file scriptLogLoader.ts
 * @description Route data loader for the `/scriptLog/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { getScriptLog } from '../adapters/api/scriptLog';
import { makeEntityLoader } from './loaderUtils';

/** Loader for the `/scriptLog/:id` route. */
export const scriptLogLoader = makeEntityLoader('scriptLog', 'Script log', getScriptLog);

export type ScriptLogLoaderData = Awaited<ReturnType<typeof scriptLogLoader>>;
