// SPDX-License-Identifier: GPL-3.0-or-later

import type { ReactNode } from 'react';
import { Button } from 'flowbite-react';
import { useForm, type Control, type UseFormRegister, type UseFormSetValue } from 'react-hook-form';
import type { CriteriaFields } from './types';

export type RecordCriteriaFormApi = {
  register: UseFormRegister<CriteriaFields>;
  control: Control<CriteriaFields>;
  setValue: UseFormSetValue<CriteriaFields>;
};

type Props = {
  defaultCriteria: CriteriaFields;
  setCriteria: (criteria: CriteriaFields) => void;
  submitLabel: string;
  /** Extra controls beside the submit button (e.g. Jobs “Run Jobs”). */
  actions?: ReactNode;
  children: (api: RecordCriteriaFormApi) => ReactNode;
};

/**
 * Shared chrome for list-page criteria forms: `useForm`, submit button, field row.
 * Feature modules supply only the field composition via the render prop.
 */
export function RecordCriteriaForm({
  defaultCriteria,
  setCriteria,
  submitLabel,
  actions,
  children,
}: Props): React.ReactElement {
  const { register, handleSubmit, control, setValue } = useForm<CriteriaFields>({
    defaultValues: defaultCriteria,
  });

  return (
    <form onSubmit={handleSubmit(setCriteria)}>
      <Button type="submit">{submitLabel}</Button>
      {actions}
      <div className="flex gap-4 p-2.5">{children({ register, control, setValue })}</div>
    </form>
  );
}
