import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface SearchCriteriaVersionProps {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaVersion({ register }: SearchCriteriaVersionProps) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="version">API</label>
      <select
        multiple
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="version"
        {...register('version')}
      >
        <option value="">All</option>
        <option value="2.1">2.1</option>
        <option value="2.0">2.0</option>
        <option value="1.0">1.0</option>
      </select>
    </div>
  );
}
