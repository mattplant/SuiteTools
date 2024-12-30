import { useEffect, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { getOptionValues } from './getOptionValues';
import { CriteriaFields, OptionValues, OptionValuesTypes } from './types';

interface SearchCriteriaUserNameProps {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaUserName({ register }: SearchCriteriaUserNameProps) {
  const [values, setValues] = useState<OptionValues[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getOptionValues(OptionValuesTypes.USER);
      setValues(data);
    }

    fetchData();
  }, []);

  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="userName">User</label>
      <select
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="userName"
        {...register('userName')}
      >
        <option value="">All</option>
        {values.map((option) => (
          <option key={option.text} value={option.text}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
}
