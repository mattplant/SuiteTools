// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file userLoader.ts
 * @description
 * Route data loader for the `/users/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getUser } from '../adapters/api/user';
import type { User } from '@suiteworks/suitetools-shared';
import { mapLoaderError } from './loaderUtils';

/**
 * Loader for the `/users/:id` route.
 * @param args - Loader arguments provided by the router.
 * @param args.params - Object containing the route parameters.
 * @param args.params.id - The `id` segment from the route (as a string).
 * @returns An object with a `user` property containing a promise that resolves to a `User`.
 */
export async function userLoader(args: LoaderFunctionArgs): Promise<{ user: Promise<User> }> {
  const { params } = args;
  return {
    user: getUser(Number(params.id)).catch((err) => mapLoaderError(err, 'User')),
  };
}

export type UserLoaderData = Awaited<ReturnType<typeof userLoader>>;
