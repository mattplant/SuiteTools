// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file roleLoader.ts
 * @description Route data loader for the `/roles/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { getRole } from "../adapters/api/role";
import { makeEntityLoader } from "./loaderUtils";

/** Loader for the `/roles/:id` route. */
export const roleLoader = makeEntityLoader("role", "Role", getRole);

export type RoleLoaderData = Awaited<ReturnType<typeof roleLoader>>;
