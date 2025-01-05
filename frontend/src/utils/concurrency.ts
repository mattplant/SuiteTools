/**
 * SuiteTools Concurrency Library
 *
 * This library provides functions to support concurrency in SuiteTools.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * Copyright (C) 2024  Matthew Plant
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { getDataFromPageContent } from './collectData';
import {
  Column,
  ConcurrencySummaryData,
  ConcurrencySummaryDataConcurrency,
  ConcurrencySummaryDataViolations,
} from '../components/concurrency/types';

/**
 * Get NetSuite concurrency summary data core.
 *
 * @param accountId - the NetSuite account ID
 * @param dateRange - the number of days to get the summary for
 * @returns the concurrency summary data
 */
export async function getConcurrencySummaryData(accountId: string, dateRange: string): Promise<ConcurrencySummaryData> {
  console.log('getConcurrencySummaryData() initiated', { accountId, dateRange });

  // get concurrency summary from NetSuite's APM service
  const concurrencySummaryUrl = getConcurrencySummaryUrl(accountId, dateRange);
  const currencyResponse = await getDataFromPageContent(concurrencySummaryUrl);
  const concurrency = currencyResponse.data as ConcurrencySummaryDataConcurrency;

  // get violations data from NetSuite's APM service
  const concurrencyViolationsUrl = getConcurrencyViolationsUrl(accountId, dateRange);
  const violationsResponse = await getDataFromPageContent(concurrencyViolationsUrl);
  const violations = violationsResponse.data as ConcurrencySummaryDataViolations;

  return { concurrency, violations };
}

/**
 * Build the relative URL to get the concurrency summary.
 *
 * @param accountId - the NetSuite account ID
 * @param days - the number of days to get the summary for
 * @returns url - the url to get the concurrency summary
 */
function getConcurrencySummaryUrl(accountId: string, days: string): string {
  // console.log('getConcurrencySummaryUrl() initiated with ' + JSON.stringify({ accountId: accountId, days: days }));
  // example URL: /app/site/hosting/scriptlet.nl?script=customscript_nsapm_cm_sl_concurrency_v2&deploy=customdeploy_nsapm_cm_sl_concurrency_v2&compfil=(REDACTED)&testmode=F&startDateMS=1683512580000&endDateMS=1683771780000&integId=&offsetMins=420
  const path = '/app/site/hosting/scriptlet.nl';
  // set end date to tonight at 12:00 AM
  const endDate = new Date(Date.now());
  endDate.setDate(endDate.getDate() + 1);
  endDate.setHours(0, 0, 0, 0);
  const endDateMS = Number(endDate);
  // set start date to end date minus x days
  const startDateMS = endDateMS - Number(days) * 86400000;
  const params = [];
  params.push('script=customscript_nsapm_cm_sl_concurrency_v2'); // script (note cm instead of cd)
  params.push('deploy=customdeploy_nsapm_cm_sl_concurrency_v2'); // deploy (note cm instead of cd)
  params.push('compfil=' + accountId); // account ID
  params.push('testmode=F'); // test mode
  params.push('startDateMS=' + startDateMS); // start date
  params.push('endDateMS=' + endDateMS); // end date
  params.push('integId='); // integration ID
  params.push('offsetMins=420'); // 7 (420/60) hour time offset for PST
  const url = path + '?' + params.join('&');
  console.log('getConcurrencySummaryUrl() returning ' + url);

  return url;
}

/**
 * Build the relative URL to get the violations data.
 *
 * @param accountId - the NetSuite account ID
 * @param days - the number of days to get the data for
 * @returns url - the url to get the violation data
 */
function getConcurrencyViolationsUrl(accountId: string, days: string): string {
  // console.log('getConcurrencyViolationsUrl() initiated with ' + JSON.stringify({ accountId: accountId, days: days }));
  // example URL: /app/site/hosting/scriptlet.nl?script=customscript_nsapm_cm_sl_violations_v2&deploy=customdeploy_nsapm_cm_sl_violations_v2&testmode=F&startDateMS=1686034800000&endDateMS=1686380400000&compfil=(REDACTED)&integId=&allocatedList=
  const path = '/app/site/hosting/scriptlet.nl';
  // set end date to tonight at 12:00 AM
  const endDate = new Date(Date.now());
  endDate.setDate(endDate.getDate() + 1);
  endDate.setHours(0, 0, 0, 0);
  const endDateMS = Number(endDate);
  // set start date to end date minus x + 1 days
  const startDateMS = endDateMS - (Number(days) + 1) * 86400000;
  const params = [];
  params.push('script=customscript_nsapm_cm_sl_violations_v2'); // script (note cm instead of cd)
  params.push('deploy=customdeploy_nsapm_cm_sl_violations_v2'); // deploy (note cm instead of cd)
  params.push('compfil=' + accountId); // account ID
  params.push('testmode=F'); // test mode
  params.push('startDateMS=' + startDateMS); // start date
  params.push('endDateMS=' + endDateMS); // end date
  params.push('integId='); // integration ID
  params.push('allocatedList'); // 7 (420/60) hour time offset for PST
  const url = path + '?' + params.join('&');
  console.log('getConcurrencyViolationsUrl() returning ' + url);

  return url;
}

export function initializeConcurrencyColumns(hours: number[]): Column[] {
  const columns: Column[] = [];
  // add initial top left cell
  columns.push({ name: '', key: 'date', width: 92 });
  // add hours
  for (let i = 0; i < 24; i++) {
    const hour = new Date(hours[i]);
    const col = {
      name: hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      key: String(i),
      width: 38,
    };
    columns.push(col);
  }

  return columns;
}
