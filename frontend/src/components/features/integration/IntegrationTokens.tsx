import { useEffect, useState } from 'react';
import type { CriteriaFields } from '../../shared/criteria/types';
import { getToken } from '../../../adapters/api/token';
import { getTokens } from '../../../adapters/api/tokens';
import { integrationLookupKey } from '../../../adapters/api/integrationsScrape';
import type { Token, Tokens } from '@suiteworks/suitetools-shared';
import { handleError } from '@suiteworks/suitetools-shared';
import { Results } from '../../shared/results/Results';
import { ResultsTypes } from '../../shared/results/types';
import { useErrorBoundaryTrigger } from '../../../hooks/useErrorBoundaryTrigger';

type Props = {
  integrationName: string;
};

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

export function IntegrationTokens({ integrationName }: Props) {
  const triggerError = useErrorBoundaryTrigger();
  const [results, setResults] = useState<Tokens>([]);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      if (!integrationName.trim()) {
        setResults([]);
        return;
      }

      const criteria: CriteriaFields = {
        active: 'T',
        integrationName,
      };

      try {
        const data = await getTokens(criteria);
        // Enforce integration scope even if the adapter filter is bypassed or names differ.
        const scoped = tokensForIntegration(data, integrationName);
        if (!ignore) {
          setResults(scoped);
        }
      } catch (error) {
        if (!ignore) {
          setResults([]);
        }
        handleError(error, { reactTrigger: triggerError });
      }
    }
    fetchData();

    return () => {
      ignore = true;
    };
  }, [integrationName, triggerError]);

  return (
    <>
      <br />
      <h3 className="text-lg font-bold text-slate-900">Tokens</h3>
      <Results type={ResultsTypes.TOKEN} lines={results} getModalData={getToken} />
    </>
  );
}
