import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getTokens } from '../components/token/getRecords.ts';
import { Token } from '../components/token/types.ts';
import { RecordsCriteria } from '../components/token/RecordsCriteria.tsx';
import { RecordsResults } from '../components/token/RecordsResults.tsx';

export function TokensPage() {
  const defaultCriteria: CriteriaFields = {
    active: 'T',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
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
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Tokens</h2>
      <RecordsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <RecordsResults lines={results} />
    </div>
  );
}
