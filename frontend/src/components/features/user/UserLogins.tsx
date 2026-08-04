import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../../shared/criteria/types';
import { getLogins } from '../../../adapters/api/logins';
import { getLoginFromResults } from '../../../adapters/api/login';
import type { Login } from '@suiteworks/suitetools-shared';
import { handleError } from '@suiteworks/suitetools-shared';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';
import { useErrorBoundaryTrigger } from '../../../hooks/useErrorBoundaryTrigger';

type Props = {
  userId: string;
};

export function UserLogins({ userId }: Props) {
  const triggerError = useErrorBoundaryTrigger();
  const [results, setResults] = useState<readonly Login[]>([]);

  useEffect(() => {
    let ignore = false;
    const criteria: CriteriaFields = {
      users: [String(userId)],
    };

    async function fetchData() {
      try {
        const data = await getLogins(criteria);
        if (!ignore) {
          setResults(data);
        }
      } catch (error) {
        if (!ignore) {
          setResults([]);
        }
        handleError(error, { reactTrigger: triggerError });
      }
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [userId, triggerError]);

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Logins</h3>
      <Results type={ResultsTypes.LOGIN} lines={results} getModalData={getLoginFromResults} />
    </>
  );
}
