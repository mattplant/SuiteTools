// SPDX-License-Identifier: GPL-3.0-or-later

import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { RoleBundle } from '@suiteworks/suitetools-shared';
import { RoleResult } from '../components/features/role/RecordResult';
import type { RoleLoaderData } from '../routes/roleLoader';

export function RolePage() {
  const data = useLoaderData() as RoleLoaderData;
  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Role</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.role}>
          {(record) => {
            // TODO: is this now redundant?
            RoleBundle.assert(record);

            return <RoleResult data={record} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
