import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaLevels({ register }: Props) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="level">Levels</label>
      <select
        multiple
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="levels"
        {...register('levels')}
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
