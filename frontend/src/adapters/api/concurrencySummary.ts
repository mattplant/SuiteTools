// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for concurrency summary (APM scrape).
 */

import { getConcurrencySummaryData } from "../../utils/concurrency";
import type { ConcurrencySummaryData, CriteriaFields } from "../../components/features/concurrency/summary/types";

/**
 * Fetch concurrency summary for a date range.
 * @param fields - Start/end dates.
 * @param accountId - NetSuite account id from settings.
 */
export async function getConcurrencySummary(
  fields: CriteriaFields,
  accountId?: string,
): Promise<ConcurrencySummaryData> {
  if (typeof window !== "undefined" && window.location.href.includes("localhost")) {
    return {
      concurrency: {
        overview: {
          concurrencyLimit: 20,
          peakConcurrency: { value: 17, dateMS: 1735866000000 },
          timeCloseToLimit: { value: "1.23", lowerRange: 18, upperRange: 20 },
          timeOverLimit: { value: "2.46", range: 20 },
        },
        config: {
          concurrencyLimit: 20,
          resolutionMS: 3600000,
          refreshDate: 1735977600000,
          startDateFilterMS: 1733385600000,
          endDateFilterMS: 1735977600000,
        },
        xCategories: [1735891200000, 1735894800000],
        yCategories: [1733385600000, 1733472000000],
        series: {
          average: [
            [0, 0, 0, 1733385600000],
            [1, 0, 0, 1733389200000],
          ],
          peak: [
            [0, 0, 50, 1733385600000],
            [1, 0, 25, 1733389200000],
          ],
        },
        allocations: {},
        results: [{ startTime: 1733385600000, endTime: 1733389200000, averageConcurrency: 0, peakConcurrency: 0 }],
      },
      violations: {
        mode: "noallocation",
        integrations: [],
        overview: { totalViolations: 1, totalRequests: 123 },
        config: { resolutionMS: 3600000 },
        series: { violation: {} },
      },
    };
  }

  if (!accountId || !fields.startDate || !fields.endDate) {
    throw new Error("getConcurrencySummary() requires accountId, startDate, and endDate");
  }

  return getConcurrencySummaryData(accountId, fields.startDate, fields.endDate);
}
