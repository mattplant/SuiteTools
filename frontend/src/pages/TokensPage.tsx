// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from "../components/shared/criteria/types";
import { getToken } from "../adapters/api/token";
import { getTokens, addTokenLastLogins } from "../adapters/api/tokens";
import type { Tokens } from "@suiteworks/suitetools-shared";
import { toArray } from "@suiteworks/suitetools-shared";
import { RecordCriteria } from "../components/features/token/RecordCriteria";
import { Results } from "../components/shared/results/Results";
import { ResultsTypes } from "../components/shared/results/types";
import { useAppSettingsContext } from "../hooks/useAppSettingsContext";
import { useEntityList } from "../hooks/useEntityList";

/**
 * Tokens page — list TBA tokens with criteria filters.
 * @returns The rendered Tokens page.
 */
export function TokensPage(): React.ReactElement {
  const { settings } = useAppSettingsContext();

  const defaultCriteria: CriteriaFields = { active: "T", integrationName: "", userName: "", roleName: "" };

  const { setCriteria, results } = useEntityList({
    defaultCriteria,
    deps: [settings],
    fetchList: async (criteria): Promise<Tokens> => {
      const data = await getTokens(criteria);
      return addTokenLastLogins(toArray<Tokens[number]>(data), settings);
    },
  });

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold text-slate-900 mb-2">Tokens</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      <Results type={ResultsTypes.TOKEN} lines={results} getModalData={getToken} />
    </div>
  );
}
