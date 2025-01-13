import { useForm } from 'react-hook-form';
import { CriteriaFields } from './types';
import { RecordsCriteriaFieldDateRange } from './RecordsCriteriaFieldDateRange';

interface RecordsCriteriaProps {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function RecordsCriteria({ setCriteria, defaultCriteria }: RecordsCriteriaProps) {
  const { register } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });

  function onChange(criteria: CriteriaFields) {
    console.log('onChange() initiated', { criteria });
    setCriteria(criteria);
  }

  return <RecordsCriteriaFieldDateRange register={register} onChange={onChange} />;
}
