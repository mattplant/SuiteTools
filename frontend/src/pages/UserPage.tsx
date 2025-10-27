import { Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import { UserResult } from '../components/features/user/RecordResult';
import { UserLogins } from '../components/features/user/UserLogins';
import { UserTokens } from '../components/features/user/UserTokens';
import type { UserLoaderData } from '../routes/userLoader';

/**
 * Renders the user page with user details, logins, and tokens.
 * @returns The rendered user page component.
 */
export function UserPage(): JSX.Element {
  const data = useLoaderData() as UserLoaderData;

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">User</h2>
      <br />
      <Suspense fallback={<div>Fetching...</div>}>
        <Await resolve={data.user}>
          {(record) => {
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
