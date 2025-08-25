import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { UserBundle } from '@suiteworks/suitetools-shared';
import { UserResult } from '../components/features/user/RecordResult';
import { UserLogins } from '../components/features/user/UserLogins';
import { UserTokens } from '../components/features/user/UserTokens';
import type { UserLoaderData } from '../routes/userLoader';

export function UserPage() {
  const data = useLoaderData() as UserLoaderData;
  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">User</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.user}>
          {(record) => {
            // TODO: is this now redundant?
            UserBundle.assert(record);

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
