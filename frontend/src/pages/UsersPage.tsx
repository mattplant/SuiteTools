import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getUser } from '../adapters/api/user';
import { getUsers, toUsersArray } from '../adapters/api/users';
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
    let ignore = false;

    async function fetchData() {
      try {
        const data = await getUsers(criteria);
        const normalized = toUsersArray(data);
        if (!ignore) {
          setResults(normalized);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        if (!ignore) {
          setResults([]); // fail safe: still give empty array
        }
      }
    }

    fetchData();
    return () => {
      ignore = true;
    };
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Users</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.USER} lines={results} getModalData={getUser} />
    </div>
  );
}
