import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaActive } from '../criteria/SearchCriteriaActive';
import { SearchCriteriaOwners } from '../criteria/SearchCriteriaOwners';
import { SearchCriteriaRoles } from '../criteria/SearchCriteriaRoles';

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
      <Button type="submit">Get Users</Button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaActive register={register} />
        <SearchCriteriaRoles register={register} />
        <SearchCriteriaOwners register={register} title="Supervisors" />
      </div>
    </form>
  );
}
