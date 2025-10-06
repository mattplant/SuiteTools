import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../../shared/criteria/types';
import { getToken } from '../token/getRecord';
import { getTokens } from '../token/getRecords';
import type { Tokens } from '@suiteworks/suitetools-shared';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';

type Props = {
  integrationName: string;
};

export function IntegrationTokens({ integrationName }: Props) {
  const [results, setResults] = useState<Tokens>([]);

  useEffect(() => {
    const criteria: CriteriaFields = {
      active: 'T',
      integrationName: integrationName,
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
  }, [integrationName]);

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Tokens</h3>
      <Results type={ResultsTypes.TOKEN} lines={results} getModalData={getToken} />
    </>
  );
}
