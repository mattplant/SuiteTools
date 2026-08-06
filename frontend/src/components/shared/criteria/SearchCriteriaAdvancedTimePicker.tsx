// Component supports both real-time monitoring and retrospective debugging use cases.
import React from 'react';
import type { UseFormRegister, Control} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import type { CriteriaFields } from './types';
import { SearchCriteriaDateCreated } from './SearchCriteriaDateCreated';
import { SearchCriteriaDateTimePicker } from './SearchCriteriaDateTimePicker';

interface Props {
  register: UseFormRegister<CriteriaFields>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- advanced-* fields are not on CriteriaFields yet
  control: Control<any>;
  dateDefaultValue: Date;
  timeDefaultValue?: string;
}

export function SearchCriteriaAdvancedTimePicker({ register, control, dateDefaultValue, timeDefaultValue }: Props) {
  const timeMode = useWatch({
    control,
    name: 'timeMode',
    defaultValue: 'now',
  });
  // set customDateTime field by combining date and time inputs
  const customDate = useWatch({
    control,
    name: 'advanced-date',
    defaultValue: dateDefaultValue,
  });
  const customTime = useWatch({
    control,
    name: 'advanced-time',
    defaultValue: timeDefaultValue,
  });
  React.useEffect(() => {
    if (timeMode === 'custom' && customDate && customTime) {
      const [hours, minutes, seconds] = String(customTime).split(':').map(Number);
      const combinedDate = new Date(customDate);
      combinedDate.setHours(hours || 0, minutes || 0, seconds || 0, 0);
      control._formValues['customDateTime'] = combinedDate.getTime();
    }
  }, [timeMode, customDate, customTime, control]);
  return (
    <>
      <div className="block mb-2 text-sm font-medium text-gray-900">
        <label htmlFor="timeMode">Time Mode</label>
        <select
          size={2}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          id="timeMode"
          {...register('timeMode')}
        >
          <option value="now">Now</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      {timeMode === 'custom' ? (
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
              {...register('customDuration')}
            >
              <option value="1">Minute</option>
              <option value="15">15 min</option>
              <option value="hour">Hour</option>
              <option value="day">Day</option>
              <option value="week">Week</option>
              <option value="month">Month*</option>
            </select>
          </div>
        </>
      ) : (
        <SearchCriteriaDateCreated register={register} title="Duration" />
      )}
    </>
  );
}
