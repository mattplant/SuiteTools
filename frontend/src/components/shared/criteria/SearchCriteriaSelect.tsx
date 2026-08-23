// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The one labelled select every criteria screen renders.
 *
 * @fileoverview
 * Twenty-one criteria components were copies of the same 43 lines, differing in about five of
 * them. They are now thin calls onto this shell, which owns the label, the wrapper, the catch-all
 * entry and — when `optionsType` is given — the fetch that fills the list.
 *
 * @remarks
 * `valueBy` is the one axis that must not be normalised away: plural pickers submit record ids
 * while the singular `*Name` pickers submit display strings, because their criteria fields are
 * matched against names server-side. `name` is used as both the element id and the `register`
 * key, so the two can never drift apart — every caller relies on that.
 *
 * @see ./getOptionValues.ts – where an `optionsType` list comes from
 * @see ./types.ts – the criteria fields a `name` may point at
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { useEffect, useState } from "react";
import type { Path, UseFormRegister } from "react-hook-form";
import type { OptionValues } from "@suiteworks/suitetools-shared";
import { fieldControlClass, fieldGroupClass } from "../ui/fieldClasses";
import { getOptionValues } from "./getOptionValues";
import type { OptionValuesTypes } from "./types";
import type { CriteriaFields } from "./types";

const NO_OPTIONS: OptionValues = [];

interface Props {
  register: UseFormRegister<CriteriaFields>;
  /** Criteria field to register — doubles as the element id the label points at. */
  name: Path<CriteriaFields>;
  label: string;
  /** Fetched on mount when set; otherwise `options` supplies a fixed list. */
  optionsType?: OptionValuesTypes;
  options?: OptionValues;
  multiple?: boolean;
  size?: number;
  /** Which side of each option becomes the submitted value. */
  valueBy?: "value" | "text";
  /** Value of the leading "All" entry, or `null` for a select that has no catch-all. */
  allValue?: string | null;
}

export function SearchCriteriaSelect({
  register,
  name,
  label,
  optionsType,
  options,
  multiple = false,
  size = 6,
  valueBy = "value",
  allValue = "",
}: Props): React.JSX.Element {
  const [fetched, setFetched] = useState<OptionValues>(NO_OPTIONS);

  useEffect(() => {
    if (!optionsType) {
      return;
    }
    let active = true;

    async function fetchData(type: OptionValuesTypes): Promise<void> {
      const data = await getOptionValues(type);
      // A screen can unmount before a slow option list lands; dropping it avoids a stray update.
      if (active) {
        setFetched(data);
      }
    }

    fetchData(optionsType);

    return () => {
      active = false;
    };
  }, [optionsType]);

  const items = optionsType ? fetched : (options ?? NO_OPTIONS);

  return (
    <div className={fieldGroupClass}>
      <label htmlFor={name}>{label}</label>
      <select multiple={multiple} size={size} className={fieldControlClass} id={name} {...register(name)}>
        {allValue !== null && <option value={allValue}>All</option>}
        {items.map((option) => {
          const value = valueBy === "text" ? option.text : option.value;
          return (
            <option key={value} value={value}>
              {option.text}
            </option>
          );
        })}
      </select>
    </div>
  );
}
