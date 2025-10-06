import { useEffect, useState } from 'react';
import type { UseFormRegister } from 'react-hook-form';
import { getOptionValues } from './getOptionValues';
import type { OptionValues } from '@suiteworks/suitetools-shared';
import { OptionValuesTypes } from './types';
import type { CriteriaFields } from './types';

interface Props {
  register: UseFormRegister<CriteriaFields>;
}

export function SearchCriteriaFiles({ register }: Props): JSX.Element {
  const [values, setValues] = useState<OptionValues>([]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
      const data = await getOptionValues(OptionValuesTypes.FILE);
      setValues(data);
    }

    fetchData();
  }, []);

  return (
    <div className="block mb-2 text-sm font-medium text-gray-900">
      <label htmlFor="files">Files</label>
      <select
        multiple
        size={6}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="files"
        {...register('files')}
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
