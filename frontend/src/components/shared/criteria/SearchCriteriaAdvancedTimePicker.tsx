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
import { SearchCriteriaSelect } from "./SearchCriteriaSelect";
import { DURATION_OPTIONS, TIME_MODE_OPTIONS } from "./staticOptions";

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
      <SearchCriteriaSelect
        register={register}
        name="timeMode"
        label="Time Mode"
        options={TIME_MODE_OPTIONS}
        size={2}
        allValue={null}
      />
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
          <SearchCriteriaSelect
            register={register}
            name="customDuration"
            label="Duration"
            options={DURATION_OPTIONS}
            allValue={null}
          />
        </>
      ) : (
        <SearchCriteriaDateCreated register={register} title="Duration" />
      )}
    </>
  );
}
