import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { assertIsUser, User } from '../components/features/user/types';
import { UserResult } from '../components/features/user/RecordResult';
import { UserLogins } from '../components/features/user/UserLogins';
import { UserTokens } from '../components/features/user/UserTokens';

export function UserPage() {
  const data = useLoaderData();
  assertIsData(data);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">User</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.user}>
          {(record) => {
            assertIsUser(record);
            return (
              <>
                <UserResult data={record} />
                <UserLogins userId={String(record.id)} />
                <UserTokens userName={record.name} />
              </>
            );
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
