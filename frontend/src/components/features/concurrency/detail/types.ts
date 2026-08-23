// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Row and dataset shapes for the concurrency detail view.
 *
 * @fileoverview
 * Describes what one detail interval looks like — a start/end pair carried both as epoch
 * milliseconds and as preformatted strings — plus the concurrency and violations datasets the
 * charts read. Six modules outside this directory use it.
 *
 * @remarks
 * `CriteriaFields` here is local to the concurrency views and shadows the app-wide one in
 * `components/shared/criteria/types.ts`; they are unrelated types that happen to share a name,
 * so check the import before assuming which is in scope. Timestamps are kept in both numeric
 * and string form because the charts sort on the number and label with the string.
 *
 * @see ../../../../utils/concurrency.ts – where this data is assembled
 * @see ../summary/types.ts – the sibling view, whose CriteriaFields uses Date instead
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

export type CriteriaFields = { startDate: string; endDate: string };

export interface ConcurrencyDetailRows {
  startTimeMS: number;
  startTime: string;
  endTimeMS: number;
  endTime: string;
  // averageConcurrency: number;
  peakConcurrency: number;
  peakConcurrencyTime?: string;
}

export interface ConcurrencyDetailData {
  concurrency: ConcurrencyDetailDataConcurrency;
  violations: ConcurrencyDetailDataViolations;
}

export interface ConcurrencyDetailDataConcurrency {
  overview: {
    pagingStartDateMS: number;
    pagingEndDateMS: number;
    concurrencyLimit: number;
    peakConcurrency: { value: number; dateMS: number };
  };
  config: { startDateMS: number; endDateMS: number; groupAggMS: number; maxConcurrency: number };
  indices: { [key: string]: number };
  concurrency: [number, number][];
  results: {
    startTime: number;
    endTime: number;
    averageConcurrency: number;
    peakConcurrency: number;
    peakConcurrencyTime?: string;
  }[];
}

export interface ConcurrencyDetailDataViolations {
  overview: {
    totalRequests: number;
    totalViolations: number;
    topIntegrations: { id: number; name: string; value: number }[];
    integrationName: string;
  };
  config: { startDateMS: number; endDataMS: number; groupAggMS: number };
  indices: { [key: string]: number };
  violations: [number, number][];
}
