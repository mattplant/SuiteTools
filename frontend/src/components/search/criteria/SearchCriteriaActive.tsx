import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface SearchCriteriaActiveProps {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaActive({ register }: SearchCriteriaActiveProps) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="active">Active</label>
      <select
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="active"
        {...register('active')}
      >
        <option value="">All</option>
        <option value="T">Yes</option>
        <option value="F">No</option>
      </select>
    </div>
  );
}
