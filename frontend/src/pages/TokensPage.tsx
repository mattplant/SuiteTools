// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getToken } from '../adapters/api/token';
import { getTokens, addTokenLastLogins } from '../adapters/api/tokens';
import type { Tokens } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/token/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useAppSettingsContext } from '../hooks/useAppSettingsContext';
import { useErrorBoundaryTrigger } from '../hooks/useErrorBoundaryTrigger';
import { handleError, toArray } from '@suiteworks/suitetools-shared';

/**
 * Tokens page — list TBA tokens with criteria filters.
 * @returns The rendered Tokens page.
 */
export function TokensPage(): React.ReactElement {
  const { settings } = useAppSettingsContext();
  const triggerError = useErrorBoundaryTrigger();

  const defaultCriteria: CriteriaFields = {
    active: 'T',
    integrationName: '',
    userName: '',
    roleName: '',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Tokens>([]);

  useEffect(() => {
    let ignore = false;

    async function fetchData(): Promise<void> {
      try {
        const data = await getTokens(criteria);
        const normalized = toArray<Tokens[number]>(data);
        addTokenLastLogins(normalized, settings);
        if (!ignore) {
          setResults(normalized);
        }
      } catch (err) {
        if (!ignore) {
          setResults([]);
        }
        handleError(err, { reactTrigger: triggerError });
      }
    }

    fetchData();
    return (): void => {
      ignore = true;
    };
  }, [criteria, settings, triggerError]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Tokens</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.TOKEN} lines={results} getModalData={getToken} />
    </div>
  );
}
