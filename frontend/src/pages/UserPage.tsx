// SPDX-License-Identifier: GPL-3.0-or-later

import { useLoaderData } from 'react-router-dom';
import { UserResult } from '../components/features/user/RecordResult';
import { UserLogins } from '../components/features/user/UserLogins';
import { UserTokens } from '../components/features/user/UserTokens';
import type { UserLoaderData } from '../routes/userLoader';

/**
 * Renders the user page with user details, logins, and tokens.
 * @returns The rendered user page component.
 */
export function UserPage(): React.JSX.Element {
  const { user } = useLoaderData() as UserLoaderData;

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">User</h2>
      <br />
      <UserResult data={user} />
      <UserLogins userId={String(user.id)} />
      <UserTokens userName={user.name} />
    </div>
  );
}
