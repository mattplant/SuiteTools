import { useForm } from 'react-hook-form';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaActive } from '../criteria/SearchCriteriaActive';
import { SearchCriteriaIntegrationName } from '../criteria/SearchCriteriaIntegrationName';
import { SearchCriteriaRoleName } from '../criteria/SearchCriteriaRoleName';
import { SearchCriteriaUserName } from '../criteria/SearchCriteriaUserName';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ defaultCriteria, setCriteria }: Props) {
  const { register, handleSubmit } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });

  function onSubmit(criteria: CriteriaFields) {
    setCriteria(criteria);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-3 py-2 text-center"
      >
        Get Tokens
      </button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaActive register={register} />
        <SearchCriteriaIntegrationName register={register} />
        <SearchCriteriaUserName register={register} />
        <SearchCriteriaRoleName register={register} />
      </div>
    </form>
  );
}
