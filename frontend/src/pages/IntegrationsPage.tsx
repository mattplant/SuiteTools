import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/shared/criteria/types.ts';
import { getIntegration } from '../components/features/integration/getRecord.ts';
import { getIntegrations, addIntegrationLastLogins } from '../components/features/integration/getRecords.ts';
import { Integration } from 'shared';
import { RecordCriteria } from '../components/features/integration/RecordCriteria.tsx';
import { Results } from '../components/shared/results/Results.tsx';
import { ResultsTypes } from '../components/shared/results/types.ts';
import { useAppSettingsContext } from '../components/shared/context/AppSettingsContext.tsx';

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
