import { useEffect, useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import { getOptionValues } from './getOptionValues';
import type { OptionValues } from '@suiteworks/suitetools-shared';
import { OptionValuesTypes } from './types';
import type { CriteriaFields } from './types';

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaRoleName({ register }: Props): JSX.Element {
  const [values, setValues] = useState<OptionValues>([]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const data = await getOptionValues(OptionValuesTypes.ROLE);
      setValues(data);
    }

    fetchData();
  }, []);

  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="roleName">Role</label>
      <select
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="roleName"
        {...register('roleName')}
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
