import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaVersions({ register }: Props) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="versions">API</label>
      <select
        multiple
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="versions"
        {...register('versions')}
      >
        <option value="">All</option>
        <option value="2.1">2.1</option>
        <option value="2.0">2.0</option>
        <option value="1.0">1.0</option>
      </select>
    </div>
  );
}
