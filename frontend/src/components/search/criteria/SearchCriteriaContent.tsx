import { UseFormRegister } from 'react-hook-form';
import { CriteriaFields } from './types';

interface SearchCriteriaContentProps {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaContent({ register }: SearchCriteriaContentProps) {
  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label className="block">Content</label>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="title"
        {...register('title')}
      />
      <label htmlFor="detail">Detail</label>
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="detail"
        {...register('detail')}
      />
    </div>
  );
}
