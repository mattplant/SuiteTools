// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file fileLoader.ts
 * @description
 * Route data loader for the `/file/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getFile } from '../adapters/api/file';
import type { File } from '@suiteworks/suitetools-shared';
import { mapLoaderError } from './loaderUtils';

/**
 * Loader for the `/file/:id` route.
 * @param args - Loader arguments provided by the router.
 * @param args.params - Object containing the route parameters.
 * @param args.params.id - The `id` segment from the route (as a string).
 * @returns An object with a `file` property containing a promise that resolves to a `File` record.
 */
export async function fileLoader(args: LoaderFunctionArgs): Promise<{ file: Promise<File> }> {
  const { params } = args;
  return {
    file: getFile(Number(params.id)).catch((err) => mapLoaderError(err, 'File')),
  };
}

export type FileLoaderData = Awaited<ReturnType<typeof fileLoader>>;
