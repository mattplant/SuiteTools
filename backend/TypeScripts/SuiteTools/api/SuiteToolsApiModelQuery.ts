// SPDX-License-Identifier: GPL-3.0-or-later
/**
 * SuiteTools API - Model SuiteQL response helpers
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import type { SuiteQLResults } from "../common/types";
import type { Response } from "./types";

type SuiteQLRow = SuiteQLResults[number];

/**
 * Build a singular-entity model response from SuiteQL rows.
 * Empty → `{ status: 200, data: null, message }` for soft NotFound at the Get layer.
 */
export function queryOne<T = SuiteQLRow>(
  rows: SuiteQLResults,
  emptyMessage: string,
  mapRow?: (row: SuiteQLRow) => T,
): Response {
  if (rows.length === 0) {
    return { status: 200, data: null, message: emptyMessage };
  }
  return { status: 200, data: mapRow ? mapRow(rows[0]) : rows[0] };
}

/**
 * Build a list model response from SuiteQL rows.
 * Empty → `{ status: 200, data: [], message }` (never `{}`).
 */
export function queryMany<T = SuiteQLRow>(
  rows: SuiteQLResults,
  emptyMessage: string,
  mapRows?: (rows: SuiteQLResults) => T[],
): Response {
  if (rows.length === 0) {
    return { status: 200, data: [], message: emptyMessage };
  }
  return { status: 200, data: mapRows ? mapRows(rows) : rows };
}
