// SPDX-License-Identifier: GPL-3.0-or-later

import { useLoaderData } from 'react-router-dom';
import { RoleBundle } from '@suiteworks/suitetools-shared';
import { RoleResult } from '../components/features/role/RecordResult';
import type { RoleLoaderData } from '../routes/roleLoader';

/**
 * Renders the role page with role details.
 * @returns The rendered role page component.
 */
export function RolePage(): JSX.Element {
  const { role } = useLoaderData() as RoleLoaderData;
  RoleBundle.assert(role);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Role</h2>
      <br />
      <RoleResult data={role} />
    </div>
  );
}
