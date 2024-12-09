import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getIntegrations } from '../components/integration/getRecords.ts';
import { Integration } from '../components/integration/types.ts';
import { RecordsCriteria } from '../components/integration/RecordsCriteria.tsx';
import { RecordsResults } from '../components/integration/RecordsResults.tsx';

export function IntegrationsPage() {
  const defaultCriteria: CriteriaFields = {
    active: 'T',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Integration[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getIntegrations(criteria);
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
      <h2 className="text-xl font-bold text-slate-900 mb-2">Integrations</h2>
      <RecordsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <RecordsResults lines={results} />
    </div>
  );
}
