// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Row shapes for the concurrency request view.
 *
 * @fileoverview
 * Describes an individual request row — script, integration, operation and status — as scraped
 * from APM. Six modules outside this directory use it.
 *
 * @remarks
 * `CriteriaFields` here is local to the concurrency views and shadows the app-wide one in
 * `components/shared/criteria/types.ts`. Several fields sit commented out (`integrationId`,
 * `scriptId`, `wouldBeRejected`): APM exposes them inconsistently, so they are recorded here as
 * known-but-unreliable rather than deleted.
 *
 * @see ../../../../utils/concurrency.ts – where this data is assembled
 * @see ../detail/types.ts – the sibling interval view
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

export type CriteriaFields = { startDate: string; endDate: string };

interface ConcurrencyRequestRow {
  startDate: string;
  type: string;
  // integrationId: number;
  operation: string;
  endDate: string;
  // scriptId: number;
  integration: string;
  scriptName: string;
  status: string;
  // wouldBeRejected: boolean;
}

export interface ConcurrencyRequestRows extends Array<ConcurrencyRequestRow> {}

interface ConcurrencyRequestDataRow {
  startDate: number;
  type: string;
  integrationId: number;
  operation: string;
  endDate: number;
  scriptId: number;
  integration: string;
  scriptName: string;
  status: string;
  wouldBeRejected: boolean;
}

export interface ConcurrencyRequestData extends Array<ConcurrencyRequestDataRow> {}
