import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface Props {
  register: UseFormRegister<CriteriaFields>;
  title?: string;
  trueLabel?: string;
  falseLabel?: string;
}

export function SearchCriteriaActive({ register, title = 'Active', trueLabel = 'Yes', falseLabel = 'No' }: Props) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="active">{title}</label>
      <select
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="active"
        {...register('active')}
      >
        <option value="">All</option>
        <option value="T">{trueLabel}</option>
        <option value="F">{falseLabel}</option>
      </select>
    </div>
  );
}
