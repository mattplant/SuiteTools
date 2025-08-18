import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getRole } from '../components/features/role/getRecord';
import { getRoles } from '../components/features/role/getRecords';
import type { Roles } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/role/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';

export function RolesPage() {
  const defaultCriteria: CriteriaFields = {
    active: '',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Roles>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getRoles(criteria);
        if (!('message' in data)) {
          setResults(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();

    return () => {};
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Roles</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.ROLE} lines={results} getModalData={getRole} />
    </div>
  );
}
