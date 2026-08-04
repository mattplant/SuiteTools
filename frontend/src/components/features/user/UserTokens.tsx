import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../../shared/criteria/types';
import { getToken } from '../../../adapters/api/token';
import { getTokens } from '../../../adapters/api/tokens';
import type { Tokens } from '@suiteworks/suitetools-shared';
import { handleError } from '@suiteworks/suitetools-shared';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';
import { useErrorBoundaryTrigger } from '../../../hooks/useErrorBoundaryTrigger';

type Props = {
  userName: string;
};

export function UserTokens({ userName }: Props) {
  const triggerError = useErrorBoundaryTrigger();
  const [results, setResults] = useState<Tokens>([]);

  useEffect(() => {
    let ignore = false;
    const criteria: CriteriaFields = {
      active: 'T',
      userName: userName,
    };

    async function fetchData() {
      try {
        const data = await getTokens(criteria);
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
  }, [userName, triggerError]);

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Tokens</h3>
      <Results type={ResultsTypes.TOKEN} lines={results} getModalData={getToken} />
    </>
  );
}
