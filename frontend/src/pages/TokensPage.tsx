import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getToken } from '../components/features/token/getRecord';
import { getTokens, addTokenLastLogins } from '../components/features/token/getRecords';
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
    tokenName: '',
    // users: '',
    // roles: '',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Tokens>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getTokens(criteria);
        addTokenLastLogins(data, settings);
        setResults(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    return () => {};
  }, [criteria, settings]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Tokens</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.TOKEN} lines={results} getModalData={getToken} />
    </div>
  );
}
