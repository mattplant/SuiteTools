import { useForm } from 'react-hook-form';
import { NewSettingsData } from './types';

type Props = {
  onSave: (data: NewSettingsData) => void;
};

export function NewSettingsForm({ onSave }: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<NewSettingsData>();
  const fieldStyle = 'flex flex-col mb-2';

  return (
    <form noValidate className="border-b py-4" onSubmit={handleSubmit(onSave)}>
      <div className={fieldStyle}>
        <label htmlFor="devMode" className="block text-sm font-medium text-slate-700">
          Dev Mode
        </label>
        <input type="checkbox" id="devMode" {...register('devMode')} />
      </div>
      <div className={fieldStyle}>
        <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded">
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
        {isSubmitSuccessful && (
          <div role="alert" className="text-green-500 text-xs mt-1">
            The settings were saved successfully.
          </div>
        )}
      </div>
    </form>
  );
}
