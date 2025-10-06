import { useForm } from 'react-hook-form';
import { Button } from 'flowbite-react';
import { NewSettings } from './types';

type Props = {
  onSave: (data: NewSettings) => void;
};

export function NewSettingsForm({ onSave }: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<NewSettings>();
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
        {isSubmitSuccessful && (
          <div role="alert" className="text-green-500 text-xs mt-1">
            The settings were saved successfully.
          </div>
        )}
      </div>
    </form>
  );
}
