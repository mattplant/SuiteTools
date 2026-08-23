// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Owner criteria control, populated from the server's option values.
 *
 * @fileoverview
 * Unlike the static criteria controls, this one fetches its options on mount via
 * `getOptionValues` and holds them in local state — owners are account data, not a fixed list.
 *
 * @remarks
 * The fetch runs per mount with no shared cache, so several owner controls on one screen each
 * issue a request. That is tolerable at current usage but is the thing to change first if
 * criteria screens get heavier.
 *
 * @see ./getOptionValues.ts – the indirection this fetches through
 * @see ./RecordCriteriaForm.tsx – the form that owns register
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { useEffect, useState } from "react";
import type { UseFormRegister } from "react-hook-form";
import { getOptionValues } from "./getOptionValues";
import type { OptionValues } from "@suiteworks/suitetools-shared";
import { OptionValuesTypes } from "./types";
import type { CriteriaFields } from "./types";

interface Props {
  register: UseFormRegister<CriteriaFields>;
  title: string;
}

export function SearchCriteriaOwners({ register, title }: Props) {
  const [values, setValues] = useState<OptionValues>([]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const data = await getOptionValues(OptionValuesTypes.OWNER);
      setValues(data);
    }

    fetchData();
  }, []);

  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="owners">{title}</label>
      <select
        multiple
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="owners"
        {...register("owners")}
      >
        <option value="">All</option>
        {values.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
}
