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
import { Column } from '../components/concurrency/types';
import {
  ConcurrencySummaryData,
  ConcurrencySummaryDataConcurrency,
  ConcurrencySummaryDataViolations,
} from '../components/concurrency/summary/types';
import {
  ConcurrencyDetailData,
  ConcurrencyDetailDataConcurrency,
  ConcurrencyDetailDataViolations,
} from '../components/concurrency/detail/types';
import { ConcurrencyRequestData } from '../components/concurrency/request/types';
// import { ConcurrencyRequestLogsData } from '../components/concurrency/requestLogs/types';
// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------

/**
 * Get NetSuite concurrency summary data.
 *
 * @param accountId - the NetSuite account ID
 * @param dateRange - the number of days to get the summary for
 * @returns the concurrency summary data
 */
export async function getConcurrencySummaryData(
  accountId: string,
  startDate: Date,
  endDate: Date,
): Promise<ConcurrencySummaryData> {
  console.log('getConcurrencySummaryData() initiated', { accountId, startDate, endDate });

  // set start date to start of day (today at 12:00 AM)
  startDate.setHours(0, 0, 0, 0);
  // set end date to end of day (tomorrow at 12:00 AM)
  endDate.setDate(endDate.getDate() + 1);
  endDate.setHours(0, 0, 0, 0);

  // get concurrency summary from NetSuite's APM service
  const concurrencyUrl = getConcurrencySummaryUrl(accountId, startDate, endDate);
  const currencyResponse = await getDataFromPageContent(concurrencyUrl);
  let concurrency = currencyResponse.data as ConcurrencySummaryDataConcurrency;
  concurrency = addConcurrencySummaryAverage(concurrency);

  // get violations data from NetSuite's APM service
  const violationsUrl = getConcurrencySummaryViolationsUrl(accountId, startDate, endDate);
  const violationsResponse = await getDataFromPageContent(violationsUrl);
  const violations = violationsResponse.data as ConcurrencySummaryDataViolations;

  return { concurrency, violations };
}

/**
 * Add concurrency average data.
 *
 * @param accountId - NetSuite account ID
 * @param startDate - detail data start date
 * @param endDate - detail data end date
 * @returns concurrency detail data
 */
export function addConcurrencySummaryAverage(
  currencyResponse: ConcurrencySummaryDataConcurrency,
): ConcurrencySummaryDataConcurrency {
  const peaks = currencyResponse.results || [];

  // since the peaks data is listed chronologically, we can get the hours by just modding the index
  const hourTotals: number[] = new Array(24).fill(0);
  for (let i = 0; i < peaks.length; i++) {
    // hourTotals[i % 24] = (hourTotals[i % 24] || 0) + (peaks[i].peakConcurrency || 0);
    hourTotals[i % 24] += peaks[i].peakConcurrency;
  }
  const daysTotal = peaks.length / 24;
  currencyResponse.hourAverages = hourTotals.map((total) => (daysTotal ? total / daysTotal : 0));
  console.log('addConcurrencySummaryAverage() returning', { currencyResponse });

  return currencyResponse;
}

/**
 * Build the relative URL to get the concurrency summary.
 *
 * @param accountId - the NetSuite account ID
 * @param days - the number of days to get the summary for
 * @returns url - the url to get the concurrency summary
 */
