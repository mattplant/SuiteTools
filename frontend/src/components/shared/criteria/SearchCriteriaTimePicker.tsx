// SPDX-License-Identifier: GPL-3.0-or-later

import type { Control, FieldValues } from "react-hook-form";
import { Controller } from "react-hook-form";
import TimePicker from "../ui/TimePicker";
import { fieldGroupClass } from "../ui/fieldClasses";

interface Props {
  control: Control<FieldValues>;
  id: string;
  name: string;
  title: string;
  defaultValue?: string;
}

export function SearchCriteriaTimePicker({ control, id, name, title, defaultValue }: Props) {
  return (
    <div className={fieldGroupClass}>
      <label htmlFor={id}>{title}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <TimePicker id={id} name={name} label={title} value={field.value} onChange={field.onChange} />
        )}
      />
    </div>
  );
}
