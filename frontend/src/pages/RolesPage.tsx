// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../components/shared/criteria/types';
import { getRole } from '../adapters/api/role';
import { getRoles } from '../adapters/api/roles';
import type { Roles } from '@suiteworks/suitetools-shared';
import { RecordCriteria } from '../components/features/role/RecordCriteria';
import { Results } from '../components/shared/results/Results';
import { ResultsTypes } from '../components/shared/results/types';

/**
 * Renders the Roles page, allowing users to view and filter roles.
 * @returns The rendered Roles page component.
 */
export function RolesPage(): React.ReactElement {
  const defaultCriteria: CriteriaFields = {
    active: '',
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<Roles>([]);

  useEffect(() => {
    async function fetchData(): Promise<void> {
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

    return (): void => {};
  }, [criteria]);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Roles</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.ROLE} lines={results} getModalData={getRole} />
    </div>
  );
}
