// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Active/inactive criteria control.
 *
 * @fileoverview
 * A labelled select bound to the `active` field, used by seven screens. Titles and both option
 * labels are props because the same yes/no shape reads differently per entity — "Active" for
 * users, "Completed" for jobs.
 *
 * @remarks
 * Registers directly against the parent form's `register`; it holds no state of its own. The
 * value is a string, not a boolean, because it round-trips through form serialisation and the
 * query string.
 *
 * @see ./RecordCriteriaForm.tsx – the form that owns register
 * @see ./types.ts – the active field
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { UseFormRegister } from "react-hook-form";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
  title?: string;
  trueLabel?: string;
  falseLabel?: string;
}

export function SearchCriteriaActive({ register, title = "Active", trueLabel = "Yes", falseLabel = "No" }: Props) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="active">{title}</label>
      <select
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="active"
        {...register("active")}
      >
        <option value="">All</option>
        <option value="T">{trueLabel}</option>
        <option value="F">{falseLabel}</option>
      </select>
    </div>
  );
}
