// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file tokenLoader.ts
 * @description Route data loader for the `/token/:id` detail view.
 */

import { getToken } from '../adapters/api/token';
import { makeEntityLoader } from './loaderUtils';

/** Loader for the `/token/:id` route (awaits record before return). */
export const tokenLoader = makeEntityLoader('token', 'Token', getToken, {
  awaitResult: true,
});

export type TokenLoaderData = Awaited<ReturnType<typeof tokenLoader>>;
