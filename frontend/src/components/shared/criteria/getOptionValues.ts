// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Re-export that lets criteria components fetch option values without reaching into adapters.
 *
 * @fileoverview
 * A single-symbol indirection over `adapters/api/optionValues`. Ten components in this
 * directory import it, and none of them import from the adapter layer directly.
 *
 * @remarks
 * The indirection is the point: it keeps one edge between the criteria components and the
 * adapter layer, so the fetch can be swapped or mocked in one place instead of ten. Importing
 * `adapters/api/optionValues` directly from a criteria component defeats it.
 *
 * @see ../../../adapters/api/optionValues.ts – the implementation
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

export { getOptionValues } from "../../../adapters/api/optionValues";
