import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface SearchCriteriaLevelProps {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaLevel({ register }: SearchCriteriaLevelProps) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="level">Level</label>
      <select
        multiple
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="level"
        {...register('level')}
      >
        <option value="">All</option>
        <option value="DEBUG">Debug</option>
        <option value="AUDIT">Audit</option>
        <option value="ERROR">Error</option>
        <option value="EMERGENCY">Emergency</option>
        <option value="SYSTEM">System</option>
      </select>
    </div>
  );
}
