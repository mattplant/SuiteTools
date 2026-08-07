// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from '../../shared/criteria/types';
import { getLogins } from '../../../adapters/api/logins';
import { getLoginFromResults } from '../../../adapters/api/login';
import type { Login } from '@suiteworks/suitetools-shared';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';
import { useEntityList } from '../../../hooks/useEntityList';

type Props = {
  userId: string;
};

/**
 * Nested logins list for a user detail page.
 * @param props - Component props.
 * @param props.userId - User internal id filter.
 * @returns The rendered logins section.
 */
export function UserLogins({ userId }: Props): React.ReactElement {
  const { results } = useEntityList<Login, CriteriaFields>({
    defaultCriteria: { users: [String(userId)] },
    fetchList: () => getLogins({ users: [String(userId)] }),
    deps: [userId],
  });

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Logins</h3>
      <Results type={ResultsTypes.LOGIN} lines={results} getModalData={getLoginFromResults} />
    </>
  );
}
