import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { User } from './types';
import { assertIsUser } from './types';
import { UserResult } from './UserResult';

export function UserPage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">User</h2>
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.user}>
          {(user) => {
            assertIsUser(user);
            return <UserResult data={user} />;
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type Data = {
  user: User;
};

function assertIsData(data: unknown): asserts data is Data {
  if (typeof data !== 'object') {
    throw new Error('Data is not an object');
  }
  if (data === null) {
    throw new Error('Data is null');
  }
  if (!('user' in data)) {
    throw new Error('Data does not contain user');
  }
}
