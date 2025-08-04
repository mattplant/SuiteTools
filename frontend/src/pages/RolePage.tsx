import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsRole, Role } from '../components/features/role/types';
import { RoleResult } from '../components/features/role/RecordResult';

export function RolePage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Role</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.role}>
          {(role) => {
            assertIsRole(role);
            return <RoleResult data={role} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type Data = {
  role: Role;
};

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('role' in data)) {
    throw new Error('Data does not contain role');
  }
}
