// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Shared UI component for rendering a compact, accessible list of entity fields.
 * @file EntityFields.tsx
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import React from 'react';

export type EntityField = {
  label: string;
  value: React.ReactNode;
};

type EntityFieldsProps = {
  fields: EntityField[];
  className?: string;
};

/**
 * Accessible field/value list using <dl>.
 * Intended for entity detail views after Schema → Adapter → View transformation.
 * @param props - The props object.
 * @param props.fields - The list of fields to display.
 * @param [props.className] - Optional additional class names.
 * @returns The rendered field/value list.
 */
export function EntityFields({ fields, className = '' }: EntityFieldsProps): JSX.Element {
  return (
    <dl className={['grid grid-cols-[max-content_1fr] gap-x-2 gap-y-1', className].filter(Boolean).join(' ')}>
      {fields.map(({ label, value }) => (
        <React.Fragment key={label}>
          <dt key={`${label}-field`} className="font-bold">
            {label}
          </dt>
          <dd key={`${label}-value`}>{value ?? '—'}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
