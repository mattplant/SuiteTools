import { useEffect, useState } from 'react';
import { CriteriaFields } from '../../shared/criteria/types.ts';
import { getToken } from '../token/getRecord.ts';
import { getTokens } from '../token/getRecords.ts';
import { Token } from '../token/types.ts';
import { Results } from '../../shared/results/Results.tsx';
import { ResultsTypes } from '../../shared/results/types.ts';

type Props = {
  userName: string;
};

export function UserTokens({ userName }: Props) {
  const [results, setResults] = useState<Token[]>([]);

  useEffect(() => {
    const criteria: CriteriaFields = {
      active: 'T',
      userName: userName,
    };
    async function fetchData() {
      try {
        const data = await getTokens(criteria);
        setResults(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    return () => {};
  }, [userName]);

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Tokens</h3>
      <Results type={ResultsTypes.TOKEN} lines={results} getModalData={getToken} />
    </>
  );
}
