// SPDX-License-Identifier: GPL-3.0-or-later

import type { CriteriaFields } from "../../shared/criteria/types";
import { getToken } from "../../../adapters/api/token";
import { getTokens } from "../../../adapters/api/tokens";
import { integrationLookupKey } from "../../../adapters/api/integrationsScrape";
import type { Token, Tokens } from "@suiteworks/suitetools-shared";
import { Results } from "../../shared/results/Results";
import { ResultsTypes } from "../../shared/results/types";
import { useEntityList } from "../../../hooks/useEntityList";

type Props = { integrationName: string };

/**
 * Keep tokens that belong to the given integration application.
 * Matches SuiteQL `integrationName`, with a TBA token-name prefix fallback.
 * @param tokens - Full token list from the API.
 * @param integrationName - Integration display name from the detail page.
 */
function tokensForIntegration(tokens: Tokens, integrationName: string): Tokens {
  const key = integrationLookupKey(integrationName);
  if (!key) {
    return [];
  }

  return tokens.filter((token: Token) => {
    if (integrationLookupKey(token.integrationName) === key) {
      return true;
    }
    // TBA token names are often "Integration Name - User, Role"
    return integrationLookupKey(token.name).startsWith(`${key} -`);
  });
}

/**
 * Nested tokens list for an integration detail page.
 * @param props - Component props.
 * @param props.integrationName - Integration display name filter.
 * @returns The rendered tokens section.
 */
export function IntegrationTokens({ integrationName }: Props): React.ReactElement {
  const { results } = useEntityList<Tokens[number], CriteriaFields>({
    defaultCriteria: { active: "T", integrationName },
    deps: [integrationName],
    fetchList: async () => {
      if (!integrationName.trim()) {
        return [];
      }
      const data = await getTokens({ active: "T", integrationName });
      // Enforce integration scope even if the adapter filter is bypassed or names differ.
      return tokensForIntegration(data, integrationName);
    },
  });

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Tokens</h3>
      <Results type={ResultsTypes.TOKEN} lines={results} getModalData={getToken} />
    </>
  );
}
