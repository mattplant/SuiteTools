// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The form shell every search screen builds its criteria controls inside.
 *
 * @fileoverview
 * Owns the `react-hook-form` instance and hands `register`, `control` and `setValue` back to
 * the screen through `RecordCriteriaFormApi`, so each screen supplies its own set of criteria
 * controls while submit handling and layout stay here. Eleven modules outside this directory
 * render it.
 *
 * @remarks
 * The form owns the hook instance rather than receiving one — child criteria components take
 * `register` as a prop precisely so they never create a second form context. `defaultCriteria`
 * seeds the form, so a screen changing its defaults changes what a bare submit sends.
 *
 * @see ./types.ts – the CriteriaFields shape being registered
 * @see ./SearchCriteriaActive.tsx – a representative child control
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { ReactNode } from "react";
import { Button } from "flowbite-react";
import { useForm, type Control, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import type { CriteriaFields } from "./types";

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
  const { register, handleSubmit, control, setValue } = useForm<CriteriaFields>({ defaultValues: defaultCriteria });

  return (
    <form onSubmit={handleSubmit(setCriteria)}>
      <Button type="submit">{submitLabel}</Button>
      {actions}
      <div className="flex gap-4 p-2.5">{children({ register, control, setValue })}</div>
    </form>
  );
}
