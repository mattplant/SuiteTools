import { useForm } from 'react-hook-form';
import { CriteriaFields } from '../../components/search/criteria/types';
import { SearchCriteriaActive } from '../../components/search/criteria/SearchCriteriaActive';
import { SearchCriteriaFile } from '../../components/search/criteria/SearchCriteriaFile';
import { SearchCriteriaOwner } from '../../components/search/criteria/SearchCriteriaOwner';
import { SearchCriteriaScript } from '../../components/search/criteria/SearchCriteriaScript';
import { SearchCriteriaScriptType } from '../../components/search/criteria/SearchCriteriaScriptType';
import { SearchCriteriaVersion } from '../../components/search/criteria/SearchCriteriaVersion';

interface ScriptsCriteriaProps {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function ScriptsCriteria({ setCriteria, defaultCriteria }: ScriptsCriteriaProps) {
  const { register, handleSubmit } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });

  function onSubmit(criteria: CriteriaFields) {
    console.log('Submitted details:', criteria);
    setCriteria(criteria);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center"
      >
        Get Scripts
      </button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaActive register={register} />
        <SearchCriteriaVersion register={register} />
        <SearchCriteriaScriptType register={register} />
        <SearchCriteriaScript register={register} />
        <SearchCriteriaOwner register={register} title="Owner" />
        <SearchCriteriaFile register={register} />
      </div>
    </form>
  );
}
