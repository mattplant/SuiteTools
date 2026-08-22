// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * View-layer types for the shared results grid and detail modal.
 *
 * @fileoverview
 * `ResultsTypes` is the public key for an entity's grid and modal; the rest is UI wiring.
 *
 * @remarks
 * Frontend-only by intent — these are not cross-workspace domain contracts and must not be
 * promoted to `@suiteworks/suitetools-shared`. Entity payload shapes come from the shared bundles.
 *
 * @see registry.tsx – where each `ResultsTypes` member is bound to its components
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

/**
 * Minimal shape for modal detail payloads (entity row with numeric id).
 * FE view-layer type — not a shared domain schema.
 */
export type ModalResult = { id: number };

/**
 * Props for entity results grids that open a detail modal.
 * Kept in the frontend: UI wiring, not a cross-workspace domain contract.
 */
export type ResultsProps = {
  rows: readonly unknown[];
  setId: (id: number) => void;
  setOpenModal: (openModal: boolean) => void;
};

/**
 * Public key for an entity's results grid and detail modal; the sole external handle on the
 * results machinery. The string values are internal to `resultsRegistry` — nothing matches them
 * by hand, so they are free to change with the enum member.
 */
export enum ResultsTypes {
  FILE = "file",
  INTEGRATION = "integration",
  JOB = "job",
  JOBRUN = "jobRun",
  LOGIN = "login",
  ROLE = "role",
  SCRIPT = "script",
  SCRIPTLOG = "scriptLog",
  SOAPLOG = "soapLog",
  TOKEN = "token",
  USER = "user",
}

export interface SummaryRow {
  id: string;
  totalCount: number;
}
