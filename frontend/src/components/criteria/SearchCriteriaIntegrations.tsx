import { useEffect, useState } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { getOptionValues } from '../integration/getOptionValues';
import { OptionValues } from './types';
import { CriteriaFields } from './types';

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaIntegrations({ register }: Props) {
  const [values, setValues] = useState<OptionValues[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getOptionValues(true);
      setValues(data);
    }

    fetchData();
  }, []);

  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="integrations">Integrations</label>
      <select
        multiple
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="integrations"
        {...register('integrations')}
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
