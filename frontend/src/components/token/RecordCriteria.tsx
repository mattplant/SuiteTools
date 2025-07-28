import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
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
      <Button type="submit">Get Tokens</Button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaActive register={register} />
        <SearchCriteriaIntegrationName register={register} />
        <SearchCriteriaUserName register={register} />
        <SearchCriteriaRoleName register={register} />
      </div>
    </form>
  );
}
