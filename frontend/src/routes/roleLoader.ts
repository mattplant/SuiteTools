// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file roleLoader.ts
 * @description
 * Route data loader for the `/roles/:id` detail view.
 * Fetches a single Role record by ID and returns it to the router.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getRole } from '../adapters/api/role';
import type { RoleOrNotFound } from '@suiteworks/suitetools-shared';
import { mapLoaderError } from './loaderUtils';

/**
 * Loader for the `/roles/:id` route.
 * @param args - Loader arguments provided by the router.
 * @param args.params - Object containing the route parameters.
 * @param args.params.id - The `id` segment from the route (as a string).
 * @returns An object with a `role` property containing a promise that resolves to a `RoleOrNotFound` record.
 */
export async function roleLoader(args: LoaderFunctionArgs): Promise<{ role: Promise<RoleOrNotFound> }> {
  const { params } = args;
  const id = Number(params.id);

  return {
    role: getRole(id).catch((err) => mapLoaderError(err, 'Role')),
  };
}

export type RoleLoaderData = Awaited<ReturnType<typeof roleLoader>>;
