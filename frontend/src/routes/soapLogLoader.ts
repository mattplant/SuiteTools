// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file soapLogLoader.ts
 * @description Route data loader for the `/soapLog/:id` detail view.
 */

import type { LoaderFunctionArgs } from 'react-router-dom';
import { getSoapLog } from '../adapters/api/soapLog';
import type { SoapLog } from '@suiteworks/suitetools-shared';
import { mapLoaderError } from './loaderUtils';

/**
 * Loader for the `/soapLog/:id` route.
 * @param args - Loader arguments provided by the router.
 */
export async function soapLogLoader(args: LoaderFunctionArgs): Promise<{ soapLog: SoapLog }> {
  const id = Number(args.params.id);

  try {
    const soapLog = await getSoapLog(id);
    return { soapLog };
  } catch (err) {
    mapLoaderError(err, 'SOAP log');
  }
}

export type SoapLogLoaderData = Awaited<ReturnType<typeof soapLogLoader>>;
