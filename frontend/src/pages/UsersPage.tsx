import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getUsers } from '../components/user/getRecords.ts';
import { User } from '../components/user/types.ts';
import { RecordsCriteria } from '../components/user/RecordsCriteria.tsx';
import { RecordsResults } from '../components/user/RecordsResults.tsx';

export function UsersPage() {
  const defaultCriteria: CriteriaFields = {
    active: '',
    role: [''],
    owner: [''],
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getUsers(criteria);
        setResults(data);
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
      <RecordsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <RecordsResults lines={results} />
    </div>
  );
}
