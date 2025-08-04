import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaRows({ register }: Props) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="rows">Rows</label>
      <select
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="rows"
        {...register('rows')}
      >
        <option value="0">All</option>
        <option value="50">50</option>
        <option value="250">250</option>
        <option value="750">750</option>
        <option value="2000">2000</option>
        <option value="5000">5000</option>
      </select>
    </div>
  );
}
