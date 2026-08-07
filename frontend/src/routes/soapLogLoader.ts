// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file soapLogLoader.ts
 * @description Route data loader for the `/soapLog/:id` detail view.
 */

import { getSoapLog } from '../adapters/api/soapLog';
import { makeEntityLoader } from './loaderUtils';

/** Loader for the `/soapLog/:id` route (awaits record before return). */
export const soapLogLoader = makeEntityLoader('soapLog', 'SOAP log', getSoapLog, {
  awaitResult: true,
});

export type SoapLogLoaderData = Awaited<ReturnType<typeof soapLogLoader>>;
