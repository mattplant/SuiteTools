import { useForm } from 'react-hook-form';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaIntegrations } from '../criteria/SearchCriteriaIntegrations';

interface RecordsCriteriaProps {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordsCriteria({ defaultCriteria, setCriteria }: RecordsCriteriaProps) {
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
        Get SOAP Logs
      </button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaIntegrations register={register} />
      </div>
    </form>
  );
}
