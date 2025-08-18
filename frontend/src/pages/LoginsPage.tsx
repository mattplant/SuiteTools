import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';

// TODO: switch from getLoginFromResults to getLogin
// import { getLogin } from '../components/features/login/getRecord';
import { getLoginFromResults } from '../components/features/login/getRecordFromResults';

import { getLogins } from '../components/features/login/getRecords';
import type { Logins } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/login/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';

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
  const [results, setResults] = useState<Logins>([]);

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
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.LOGIN} lines={results} getModalData={getLoginFromResults} />
    </div>
  );
}
