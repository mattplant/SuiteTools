import { useForm } from 'react-hook-form';
import { CriteriaFields } from './types';
import { RecordCriteriaFieldDateRange } from './RecordCriteriaFieldDateRange';

interface Props {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordCriteria({ setCriteria, defaultCriteria }: Props) {
  const { register } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });

  function onChange(criteria: CriteriaFields) {
    console.log('onChange() initiated', { criteria });
    setCriteria(criteria);
  }

  return <RecordCriteriaFieldDateRange register={register} onChange={onChange} />;
}
