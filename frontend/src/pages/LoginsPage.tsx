import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getLogins } from '../components/login/getRecords.ts';
import { Login } from '../components/login/types.ts';
import { RecordsCriteria } from '../components/login/RecordsCriteria.tsx';
import { Results } from '../components/results/Results.tsx';
import { ResultsTypes } from '../components/results/types.ts';
import { getLoginFromResults } from '../components/login/getRecordFromResults.ts';

export function LoginsPage() {
  const defaultCriteria: CriteriaFields = {
    rows: 250,
    active: '',
    integrationName: '',
    tokenName: '',
    users: [''],
    roles: [''],
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Login[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getLogins(criteria);
        if (!('message' in data)) {
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    return () => {};
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Logins</h2>
      <RecordsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.LOGIN} lines={results} getModalData={getLoginFromResults} />
    </div>
  );
}
