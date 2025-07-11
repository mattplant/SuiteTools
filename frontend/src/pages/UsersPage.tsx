import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getUser } from '../components/user/getRecord.ts';
import { getUsers } from '../components/user/getRecords.ts';
import { User } from '../components/user/types.ts';
import { RecordCriteria } from '../components/user/RecordCriteria.tsx';
import { Results } from '../components/results/Results.tsx';
import { ResultsTypes } from '../components/results/types.ts';

export function UsersPage() {
  const defaultCriteria: CriteriaFields = {
    active: '',
    roles: [''],
    owners: [''],
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<User[]>([]);

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
