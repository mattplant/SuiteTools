import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { CriteriaFields } from '../criteria/types';
import { SearchCriteriaIntegrations } from '../criteria/SearchCriteriaIntegrations';

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
      <Button type="submit">Get SOAP Logs</Button>
      <div className="flex gap-4 p-2.5">
        <SearchCriteriaIntegrations register={register} />
      </div>
    </form>
  );
}
