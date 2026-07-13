// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file tokenLoader.ts
 * @description Route data loader for the `/token/:id` detail view.
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getToken } from '../adapters/api/token';
import type { Token } from '@suiteworks/suitetools-shared';

/**
 * Loader for the `/token/:id` route.
 * @param args - Loader arguments provided by the router.
 */
export async function tokenLoader(args: LoaderFunctionArgs): Promise<{ token: Token }> {
  const id = Number(args.params.id);
  const token = await getToken(id);
  return { token };
}

export type TokenLoaderData = Awaited<ReturnType<typeof tokenLoader>>;
