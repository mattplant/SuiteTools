import { useEffect, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { getOptionValues } from './getOptionValues';
import { OptionValues, OptionValuesTypes } from './types';
import { CriteriaFields } from './types';

interface SearchCriteriaRoleProps {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaRole({ register }: SearchCriteriaRoleProps) {
  const [values, setValues] = useState<OptionValues[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getOptionValues(OptionValuesTypes.ROLE);
      setValues(data);
    }

    fetchData();
  }, []);

  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="role">Role</label>
      <select
        multiple
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="role"
        {...register('role')}
      >
        <option value="">All</option>
        {values.map((option) => (
          <option key={option.value} value={option.value}>
            {option.text}
          </option>
        ))}
      </select>
    </div>
  );
}
