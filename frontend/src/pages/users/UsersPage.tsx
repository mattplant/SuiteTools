import { useEffect, useState } from 'react';
import { CriteriaFields } from '../../components/search/criteria/types.ts';
import { getUsers } from './getUsers.ts';
import { User } from './types.ts';
import { UsersCriteria } from './UsersCriteria.tsx';
import { UsersResults } from './UsersResults.tsx';

export function UsersPage() {
  const [criteria, setCriteria] = useState<CriteriaFields>({
    active: '',
    role: [''],
    owner: [''],
  });
  const [results, setResults] = useState<User[]>([]);

  useEffect(() => {
    console.log('UsersPage useEffect');

    async function fetchData() {
      try {
        const data = await getUsers(criteria);
        setResults(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();

    return () => {
      console.log('UsersPage useEffect cleanup');
    };
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Users</h2>
      <UsersCriteria setCriteria={setCriteria} />
      <UsersResults lines={results} />
    </div>
  );
}
