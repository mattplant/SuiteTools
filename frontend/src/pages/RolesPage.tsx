import { useEffect, useState } from 'react';
import { CriteriaFields } from '../components/criteria/types.ts';
import { getRole } from '../components/role/getRecord.ts';
import { getRoles } from '../components/role/getRecords.ts';
import { Role } from '../components/role/types.ts';
import { RecordCriteria } from '../components/role/RecordCriteria.tsx';
import { Results } from '../components/results/Results.tsx';
import { ResultsTypes } from '../components/results/types.ts';

export function RolesPage() {
  const defaultCriteria: CriteriaFields = {
    active: '',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Role[]>([]);

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
