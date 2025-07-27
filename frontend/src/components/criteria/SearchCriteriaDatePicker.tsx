import { Controller, Control } from 'react-hook-form';
import { Datepicker } from 'flowbite-react';

interface Props {
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
