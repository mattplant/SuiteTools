import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getUser } from '../adapters/api/user';
import { getUsers } from '../adapters/api/users';
import type { Users } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/user/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useErrorBoundaryTrigger } from '../hooks/useErrorBoundaryTrigger';
import { handleError, toArray } from '@suiteworks/suitetools-shared';

/**
 * UsersPage component displays the users list and criteria filter.
 * @returns The rendered UsersPage component.
 */
export function UsersPage(): React.ReactElement {
  const triggerError = useErrorBoundaryTrigger();

  const defaultCriteria: CriteriaFields = {
    active: '',
    roles: [''],
    owners: [''],
  };

  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Users>([]);

  useEffect(() => {
    let ignore = false;

    async function fetchData(): Promise<void> {
      try {
        const data = await getUsers(criteria);
        const normalized = toArray<Users[number]>(data);
        if (!ignore) {
          setResults(normalized);
        }
      } catch (err) {
        if (!ignore) {
          setResults([]); // fail safe: still give empty array
        }
        handleError(err, { reactTrigger: triggerError });
      }
    }

    fetchData();
    return (): void => {
      ignore = true;
    };
  }, [criteria, triggerError]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Users</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.USER} lines={results} getModalData={getUser} />
    </div>
  );
}
