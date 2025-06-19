import { useForm } from 'react-hook-form';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaActive } from '../criteria/SearchCriteriaActive';
import { SearchCriteriaFiles } from '../criteria/SearchCriteriaFiles';
import { SearchCriteriaOwners } from '../criteria/SearchCriteriaOwners';
import { SearchCriteriaScripts } from '../criteria/SearchCriteriaScripts';
import { SearchCriteriaScriptTypes } from '../criteria/SearchCriteriaScriptTypes';
import { SearchCriteriaVersions } from '../criteria/SearchCriteriaVersion';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
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
        <SearchCriteriaVersions register={register} />
        <SearchCriteriaScriptTypes register={register} />
        <SearchCriteriaScripts register={register} />
        <SearchCriteriaOwners register={register} title="Owner" />
        <SearchCriteriaFiles register={register} />
      </div>
    </form>
  );
}
