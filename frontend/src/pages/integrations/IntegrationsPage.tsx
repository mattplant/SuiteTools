import { useEffect, useState } from 'react';
import { CriteriaFields } from '../../components/search/criteria/types.ts';
import { getIntegrations } from './getIntegrations.ts';
import { Integration } from './types.ts';
import { IntegrationsCriteria } from './IntegrationsCriteria.tsx';
import { IntegrationsResults } from './IntegrationsResults.tsx';

export function IntegrationsPage() {
  const defaultCriteria: CriteriaFields = {
    // status: '',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Integration[]>([]);

  useEffect(() => {
    console.log('IntegrationsPage useEffect');
    async function fetchData() {
      try {
        const data = await getIntegrations(criteria);
        setResults(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    return () => {
      console.log('IntegrationsPage useEffect cleanup');
    };
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Integrations</h2>
      <IntegrationsCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <IntegrationsResults lines={results} />
    </div>
  );
}
