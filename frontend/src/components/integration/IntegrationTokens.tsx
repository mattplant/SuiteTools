import { useEffect, useState } from 'react';
// import { assertIsIntegration, Integration } from '../integration/types';
// import { IntegrationResult } from '../integration/RecordResult';

import { CriteriaFields } from '../criteria/types.ts';
import { getToken } from '../token/getRecord.ts';
import { getTokens } from '../token/getRecords.ts';
import { Token } from '../token/types.ts';

import { Results } from '../results/Results.tsx';
import { ResultsTypes } from '../results/types.ts';

export function IntegrationTokens() {
  const criteria: CriteriaFields = {
    active: 'T',
  };
  const [results, setResults] = useState<Token[]>([]);

  useEffect(() => {
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
  });

  return (
    <>
      <br />
      <h3 className="font-bold text-slate-900">Tokens</h3>
      <Results type={ResultsTypes.TOKEN} lines={results} getModalData={getToken} />
    </>
  );
}
