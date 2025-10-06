import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../../shared/criteria/types';
import { getLogins } from '../login/getRecords';
import type { Login } from '@suiteworks/suitetools-shared';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';
import { getLoginFromResults } from '../login/getRecordFromResults';

type Props = {
  userId: string;
};

export function UserLogins({ userId }: Props) {
  console.log('UserLogins userId', userId);
  const [results, setResults] = useState<readonly Login[]>([]);

  useEffect(() => {
    const criteria: CriteriaFields = {
      users: [String(userId)],
    };
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
  }, [userId]);

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Logins</h3>
      <Results type={ResultsTypes.LOGIN} lines={results} getModalData={getLoginFromResults} />
    </>
  );
}
