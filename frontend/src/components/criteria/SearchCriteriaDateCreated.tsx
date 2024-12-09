import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface SearchCriteriaDateCreatedProps {
  register: UseFormRegister<CriteriaFields>;
  title: string;
}

export function SearchCriteriaDateCreated({ register, title }: SearchCriteriaDateCreatedProps) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="createddate">{title}</label>
      <select
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="createddate"
        {...register('createddate')}
      >
        <option value="0">All</option>
        <option value="15">Last 15 minutes</option>
        <option value="60">Last hour</option>
        <option value="240">Last 4 hours</option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="lastweek">Last 7 Days</option>
        <option value="lastmonth">Last 31 Days</option>
      </select>
    </div>
  );
}
