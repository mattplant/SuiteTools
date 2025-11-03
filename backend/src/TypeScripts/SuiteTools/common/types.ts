/**
 * SuiteTools Common - Shared Types
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

type SuiteQLRow = Record<string, string | number | boolean | null>;
export type SuiteQLResults = SuiteQLRow[];
