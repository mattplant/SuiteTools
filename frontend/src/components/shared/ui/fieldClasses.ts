// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The two Tailwind class strings every criteria control is built from.
 *
 * @fileoverview
 * These were pasted into 25 criteria components and the time input — 26 copies of each string —
 * so restyling one control meant editing 25 files. Naming them once makes that a single edit,
 * which is what the dark-mode work (#64) needs before it can start.
 *
 * @remarks
 * Both strings hardcode light-mode colours for surface, edge and lettering. That is the existing
 * appearance, kept verbatim; adding theme variants here restyles every criteria control at once,
 * so treat an edit as app-wide rather than local.
 *
 * @see ../criteria/SearchCriteriaSelect.tsx – the shell that applies both to every criteria select
 * @see ./TimePicker.tsx – the only consumer outside the criteria directory
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

/** Wrapper holding one criteria label and its control. */
export const fieldGroupClass = "block mb-2 text-sm font-medium text-gray-900";

/** The control itself — a criteria select or text input. */
export const fieldControlClass =
  "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5";
