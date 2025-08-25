// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file userLoader.ts
 * @description
 * Route data loader for the `/users/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getUser } from '../adapters/api/user';
import type { UserOrNotFound } from '@suiteworks/suitetools-shared';

/**
 * Loader for the `/users/:id` route.
 * @param args - Loader arguments provided by the router.
 * @param args.params - Object containing the route parameters.
 * @param args.params.id - The `id` segment from the route (as a string).
 * @returns An object with a `user` property containing a promise that resolves to a `UserOrNotFound` record.
 */
export async function userLoader(args: LoaderFunctionArgs): Promise<{ user: Promise<UserOrNotFound> }> {
  const { params } = args;
  return {
    user: getUser(Number(params.id)).catch((err) => {
      console.error('router:getUser() failed', err);
      throw err;
    }),
  };
}

export type UserLoaderData = Awaited<ReturnType<typeof userLoader>>;
