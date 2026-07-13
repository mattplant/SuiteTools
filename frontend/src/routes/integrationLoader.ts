// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file integrationLoader.ts
 * @description
 * Route data loader for the `/integration/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getIntegrationEnriched, readStashedIntegrationDetail } from '../adapters/api/integration';
import type { Integration } from '@suiteworks/suitetools-shared';

/**
 * Loader for the `/integration/:id` route.
 * Awaits the record before returning so the page receives a concrete Integration.
 * @param args - Loader arguments provided by the router.
 * @returns An object with a resolved `integration` record.
 */
export async function integrationLoader(args: LoaderFunctionArgs): Promise<{ integration: Integration | null }> {
  const id = Number(args.params.id);

  const stashed = readStashedIntegrationDetail(id);
  if (stashed) {
    return { integration: stashed };
  }

  try {
    const integration = await getIntegrationEnriched(id);
    return { integration };
  } catch (err) {
    console.error('router:getIntegration() failed', err);
    return { integration: null };
  }
}

export type IntegrationLoaderData = Awaited<ReturnType<typeof integrationLoader>>;
