// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file fileLoader.ts
 * @description Route data loader for the `/file/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { getFile } from '../adapters/api/file';
import { makeEntityLoader } from './loaderUtils';

/** Loader for the `/file/:id` route. */
export const fileLoader = makeEntityLoader('file', 'File', getFile);

export type FileLoaderData = Awaited<ReturnType<typeof fileLoader>>;
