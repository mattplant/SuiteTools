import { useForm } from 'react-hook-form';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaContent } from '../criteria/SearchCriteriaContent';
import { SearchCriteriaDateCreated } from '../criteria/SearchCriteriaDateCreated';
import { SearchCriteriaLevels } from '../criteria/SearchCriteriaLevels';
import { SearchCriteriaOwners } from '../criteria/SearchCriteriaOwners';
import { SearchCriteriaRows } from '../criteria/SearchCriteriaRows';
import { SearchCriteriaScripts } from '../criteria/SearchCriteriaScripts';
import { SearchCriteriaScriptTypes } from '../criteria/SearchCriteriaScriptTypes';
// import { SearchCriteriaUser } from '../../components/search/criteria/SearchCriteriaUser';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ defaultCriteria, setCriteria }: Props) {
  const { register, handleSubmit } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });

  function onSubmit(criteria: CriteriaFields) {
    console.log('Submitted details:', criteria);
    setCriteria(criteria);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center"
      >
        Get Server Script Logs
      </button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaRows register={register} />
        <SearchCriteriaLevels register={register} />
        {/* <SearchCriteriaUser register={register} /> */}
        <SearchCriteriaScriptTypes register={register} />
        <SearchCriteriaScripts register={register} />
        <SearchCriteriaOwners register={register} title="Owners" />
        <SearchCriteriaDateCreated register={register} title="Date" />
        <SearchCriteriaContent register={register} />
      </div>
    </form>
  );
}
