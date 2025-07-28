import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getIntegration } from '../components/integration/getRecord.ts';
import { getIntegrations, addIntegrationLastLogins } from '../components/integration/getRecords.ts';
import { Integration } from '../components/integration/types.ts';
import { RecordCriteria } from '../components/integration/RecordCriteria.tsx';
import { Results } from '../components/results/Results.tsx';
import { ResultsTypes } from '../components/results/types.ts';
import { useAppSettingsContext } from '../context/AppSettingsContext.tsx';

export function IntegrationsPage() {
  const { settings } = useAppSettingsContext();
  const defaultCriteria: CriteriaFields = {
    active: 'T',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Integration[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getIntegrations(criteria);
        addIntegrationLastLogins(data, settings);
        setResults(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    return () => {};
  }, [criteria, settings]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Integrations</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.INTEGRATION} lines={results} getModalData={getIntegration} />
    </div>
  );
}
