// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file integrationLoader.ts
 * @description
 * Route data loader for the `/integration/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { LoaderFunctionArgs } from "react-router-dom";
import { getIntegrationEnriched, readStashedIntegrationDetail } from "../adapters/api/integration";
import type { Integration } from "@suiteworks/suitetools-shared";
import { mapLoaderError } from "./loaderUtils";

/**
 * Loader for the `/integration/:id` route.
 * Awaits the record before returning so the page receives a concrete Integration.
 * @param args - Loader arguments provided by the router.
 * @returns An object with a resolved `integration` record.
 */
export async function integrationLoader(args: LoaderFunctionArgs): Promise<{ integration: Integration }> {
  const id = Number(args.params.id);

  const stashed = readStashedIntegrationDetail(id);
  if (stashed) {
    return { integration: stashed };
  }

  try {
    const integration = await getIntegrationEnriched(id);
    return { integration };
  } catch (err) {
    mapLoaderError(err, "Integration");
  }
}

export type IntegrationLoaderData = Awaited<ReturnType<typeof integrationLoader>>;
