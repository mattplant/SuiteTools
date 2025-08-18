import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getUser } from '../components/features/user/getRecord';
import { getUsers } from '../components/features/user/getRecords';
import type { Users } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/user/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';

export function UsersPage() {
  const defaultCriteria: CriteriaFields = {
    active: '',
    roles: [''],
    owners: [''],
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Users>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsers(criteria);
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
      <h2 className="text-xl font-bold text-slate-900 mb-2">Users</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.USER} lines={results} getModalData={getUser} />
    </div>
  );
}
