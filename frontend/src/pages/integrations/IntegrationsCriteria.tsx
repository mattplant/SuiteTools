import { useForm } from 'react-hook-form';
import { CriteriaFields } from '../../components/search/criteria/types';
// TODO add integration status search criteria field

interface IntegrationsCriteriaProps {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
}

export function IntegrationsCriteria({ setCriteria, defaultCriteria }: IntegrationsCriteriaProps) {
  const { register, handleSubmit } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });

  // TODO remove next line when integration status search criteria field is added
  console.log('register', register);

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
        Get Integrations
      </button>
      <div className="flex gap-4 p-2.5">{/* // TODO add integration status search criteria field */}</div>
    </form>
  );
}
