// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from "../components/shared/criteria/types";
import { getIntegrationModalData } from "../adapters/api/integration";
import { getIntegrations, addIntegrationLastLogins } from "../adapters/api/integrations";
import type { Integrations } from "@suiteworks/suitetools-shared";
import { RecordCriteria } from "../components/features/integration/RecordCriteria";
import { Results } from "../components/shared/results/Results";
import { ResultsTypes } from "../components/shared/results/types";
import { useAppSettingsContext } from "../hooks/useAppSettingsContext";
import { useEntityList } from "../hooks/useEntityList";

/**
 * Integrations list page (Manage Integrations scrape + last-login enrich).
 * @returns The rendered Integrations page.
 */
export function IntegrationsPage(): React.ReactElement {
  const { settings } = useAppSettingsContext();
  const defaultCriteria: CriteriaFields = { active: "" };

  const { setCriteria, results, statusMessage } = useEntityList<Integrations[number], CriteriaFields>({
    defaultCriteria,
    deps: [settings],
    fetchList: async (criteria) => addIntegrationLastLogins(await getIntegrations(criteria), settings),
    getStatusMessage: (rows) => {
      if (rows.length === 0) {
        return "No integrations matched the current filter. Try State = All.";
      }
      if (rows.some((row) => !row.dateCreated)) {
        return "Date Created could not be read for some integrations from the NetSuite list page.";
      }
      return null;
    },
  });

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Integrations</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      {statusMessage ? <p className="mb-2 text-sm text-amber-700">{statusMessage}</p> : null}
      <Results type={ResultsTypes.INTEGRATION} lines={results} getModalData={getIntegrationModalData} />
    </div>
  );
}
