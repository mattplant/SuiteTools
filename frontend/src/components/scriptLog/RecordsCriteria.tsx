import { useForm } from 'react-hook-form';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaContent } from '../criteria/SearchCriteriaContent';
import { SearchCriteriaDateCreated } from '../criteria/SearchCriteriaDateCreated';
import { SearchCriteriaLevel } from '../criteria/SearchCriteriaLevel';
import { SearchCriteriaOwner } from '../criteria/SearchCriteriaOwner';
import { SearchCriteriaRows } from '../criteria/SearchCriteriaRows';
import { SearchCriteriaScript } from '../criteria/SearchCriteriaScript';
import { SearchCriteriaScriptType } from '../criteria/SearchCriteriaScriptType';
// import { SearchCriteriaUser } from '../../components/search/criteria/SearchCriteriaUser';

interface RecordsCriteriaProps {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordsCriteria({ defaultCriteria, setCriteria }: RecordsCriteriaProps) {
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
        Get Server Script Logs
      </button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaRows register={register} />
        <SearchCriteriaLevel register={register} />
        {/* <SearchCriteriaUser register={register} /> */}
        <SearchCriteriaScriptType register={register} />
        <SearchCriteriaScript register={register} />
        <SearchCriteriaOwner register={register} title="Owner" />
        <SearchCriteriaDateCreated register={register} title="Date" />
        <SearchCriteriaContent register={register} />
      </div>
    </form>
  );
}
