// SPDX-License-Identifier: GPL-3.0-or-later

import type { Control, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Datepicker } from "flowbite-react";
import TimePicker from "../ui/TimePicker";
import { fieldGroupClass } from "../ui/fieldClasses";

interface Props {
  control: Control<FieldValues>;
  title: string;
  dateName: string;
  dateDefaultValue?: Date;
  timeId: string;
  timeName: string;
  timeDefaultValue?: string | undefined;
}

export function SearchCriteriaDateTimePicker({
  control,
  title,
  dateName,
  dateDefaultValue,
  timeId,
  timeName,
  timeDefaultValue,
}: Props) {
  return (
    <div className={fieldGroupClass}>
      <label htmlFor={dateName}>{title}</label>
      <Controller
        name={dateName}
        control={control}
        defaultValue={dateDefaultValue}
        render={({ field }) => <Datepicker id={dateName} value={field.value} onChange={field.onChange} />}
      />
      <Controller
        name={timeName}
        control={control}
        defaultValue={timeDefaultValue}
        render={({ field }) => (
          <TimePicker id={timeId} name={timeName} label={title} value={field.value} onChange={field.onChange} />
        )}
      />
    </div>
  );
}
