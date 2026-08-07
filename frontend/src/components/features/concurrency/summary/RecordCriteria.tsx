import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import type { CriteriaFields } from './types';
import { RecordCriteriaFieldDateRange } from './RecordCriteriaFieldDateRange';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  const { register, handleSubmit, setValue } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });

  function onSubmit(criteria: CriteriaFields) {
    setCriteria(criteria);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Button type="submit">Get Concurrency Summary</Button>
      <div className="flex gap-4 p-2.5">
        <RecordCriteriaFieldDateRange register={register} setValue={setValue} defaultValues={defaultCriteria} />
      </div>
    </form>
  );
}
