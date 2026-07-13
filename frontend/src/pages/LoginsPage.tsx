import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getLoginFromResults } from '../adapters/api/login';
import { getLogins } from '../adapters/api/logins';
import type { Logins } from '@suiteworks/suitetools-shared';
import { handleError, toArray } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/login/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useErrorBoundaryTrigger } from '../hooks/useErrorBoundaryTrigger';

export function LoginsPage() {
  const triggerError = useErrorBoundaryTrigger();
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
    let ignore = false;

    async function fetchData() {
      try {
        const data = await getLogins(criteria);
        if (!ignore) {
          setResults(toArray(data));
        }
      } catch (error) {
        if (!ignore) {
          setResults([]);
        }
        try {
          handleError(error, { reactTrigger: triggerError });
        } catch {
          // handleError always throws after logging/triggering
        }
      }
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [criteria, triggerError]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Logins</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.LOGIN} lines={results} getModalData={getLoginFromResults} />
    </div>
  );
}
