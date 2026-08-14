// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file soapLogLoader.ts
 * @description Route data loader for the `/soapLog/:id` detail view.
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { getSoapLog } from "../adapters/api/soapLog";
import { makeEntityLoader } from "./loaderUtils";

/** Loader for the `/soapLog/:id` route. */
export const soapLogLoader = makeEntityLoader("soapLog", "SOAP log", getSoapLog);

export type SoapLogLoaderData = Awaited<ReturnType<typeof soapLogLoader>>;
