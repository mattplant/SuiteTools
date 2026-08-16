/**
 * SuiteTools Common - Shared Types
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

/** A single SuiteQL column value. `null` is what an unset column comes back as. */
export type SuiteQLValue = string | number | boolean | null;

type SuiteQLRow = Record<string, SuiteQLValue>;
export type SuiteQLResults = SuiteQLRow[];
