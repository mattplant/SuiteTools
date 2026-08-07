// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file userLoader.ts
 * @description Route data loader for the `/users/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { getUser } from '../adapters/api/user';
import { makeEntityLoader } from './loaderUtils';

/** Loader for the `/users/:id` route (deferred for Suspense/`Await`). */
export const userLoader = makeEntityLoader('user', 'User', getUser);

export type UserLoaderData = Awaited<ReturnType<typeof userLoader>>;
