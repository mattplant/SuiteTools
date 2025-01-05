import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface RecordsCriteriaFieldDateRangeProps {
  register: UseFormRegister<CriteriaFields>;
  onChange: (criteria: CriteriaFields) => void;
}

export function RecordsCriteriaFieldDateRange({ register, onChange }: RecordsCriteriaFieldDateRangeProps) {
  return (
    <div className="mb-4 mt-4 text-sm font-medium text-gray-900">
      <label htmlFor="dateRange">Date Range: </label>
      <select
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-0.5"
        id="dateRange"
        {...register('dateRange')}
        onChange={(event) => {
          const criteria: CriteriaFields = { dateRange: event.currentTarget.value };
          onChange(criteria);
        }}
      >
        <option value="1">Today</option>
        <option value="2">Last 2 Days</option>
        <option value="3">Last 3 Days</option>
        <option value="7">Last 7 Days</option>
        <option value="14">Last 14 Days</option>
        <option value="29">Last 30 Days</option>
      </select>
    </div>
  );
}
