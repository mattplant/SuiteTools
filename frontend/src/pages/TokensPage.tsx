import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getToken } from '../components/token/getRecord.ts';
import { getTokens, addTokenLastLogins } from '../components/token/getRecords.ts';
import { Token } from '../components/token/types.ts';
import { RecordCriteria } from '../components/token/RecordCriteria.tsx';
import { Results } from '../components/results/Results.tsx';
import { ResultsTypes } from '../components/results/types.ts';
import { useAppSettingsContext } from '../components/AppSettingsContext';

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
  const [results, setResults] = useState<Token[]>([]);

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
