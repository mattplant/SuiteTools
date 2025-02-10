import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface Props {
  register: UseFormRegister<CriteriaFields>;
  title?: string;
  trueLabel?: string;
  falseLabel?: string;
}

export function SearchCriteriaCompleted({
  register,
  title = 'Completed',
  trueLabel = 'Yes',
  falseLabel = 'No',
}: Props) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="completed">{title}</label>
      <select
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="completed"
        {...register('completed')}
      >
        <option value="">All</option>
        <option value="T">{trueLabel}</option>
        <option value="F">{falseLabel}</option>
      </select>
    </div>
  );
}
