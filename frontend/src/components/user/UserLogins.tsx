import { useEffect, useState } from 'react';
import { CriteriaFields } from '../criteria/types.ts';
import { getLogins } from '../login/getRecords.ts';
import { Login } from '../login/types.ts';
import { Results } from '../results/Results.tsx';
import { ResultsTypes } from '../results/types.ts';
import { getLoginFromResults } from '../login/getRecordFromResults.ts';

type Props = {
  userId: string;
};

export function UserLogins({ userId }: Props) {
  console.log('UserLogins userId', userId);
  const [results, setResults] = useState<Login[]>([]);

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
