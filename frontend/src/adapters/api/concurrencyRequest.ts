// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for concurrency request rows (APM scrape).
 */

import { getConcurrencyRequestData } from '../../utils/concurrency';
import type {
  ConcurrencyRequestData,
  CriteriaFields,
} from '../../components/features/concurrency/request/types';

/**
 * Fetch concurrency request rows for a date range.
 * @param fields - Start/end dates.
 * @param accountId - NetSuite account id from settings.
 */
export async function getConcurrencyRequest(
  fields: CriteriaFields,
  accountId: string,
): Promise<ConcurrencyRequestData> {
  console.log('[concurrency:getConcurrencyRequest] criteria: %o', { fields, accountId });

  if (typeof window !== 'undefined' && window.location.href.includes('localhost')) {
    return [
      {
        startDate: 1748941035512,
        type: 'RESTLET',
        integrationId: 12345,
        operation: 'RESTLET',
        endDate: 1748941035984,
        scriptId: 123,
        integration: 'integration1',
        scriptName: 'My test integration',
        status: 'FINISHED',
        wouldBeRejected: false,
      },
    ] as ConcurrencyRequestData;
  }

  if (!accountId || !fields.startDate || !fields.endDate) {
    throw new Error('getConcurrencyRequest() requires accountId, startDate, and endDate');
  }

  return getConcurrencyRequestData(accountId, fields.startDate, fields.endDate);
}
