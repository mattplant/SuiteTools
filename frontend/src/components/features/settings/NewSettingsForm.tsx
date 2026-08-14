// SPDX-License-Identifier: GPL-3.0-or-later

import { useForm } from "react-hook-form";
import { Button } from "flowbite-react";
import type { NewSettings } from "@suiteworks/suitetools-shared";

type Props = { defaultValues: NewSettings; onSave: (data: NewSettings) => void | Promise<void> };

export function NewSettingsForm({ defaultValues, onSave }: Props) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, isSubmitSuccessful },
  } = useForm<NewSettings>({ defaultValues: { ...defaultValues, devMode: Boolean(defaultValues.devMode) } });
  const fieldStyle = "flex flex-col mb-2";

  return (
    <form
      noValidate
      className="border-b border-gray-200 py-4"
      onSubmit={handleSubmit((data) => onSave({ ...data, devMode: Boolean(data.devMode) }))}
    >
      <div className={fieldStyle}>
        <label htmlFor="devMode" className="block text-sm font-medium text-slate-700">
          Dev Mode
        </label>
        <input type="checkbox" id="devMode" {...register("devMode", { setValueAs: (value) => Boolean(value) })} />
      </div>
      <div className={fieldStyle}>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save"}
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
