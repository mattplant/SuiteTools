import { useEffect, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { getIntegrationOptionValues } from '../integration/getIntegrationOptionValues';
import { OptionValues } from './types';
import { CriteriaFields } from './types';

interface SearchCriteriaIntegrationProps {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaIntegrationByValue({ register }: SearchCriteriaIntegrationProps) {
  const [values, setValues] = useState<OptionValues[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getIntegrationOptionValues(false);
      setValues(data);
    }

    fetchData();
  }, []);

  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="integration">Integration</label>
      <select
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="integration"
        {...register('integration')}
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
