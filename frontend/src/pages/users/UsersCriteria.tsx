import { useForm } from 'react-hook-form';
import { CriteriaFields } from '../../components/search/criteria/types';
import { SearchCriteriaActive } from '../../components/search/criteria/SearchCriteriaActive';
import { SearchCriteriaOwner } from '../../components/search/criteria/SearchCriteriaOwner';
import { SearchCriteriaRole } from '../../components/search/criteria/SearchCriteriaRole';

interface UsersCriteriaProps {
  setCriteria: (criteria: CriteriaFields) => void;
}

export function UsersCriteria({ setCriteria }: UsersCriteriaProps) {
  const defaultCriteria: CriteriaFields = {
    active: '',
    role: [''],
    owner: [''],
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
        Get Users
      </button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaActive register={register} />
        <SearchCriteriaRole register={register} />
        <SearchCriteriaOwner register={register} title="Supervisor" />
      </div>
    </form>
  );
}
