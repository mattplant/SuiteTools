import { useForm } from 'react-hook-form';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaDateCreated } from '../criteria/SearchCriteriaDateCreated';
import { SearchCriteriaFileTypes } from '../criteria/SearchCriteriaFileTypes';
import { SearchCriteriaRows } from '../criteria/SearchCriteriaRows';
import { SearchCriteriaDateModified } from '../criteria/SearchCriteriaDateModified';

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
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-hidden focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center"
      >
        Get Files
      </button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaRows register={register} />
        <SearchCriteriaFileTypes register={register} />
        <SearchCriteriaDateCreated register={register} title="Created Date" />
        <SearchCriteriaDateModified register={register} title="Modified Date" />
      </div>
    </form>
  );
}