function getConcurrencySummaryUrl(accountId: string, startDate: Date, endDate: Date): string {
  // console.log('getConcurrencySummaryUrl() initiated with ' + JSON.stringify({ accountId: accountId, days: days }));
  // example URL: /app/site/hosting/scriptlet.nl?script=customscript_nsapm_cm_sl_concurrency_v2&deploy=customdeploy_nsapm_cm_sl_concurrency_v2&compfil=(REDACTED)&testmode=F&startDateMS=1683512580000&endDateMS=1683771780000&integId=&offsetMins=420
  const path = '/app/site/hosting/scriptlet.nl';
  const params = [];
  params.push('script=customscript_nsapm_cm_sl_concurrency_v2'); // script (note cm instead of cd)
  params.push('deploy=customdeploy_nsapm_cm_sl_concurrency_v2'); // deploy (note cm instead of cd)
  params.push('compfil=' + accountId); // account ID
  params.push('testmode=F'); // test mode
  params.push('startDateMS=' + Number(startDate)); // start date
  params.push('endDateMS=' + Number(endDate)); // end date
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
function getConcurrencySummaryViolationsUrl(accountId: string, startDate: Date, endDate: Date): string {
  // console.log('getConcurrencyViolationsUrl() initiated with ' + JSON.stringify({ accountId: accountId, days: days }));
  // example URL: /app/site/hosting/scriptlet.nl?script=customscript_nsapm_cm_sl_violations_v2&deploy=customdeploy_nsapm_cm_sl_violations_v2&testmode=F&startDateMS=1686034800000&endDateMS=1686380400000&compfil=(REDACTED)&integId=&allocatedList=
  const path = '/app/site/hosting/scriptlet.nl';
  const params = [];
  params.push('script=customscript_nsapm_cm_sl_violations_v2'); // script (note cm instead of cd)
  params.push('deploy=customdeploy_nsapm_cm_sl_violations_v2'); // deploy (note cm instead of cd)
  params.push('compfil=' + accountId); // account ID
  params.push('testmode=F'); // test mode
  params.push('startDateMS=' + Number(startDate)); // start date
  params.push('endDateMS=' + Number(endDate)); // end date
  params.push('integId='); // integration ID
  params.push('allocatedList'); // 7 (420/60) hour time offset for PST
  const url = path + '?' + params.join('&');
  console.log('getConcurrencyViolationsUrl() returning ' + url);

  return url;
}

export function initializeConcurrencySummaryColumns(hours: number[]): Column[] {
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

// -----------------------------------------------------------------------------
// DETAIL
// -----------------------------------------------------------------------------

/**
 * Gets concurrency detail data.
 *
 * @param accountId - NetSuite account ID
 * @param startDate - detail data start date
 * @param endDate - detail data end date
 * @returns concurrency detail data
 */
export async function getConcurrencyDetailData(
  accountId: string,
  startDate: string,
  endDate: string,
): Promise<ConcurrencyDetailData> {
  console.log('getConcurrencyDetailData() initiated', { accountId, startDate, endDate });

  // get concurrency detail from NetSuite's APM service
  const concurrencyUrl = getConcurrencyDetailUrl(accountId, startDate, endDate);
  const currencyResponse = await getDataFromPageContent(concurrencyUrl);
  const concurrency = currencyResponse.data as ConcurrencyDetailDataConcurrency;

  // get concurrency detail violations data from NetSuite's APM service
  const violationsUrl = getConcurrencyDetailViolationsUrl(accountId, startDate, endDate);
  const violationsResponse = await getDataFromPageContent(violationsUrl);
  const violations = violationsResponse.data as ConcurrencyDetailDataViolations;

  return { concurrency, violations };
}

/**
 * Build the relative URL to get the concurrency detail.
 *
 * @param accountId - the NetSuite account ID
 * @param startDate - the start date
 * @param endDate - the end date
 * @returns url - the url to get the concurrency summary
 */
function getConcurrencyDetailUrl(accountId: string, startDate: string, endDate: string): string {
  console.log(
    'getConcurrencyDetailUrl() initiated with ' +
      JSON.stringify({ accountId: accountId, startDate: startDate, endDate: endDate }),
  );
  // example URL: /app/site/hosting/scriptlet.nl?script=customscript_nsapm_cd_sl_concurrency_v2&deploy=customdeploy_nsapm_cd_sl_concurrency_v2&testmode=F&startDateMS=1682002800000&endDateMS=1682006400000&concurrencyMode=noallocation&integId=&compfil=(REDACTED)&allocatedList=
  const path = '/app/site/hosting/scriptlet.nl';
  const params = [];
  params.push('script=customscript_nsapm_cd_sl_concurrency_v2'); // script (note cd instead of cm)
  params.push('deploy=customdeploy_nsapm_cd_sl_concurrency_v2'); // deploy (note cd instead of cm)
  params.push('compfil=' + accountId); // account ID
  params.push('testmode=F'); // test mode
  params.push('startDateMS=' + startDate); // start date
  params.push('endDateMS=' + endDate); // end date
  params.push('concurrencyMode=noallocation'); // concurrency mode
  params.push('allocatedList='); // allocated list
  params.push('integId='); // integration ID
  const url = path + '?' + params.join('&');
  console.log('getConcurrencyDetailUrl() returning ' + url);

  return url;
}

/**
 * Build the relative URL to get the violations data.
 *
 * @param accountId - the NetSuite account ID
 * @param days - the number of days to get the data for
 * @returns url - the url to get the violation data
 */
function getConcurrencyDetailViolationsUrl(accountId: string, startDate: string, endDate: string): string {
  console.log(
    'getConcurrencyDetailViolationsUrl() initiated with ' + JSON.stringify({ accountId, startDate, endDate }),
  );
  // example URL: /app/site/hosting/scriptlet.nl?script=customscript_nsapm_cd_sl_violations_v2&deploy=customdeploy_nsapm_cd_sl_violations_v2&testmode=F&startDateMS=1685383200000&endDateMS=1685386800000&concurrencyMode=noallocation&integId=&compfil=(REDACTED)&allocatedList=
  const path = '/app/site/hosting/scriptlet.nl';
  const params = [];
  params.push('script=customscript_nsapm_cd_sl_violations_v2'); // script (note cm instead of cd)
  params.push('deploy=customdeploy_nsapm_cd_sl_violations_v2'); // deploy (note cm instead of cd)
  params.push('startDateMS=' + startDate); // start date
  params.push('endDateMS=' + endDate); // end date
  params.push('integId='); // integration ID
  params.push('compfil=' + accountId); // accountId
  params.push('allocatedList'); // 7 (420/60) hour time offset for PST
  const url = path + '?' + params.join('&');
  console.log('getConcurrencyDetailViolationsUrl() returning ' + url);

  return url;
}

// -----------------------------------------------------------------------------
// REQUEST
// -----------------------------------------------------------------------------

/**
 * Gets concurrency request (web service log) data.
 *
 * @param accountId - NetSuite account ID
 * @param startDate - request data start date
 * @param endDate - request data end date
 * @returns concurrency request data
 */
export async function getConcurrencyRequestData(
  accountId: string,
  startDate: string,
  endDate: string,
): Promise<ConcurrencyRequestData> {
  console.log('getConcurrencyRequestData() initiated', { accountId, startDate, endDate });

  // get concurrency requests from NetSuite's APM service
  const concurrencyUrl = getConcurrencyRequestUrl(accountId, startDate, endDate);
  const currencyResponse = await getDataFromPageContent(concurrencyUrl);
  const requests = currencyResponse.data as ConcurrencyRequestData;

  // filter the requests that are outside of the core timeframe
  const filteredRequests = requests.filter((request) => {
    return Number(request.endDate) >= Number(startDate) && Number(request.startDate) <= Number(endDate);
  });

  return filteredRequests;
}

/**
 * Build the relative URL to get the concurrency request.
 *
 * @param accountId - the NetSuite account ID
 * @param startDate - the start date
 * @param endDate - the end date
 * @returns url - the url to get the concurrency summary
 */
function getConcurrencyRequestUrl(accountId: string, startDate: string, endDate: string): string {
  console.log(
    'getConcurrencyRequestUrl() initiated with ' +
      JSON.stringify({ accountId: accountId, startDate: startDate, endDate: endDate }),
  );
  // widen the duration window to get long running requests
  const windowExtended = 6 * 60 * 1000; // 5 + 1 minute extra in milliseconds
  const startDateExtended = Number(startDate) - windowExtended;
  // example URL: /app/site/hosting/scriptlet.nl?script=customscript_nsapm_cd_sl_instances_v2&deploy=customdeploy_nsapm_cd_sl_instances_v2&testmode=F&startDateMS=1748941020000&endDateMS=1748941080000&compfil=(REDACTED)&allocatedList=&concurrencyMode=noallocation&integId=&sort=startDate&dir=ASC&pageLimit=10&startIndex=0
  const path = '/app/site/hosting/scriptlet.nl';
  const params = [];
  params.push('script=customscript_nsapm_cd_sl_instances_v2'); // script (note cd instead of cm)
  params.push('deploy=customdeploy_nsapm_cd_sl_instances_v2'); // deploy (note cd instead of cm)
  params.push('testmode=F'); // test mode
  params.push('startDateMS=' + startDateExtended); // start date
  params.push('endDateMS=' + endDate); // end date
  params.push('compfil=' + accountId); // account ID
  params.push('allocatedList='); // allocated list (optional)
  params.push('concurrencyMode=noallocation'); // concurrency mode
  params.push('integId='); // integration ID (optional)
  params.push('sort=startDate'); // sort order
  params.push('dir=ASC'); // sort direction
  // params.push('pageLimit=10'); // page limit (note that we do not want to page unless we need to)
  // params.push('startIndex=0'); // start index (note that we do not want to page unless we need to)

  const url = path + '?' + params.join('&');
  console.log('getConcurrencyRequestUrl() returning ' + url);

  return url;
}
