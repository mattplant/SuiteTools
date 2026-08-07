// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from '../../shared/criteria/types';
import { getToken } from '../../../adapters/api/token';
import { getTokens } from '../../../adapters/api/tokens';
import type { Tokens } from '@suiteworks/suitetools-shared';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';
import { useEntityList } from '../../../hooks/useEntityList';

type Props = {
  userName: string;
};

/**
 * Nested tokens list for a user detail page.
 * @param props - Component props.
 * @param props.userName - User name filter.
 * @returns The rendered tokens section.
 */
export function UserTokens({ userName }: Props): React.ReactElement {
  const { results } = useEntityList<Tokens[number], CriteriaFields>({
    defaultCriteria: { active: 'T', userName },
    fetchList: () => getTokens({ active: 'T', userName }),
    deps: [userName],
  });

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Tokens</h3>
      <Results type={ResultsTypes.TOKEN} lines={results} getModalData={getToken} />
    </>
  );
}
