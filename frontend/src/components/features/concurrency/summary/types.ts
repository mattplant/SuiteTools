// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Dataset shapes for the concurrency summary view.
 *
 * @fileoverview
 * Describes the overview figures the summary renders — concurrency limit, peak, time close to
 * and over the limit — plus the config and violations datasets behind the heat map. Six modules
 * outside this directory use it.
 *
 * @remarks
 * `CriteriaFields` here is local to the concurrency views and shadows the app-wide one, and it
 * differs from its two siblings: this one types the dates as `Date`, while detail and request
 * use `string`. That inconsistency is real, not a typo — converting one without the other
 * breaks the view that was not changed.
 *
 * @see ../../../../utils/concurrency.ts – where this data is assembled
 * @see ../detail/types.ts – the sibling view using string dates
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

export type CriteriaFields = { startDate?: Date; endDate?: Date };

export interface ConcurrencySummaryData {
  concurrency: ConcurrencySummaryDataConcurrency;
  violations: ConcurrencySummaryDataViolations;
}

export interface ConcurrencySummaryDataConcurrency {
  overview: {
    concurrencyLimit: number;
    peakConcurrency: { value: number; dateMS: number };
    timeCloseToLimit: { value: string; lowerRange: number; upperRange: number };
    timeOverLimit: { value: string; range: number };
  };
  config: {
    concurrencyLimit: number;
    endDateFilterMS: number;
    refreshDate: number;
    resolutionMS: number;
    startDateFilterMS: number;
  };
  xCategories: number[];
  yCategories: number[];
  series: { average: [number, number, number, number][]; peak: [number, number, number, number][] };
  allocations: object;
  results: { startTime: number; endTime: number; averageConcurrency: number; peakConcurrency: number }[];
  hourAverages?: number[]; // added field for average concurrency for each hour of the day (0-23)
}

export interface ConcurrencySummaryDataViolations {
  mode: string;
  integrations: [];
  overview: { totalViolations: number; totalRequests: number };
  config: { resolutionMS: number };
  series: {
    violation: { [key: number]: number }; // key is dateMS, value is violation error rate percentage
  };
}
