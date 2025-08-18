import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { RoleBundle } from '@suiteworks/suitetools-shared';
import { RoleResult } from '../components/features/role/RecordResult';

export function RolePage() {
  const data = useLoaderData();

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Role</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data}>
          {(record) => {
            RoleBundle.assert(record);
            return <RoleResult data={record} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}
