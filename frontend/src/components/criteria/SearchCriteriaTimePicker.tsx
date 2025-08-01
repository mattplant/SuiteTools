import { Controller, Control } from 'react-hook-form';
import TimePicker from '../../ui/TimePicker';

interface Props {
  control: Control<any>;
  id: string;
  name: string;
  title: string;
  defaultValue?: string;
}

export function SearchCriteriaTimePicker({ control, id, name, title, defaultValue }: Props) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor={id}>{title}</label>
      <Controller
        name={name}
        control={control}
        defaultValue={defaultValue}
        render={({ field }) => (
          <TimePicker
            id={id}
            name={name}
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
