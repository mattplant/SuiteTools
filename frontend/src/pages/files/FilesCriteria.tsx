import { useForm } from 'react-hook-form';
import { CriteriaFields } from '../../components/search/criteria/types';
import { SearchCriteriaDateCreated } from '../../components/search/criteria/SearchCriteriaDateCreated';
import { SearchCriteriaFileType } from '../../components/search/criteria/SearchCriteriaFileType';
import { SearchCriteriaRows } from '../../components/search/criteria/SearchCriteriaRows';
import { SearchCriteriaDateModified } from '../../components/search/criteria/SearchCriteriaDateModified';

interface FilesCriteriaProps {
  setCriteria: (criteria: CriteriaFields) => void;
}

export function FilesCriteria({ setCriteria }: FilesCriteriaProps) {
  const defaultCriteria: CriteriaFields = {
    rows: 50,
    filetype: [''],
    createddate: 'today',
    lastmodifieddate: 'today',
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
        Get Files
      </button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaRows register={register} />
        <SearchCriteriaFileType register={register} />
        <SearchCriteriaDateCreated register={register} title="Created Date" />
        <SearchCriteriaDateModified register={register} title="Modified Date" />
      </div>
    </form>
  );
}
