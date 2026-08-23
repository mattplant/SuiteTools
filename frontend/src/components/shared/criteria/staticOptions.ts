// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The fixed option lists criteria selects offer, for the choices no server call decides.
 *
 * @fileoverview
 * Eight criteria controls pick from a literal list rather than a fetch. Two of those lists are
 * used twice over — the relative date windows by both date controls, the yes/no pair by `Active`
 * and `Completed` — so they are named once here and the controls stay one call each.
 *
 * @remarks
 * Values are submitted verbatim and interpreted server-side: the date tokens are read by the
 * criteria-to-SuiteQL translation and the durations are minute counts. Changing a `value` changes
 * what a search means, while changing a `text` is cosmetic.
 *
 * @see ./SearchCriteriaSelect.tsx – what renders these
 * @see ./types.ts – the criteria fields they are submitted under
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { OptionValues } from "@suiteworks/suitetools-shared";

/**
 * Build the yes/no pair shared by the `active` and `completed` controls.
 * @param trueLabel - Wording for the affirmative choice.
 * @param falseLabel - Wording for the negative choice.
 * @returns The two options, in that order.
 */
export function yesNoOptions(trueLabel: string, falseLabel: string): OptionValues {
  return [
    { value: "T", text: trueLabel },
    { value: "F", text: falseLabel },
  ];
}

/** Relative windows offered by both the created-date and modified-date controls. */
export const DATE_RANGE_OPTIONS: OptionValues = [
  { value: "15", text: "Last 15 minutes" },
  { value: "60", text: "Last hour" },
  { value: "240", text: "Last 4 hours" },
  { value: "today", text: "Today" },
  { value: "yesterday", text: "Yesterday" },
  { value: "lastweek", text: "Last 7 Days" },
  { value: "lastmonth", text: "Last 31 Days" },
];

/** Script log severities. */
export const LOG_LEVEL_OPTIONS: OptionValues = [
  { value: "DEBUG", text: "Debug" },
  { value: "AUDIT", text: "Audit" },
  { value: "ERROR", text: "Error" },
  { value: "EMERGENCY", text: "Emergency" },
  { value: "SYSTEM", text: "System" },
];

/** Row caps a search may request; the catch-all "All" entry is `0`. */
export const ROW_LIMIT_OPTIONS: OptionValues = [
  { value: "50", text: "50" },
  { value: "250", text: "250" },
  { value: "750", text: "750" },
  { value: "2000", text: "2000" },
  { value: "5000", text: "5000" },
];

/** SuiteScript API versions. */
export const API_VERSION_OPTIONS: OptionValues = [
  { value: "2.1", text: "2.1" },
  { value: "2.0", text: "2.0" },
  { value: "1.0", text: "1.0" },
];

/** Whether the advanced time picker ends its window now or at a chosen moment. */
export const TIME_MODE_OPTIONS: OptionValues = [
  { value: "now", text: "Now" },
  { value: "custom", text: "Custom" },
];

/** Lookback windows for the advanced time picker, in minutes. */
export const DURATION_OPTIONS: OptionValues = [
  { value: "1", text: "Minute" },
  { value: "15", text: "15 min" },
  { value: "60", text: "Hour" },
  { value: "1440", text: "Day" },
  { value: "10080", text: "Week" },
  { value: "43200", text: "Month*" },
];
