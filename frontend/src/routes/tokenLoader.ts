// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file tokenLoader.ts
 * @description Route data loader for the `/token/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { getToken } from "../adapters/api/token";
import { makeEntityLoader } from "./loaderUtils";

/** Loader for the `/token/:id` route. */
export const tokenLoader = makeEntityLoader("token", "Token", getToken);

export type TokenLoaderData = Awaited<ReturnType<typeof tokenLoader>>;
