// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Time-mode criteria: relative windows from now, or a custom end datetime + lookback duration.
 */

import React from "react";
import type { UseFormRegister, Control, FieldValues, UseFormSetValue } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { CriteriaFields } from "./types";
import { SearchCriteriaDateCreated } from "./SearchCriteriaDateCreated";
import { SearchCriteriaDateTimePicker } from "./SearchCriteriaDateTimePicker";

interface Props {
  register: UseFormRegister<CriteriaFields>;
  control: Control<FieldValues>;
  setValue: UseFormSetValue<CriteriaFields>;
  dateDefaultValue: Date;
  timeDefaultValue?: string;
}

/** Format a Date as SuiteQL `TO_DATE(..., 'YYYY-MM-DD HH24:MI:SS')` input (local wall clock). */
function formatSuiteQlDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function SearchCriteriaAdvancedTimePicker({
  register,
  control,
  setValue,
  dateDefaultValue,
  timeDefaultValue,
}: Props) {
  const timeMode = useWatch({ control, name: "timeMode", defaultValue: "now" });
  const customDate = useWatch({ control, name: "advanced-date", defaultValue: dateDefaultValue });
  const customTime = useWatch({ control, name: "advanced-time", defaultValue: timeDefaultValue });

  React.useEffect(() => {
    if (timeMode !== "custom" || !customDate || !customTime) {
      return;
    }
    const [hours, minutes, seconds] = String(customTime).split(":").map(Number);
    const combinedDate = new Date(customDate);
    combinedDate.setHours(hours || 0, minutes || 0, seconds || 0, 0);
    setValue("customDateTime", formatSuiteQlDateTime(combinedDate), { shouldDirty: true });
  }, [timeMode, customDate, customTime, setValue]);

  return (
    <>
      <div className="block mb-2 text-sm font-medium text-gray-900">
        <label htmlFor="timeMode">Time Mode</label>
        <select
          size={2}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          id="timeMode"
          {...register("timeMode")}
        >
          <option value="now">Now</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      {timeMode === "custom" ? (
        <>
          <SearchCriteriaDateTimePicker
            control={control}
            title="From Date"
            dateName="advanced-date"
            dateDefaultValue={dateDefaultValue}
            timeId="advanced-time"
            timeName="advanced-time"
            timeDefaultValue={timeDefaultValue}
          />
          <div className="block mb-2 text-sm font-medium text-gray-900">
            <label htmlFor="customDuration">Duration</label>
            <select
              size={6}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              id="customDuration"
              {...register("customDuration")}
            >
              <option value="1">Minute</option>
              <option value="15">15 min</option>
              <option value="60">Hour</option>
              <option value="1440">Day</option>
              <option value="10080">Week</option>
              <option value="43200">Month*</option>
            </select>
          </div>
        </>
      ) : (
        <SearchCriteriaDateCreated register={register} title="Duration" />
      )}
    </>
  );
}
