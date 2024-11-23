import { useForm } from 'react-hook-form';
import { CriteriaFields } from '../../components/search/criteria/types';
import { SearchCriteriaContent } from '../../components/search/criteria/SearchCriteriaContent';
import { SearchCriteriaDateCreated } from '../../components/search/criteria/SearchCriteriaDateCreated';
import { SearchCriteriaLevel } from '../../components/search/criteria/SearchCriteriaLevel';
import { SearchCriteriaOwner } from '../../components/search/criteria/SearchCriteriaOwner';
import { SearchCriteriaRows } from '../../components/search/criteria/SearchCriteriaRows';
import { SearchCriteriaScript } from '../../components/search/criteria/SearchCriteriaScript';
import { SearchCriteriaScriptType } from '../../components/search/criteria/SearchCriteriaScriptType';
// import { SearchCriteriaUser } from '../../components/search/criteria/SearchCriteriaUser';

interface ScriptLogsCriteriaProps {
  setCriteria: (criteria: CriteriaFields) => void;
}

export function ScriptLogsCriteria({ setCriteria }: ScriptLogsCriteriaProps) {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    level: ['ERROR', 'EMERGENCY', 'SYSTEM'],
    // user: [''],
    scripttype: [''],
    scriptname: [''],
    owner: [''],
    createddate: '15',
    title: '',
    detail: '',
  };
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
        <SearchCriteriaOwner register={register} />
        <SearchCriteriaDateCreated register={register} title="Date" />
        <SearchCriteriaContent register={register} />
      </div>
    </form>
  );
}
