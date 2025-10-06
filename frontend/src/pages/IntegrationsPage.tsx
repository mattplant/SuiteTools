import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getIntegration } from '../components/features/integration/getRecord';
import { getIntegrations, addIntegrationLastLogins } from '../components/features/integration/getRecords';
import type { Integrations } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/integration/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';
import { useAppSettingsContext } from '../hooks/useAppSettingsContext';

export function IntegrationsPage() {
  const { settings } = useAppSettingsContext();
  const defaultCriteria: CriteriaFields = {
    active: 'T',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Integrations>([]);

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
