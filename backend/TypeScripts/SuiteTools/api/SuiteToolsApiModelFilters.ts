// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * SuiteTools API - Model SuiteQL filter builders
 *
 * @fileoverview
 * Pure `WHERE`-fragment builders shared by the model's list getters. Extracted from
 * `SuiteToolsApiModel` (#114): three getters call `addDateFilter` from four sites, and as a
 * private method its six branches were only reachable through a getter that also needed a
 * SuiteQL stub. Here it is a plain function over a string array, testable on its own.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from "N/log";

/**
 * Add Date Filter
 *
 * Supports:
 * - `0` / empty: no filter
 * - numeric strings (`15`, `60`, `240`): last N minutes
 * - `today`, `yesterday`, `lastweek` (7 days), `lastmonth` (31 days)
 *
 * @param where - the where clause fragments, appended to in place
 * @param functionName - the calling function's name (for debug logging)
 * @param table - the table name, or `""` for an unqualified column
 * @param field - the field name
 * @param dates - the date filter value
 */
export function addDateFilter(
  where: string[],
  functionName: string,
  table: string,
  field: string,
  dates: string | string[],
): void {
  if (!dates || dates === "" || dates === "0") {
    return;
  }

  // Files UI only sends a single select value today.
  if (typeof dates !== "string") {
    log.debug({ title: `${functionName} addDateFilter`, details: { skippedNonStringDates: dates } });
    return;
  }

  const column = table ? `${table}.${field}` : field;

  switch (dates) {
    case "today":
      where.push(`TO_CHAR(${column}, 'YYYY-MM-DD') = TO_CHAR(SYSDATE, 'YYYY-MM-DD')`);
      break;
    case "yesterday":
      where.push(`TO_CHAR(${column}, 'YYYY-MM-DD') = TO_CHAR(SYSDATE - 1, 'YYYY-MM-DD')`);
      break;
    case "lastweek":
      where.push(`${column} >= (SYSDATE - 7)`);
      break;
    case "lastmonth":
      where.push(`${column} >= (SYSDATE - 31)`);
      break;
    default: {
      // Relative window in minutes (e.g. "15", "60", "240")
      // NetSuite SuiteQL uses fractional days: minutes / 1440
      const minutes = parseInt(dates, 10);
      if (!Number.isNaN(minutes) && minutes > 0) {
        where.push(`${column} >= (SYSDATE - ${minutes} / 1440)`);
      } else {
        log.debug({ title: `${functionName} addDateFilter`, details: `Unhandled date filter value: ${dates}` });
      }
      break;
    }
  }
}
