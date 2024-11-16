import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface SearchCriteriaDateProps {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaDate({ register }: SearchCriteriaDateProps) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="date">Date</label>
      <select
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="date"
        {...register('date')}
      >
        <option value="0">All</option>
        <option value="15">Last 15 minutes</option>
        <option value="60">Last hour</option>
        <option value="240">Last 4 hours</option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="lastweektodate">Last 7 Days</option>
      </select>
    </div>
  );
}
