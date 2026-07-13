import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getToken } from '../adapters/api/token';
import { getTokens, addTokenLastLogins } from '../adapters/api/tokens';
import type { Tokens } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/token/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useAppSettingsContext } from '../hooks/useAppSettingsContext';

export function TokensPage() {
  const { settings } = useAppSettingsContext();
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

    async function fetchData() {
      try {
        const data = await getTokens(criteria);
        addTokenLastLogins(data, settings);
        if (!ignore) {
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (!ignore) {
          setResults([]);
        }
      }
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [criteria, settings]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Tokens</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.TOKEN} lines={results} getModalData={getToken} />
    </div>
  );
}
