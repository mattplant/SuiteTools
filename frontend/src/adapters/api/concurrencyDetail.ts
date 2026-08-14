// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for concurrency detail (APM scrape).
 */

import { getConcurrencyDetailData } from "../../utils/concurrency";
import type { ConcurrencyDetailData, CriteriaFields } from "../../components/features/concurrency/detail/types";

/**
 * Fetch concurrency detail for a date range.
 * @param fields - Start/end dates.
 * @param accountId - NetSuite account id from settings.
 */
export async function getConcurrencyDetail(fields: CriteriaFields, accountId: string): Promise<ConcurrencyDetailData> {
  if (typeof window !== "undefined" && window.location.href.includes("localhost")) {
    return {
      concurrency: {
        overview: {
          pagingStartDateMS: 1736064000000,
          pagingEndDateMS: 1736067600000,
          concurrencyLimit: 20,
          peakConcurrency: { value: 1, dateMS: 1736067360000 },
        },
        config: { startDateMS: 1736064000000, endDateMS: 1736067600000, groupAggMS: 60000, maxConcurrency: 20 },
        indices: { "1736064000000": 0, "1736064060000": 1 },
        concurrency: [
          [1736064000000, 0],
          [1736064060000, 0],
        ],
        results: [
          {
            startTime: 1736064000000,
            endTime: 1736064060000,
            averageConcurrency: 0,
            peakConcurrency: 1,
            peakConcurrencyTime: "2025-01-05 09:13:04",
          },
          { startTime: 1736064060000, endTime: 1736064120000, averageConcurrency: 0, peakConcurrency: 0 },
        ],
      },
      violations: {
        overview: {
          totalRequests: 13,
          totalViolations: 0,
          topIntegrations: [{ id: 18143, name: "eTail Connectors (Token-Based Auth)", value: 13 }],
          integrationName: "",
        },
        config: { startDateMS: 1736064000000, endDataMS: 1736067600000, groupAggMS: 60000 },
        indices: { "1736064000000": 0, "1736064060000": 1 },
        violations: [
          [1736064000000, 0],
          [1736064060000, 0],
        ],
      },
    };
  }

  if (!accountId || !fields.startDate || !fields.endDate) {
    throw new Error("getConcurrencyDetail() requires accountId, startDate, and endDate");
  }

  return getConcurrencyDetailData(accountId, fields.startDate, fields.endDate);
}
