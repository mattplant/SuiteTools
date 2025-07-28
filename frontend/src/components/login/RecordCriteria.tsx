import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaActive } from '../criteria/SearchCriteriaActive';
import { SearchCriteriaIntegrationName } from '../criteria/SearchCriteriaIntegrationName';
import { SearchCriteriaTokenName } from '../criteria/SearchCriteriaTokenName';
import { SearchCriteriaRoles } from '../criteria/SearchCriteriaRoles';
import { SearchCriteriaRows } from '../criteria/SearchCriteriaRows';
import { SearchCriteriaUsers } from '../criteria/SearchCriteriaUsers';

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
      <Button type="submit">Get Logins</Button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaRows register={register} />
        <SearchCriteriaActive register={register} title="Status" trueLabel="Success" falseLabel="Failure" />
        <SearchCriteriaIntegrationName register={register} title="OAuth Application" />
        <SearchCriteriaTokenName register={register} title="OAuth Access Token" />
        <SearchCriteriaUsers register={register} />
        <SearchCriteriaRoles register={register} />
        {/* TODO: Dates */}
      </div>
    </form>
  );
}
