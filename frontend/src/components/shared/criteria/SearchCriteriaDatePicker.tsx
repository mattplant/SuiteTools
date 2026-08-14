import type { Control } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Datepicker } from "flowbite-react";

interface Props {
  // Page forms use different shapes; CriteriaFields is not universal here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- RHF Control is form-generic across criteria pages
  control: Control<any>;
  name: string;
  title: string;
  defaultValue?: Date;
}

export function SearchCriteriaDatePicker({ control, name, title, defaultValue }: Props) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor={name}>{title}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => <Datepicker id={name} value={field.value} onChange={field.onChange} />}
      />
    </div>
  );
}
