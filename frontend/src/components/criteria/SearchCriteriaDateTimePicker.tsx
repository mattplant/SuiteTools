import { Controller, Control } from 'react-hook-form';
import { Datepicker } from 'flowbite-react';
import TimePicker from '../../ui/TimePicker';

interface Props {
  control: Control<any>;
  title: string;
  dateName: string;
  dateDefaultValue?: Date;
  timeId: string;
  timeName: string;
  timeDefaultValue?: String | undefined;
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
    <div className="block mb-2 text-sm font-medium text-gray-900">
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
          <TimePicker
            id={timeId}
            name={timeName}
            label={title}
            value={field.value}
            onChange={field.onChange}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          />
        )}
      />
    </div>
  );
}
