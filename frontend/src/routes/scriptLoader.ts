// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file scriptLoader.ts
 * @description Route data loader for the `/script/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { getScript } from "../adapters/api/script";
import { makeEntityLoader } from "./loaderUtils";

/** Loader for the `/script/:id` route. */
export const scriptLoader = makeEntityLoader("script", "Script", getScript);

export type ScriptLoaderData = Awaited<ReturnType<typeof scriptLoader>>;
