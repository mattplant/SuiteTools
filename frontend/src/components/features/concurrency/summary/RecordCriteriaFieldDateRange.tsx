import { useState } from 'react';
import { UseFormRegister, UseFormSetValue } from 'react-hook-form';
import { CriteriaFields } from './types';
import { Datepicker } from 'flowbite-react';

interface RecordCriteriaFieldDateRangeProps {
  register: UseFormRegister<CriteriaFields>;
  setValue: UseFormSetValue<CriteriaFields>;
}

export function RecordCriteriaFieldDateRange({
  setValue,
  defaultValues,
}: RecordCriteriaFieldDateRangeProps & {
  defaultValues?: Partial<CriteriaFields>;
}) {
  const [startDate, setStartDate] = useState<Date | null>(
    defaultValues?.startDate ? new Date(defaultValues.startDate) : null,
  );
  const [endDate, setEndDate] = useState<Date | null>(defaultValues?.endDate ? new Date(defaultValues.endDate) : null);

  return (
    <>
      <div className="mb-4 mt-4 text-sm font-medium text-gray-900">
        <label htmlFor="startDate" className="mr-2">
          Start Date:
        </label>
        <Datepicker
          id="startDate"
          value={startDate}
          minDate={new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)}
          maxDate={new Date()}
          onChange={(date: Date | null) => {
            setStartDate(date);
            setValue('startDate', date ? date : undefined);
          }}
        />
      </div>
      <div className="mb-4 mt-4 text-sm font-medium text-gray-900">
        <label htmlFor="endDate" className="mr-2">
          End Date:
        </label>
        <Datepicker
          id="endDate"
          value={endDate}
          minDate={new Date(Date.now() - 29 * 24 * 60 * 60 * 1000)}
          maxDate={new Date()}
          onChange={(date: Date | null) => {
            setEndDate(date);
            setValue('endDate', date ? date : undefined);
          }}
        />
      </div>
    </>
  );
}
