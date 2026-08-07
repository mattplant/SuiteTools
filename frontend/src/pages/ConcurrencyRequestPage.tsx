// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { CriteriaFields } from '../components/features/concurrency/request/types';
import { getConcurrencyRequest } from '../adapters/api/concurrencyRequest';
import type { ConcurrencyRequestData } from '../components/features/concurrency/request/types';
import { ConcurrencyRequestResults } from '../components/features/concurrency/request/Results';
import { ConcurrencyRequestBarGraphWrapper } from '../components/features/concurrency/request/barGraph/Wrapper';
import { useAppSettingsContext } from '../hooks/useAppSettingsContext';
import { useErrorBoundaryTrigger } from '../hooks/useErrorBoundaryTrigger';
import { handleError } from '@suiteworks/suitetools-shared';
import { formatDate, formatMinuteSecond } from '../utils/date';
import {
  APM_UNAVAILABLE_MESSAGE,
  isApmUnavailableError,
} from '../lib/netsuite/ApmUnavailableError';

type Params = {
  startDate: string;
  endDate: string;
  peakConcurrency: string;
  peakConcurrencyTime: string;
};

/**
 * Concurrency Request page — requests in a selected timeframe.
 * @returns The rendered Concurrency Request page.
 */
export function ConcurrencyRequestPage(): React.ReactElement {
  const params = useParams<Params>();
  const startDate = params.startDate;
  const endDate = params.endDate;
  const peakConcurrency = params.peakConcurrency;
  const peakConcurrencyTime = params.peakConcurrencyTime;
  if (!startDate || !endDate) {
    throw new Error('Missing required parameters');
  }

  const { settings } = useAppSettingsContext();
  const triggerError = useErrorBoundaryTrigger();

  const selectedCriteria: CriteriaFields = {
    startDate: startDate,
    endDate: endDate,
  };
  const [criteria, setCriteria] = useState<CriteriaFields>(selectedCriteria);
  const [results, setResults] = useState<ConcurrencyRequestData>();
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchData(): Promise<void> {
      try {
        if (settings?.accountId) {
          setLoading(true);
          setStatusMessage(null);
          setCriteria(criteria);
          const data = await getConcurrencyRequest(criteria, settings.accountId);
          if (!ignore) {
            setResults(data);
          }
        }
      } catch (err) {
        if (isApmUnavailableError(err)) {
          if (!ignore) {
            setResults(undefined);
            setStatusMessage(APM_UNAVAILABLE_MESSAGE);
            console.warn(`[SuiteTools] ${err.message}`);
          }
          return;
        }
        if (!ignore) {
          setResults(undefined);
          setStatusMessage(null);
        }
        handleError(err, { reactTrigger: triggerError });
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return (): void => {
      ignore = true;
    };
  }, [criteria, settings?.accountId, triggerError]);

  return (
    <div className="mx-auto mt-6">
      <h2 className="text-xl font-bold text-slate-900">Concurrency Requests</h2>
      {statusMessage ? <p className="mb-2 text-sm text-amber-700">{statusMessage}</p> : null}
      {results && (
        <>
          <p className="text-sm text-gray-500">
            Below are the concurrency requests that executed between {formatDate(Number(startDate))} to{' '}
            {formatDate(Number(endDate))}.
          </p>
          <p className="text-sm text-gray-500">
            {peakConcurrency && (
              <>
                The peak concurrency {peakConcurrencyTime && <> at {formatMinuteSecond(Number(peakConcurrencyTime))}</>}{' '}
                was {peakConcurrency}.
              </>
            )}
          </p>
          <p className="text-sm text-gray-500">
            This page includes requests that started before the selected timeframe and continued into this timeframe.
            This is useful to see long running requests that may not be visible in the Concurrency APM tool.
          </p>
          <br />
        </>
      )}
      {loading ? (
        <p>Loading...</p>
      ) : statusMessage ? null : (
        <>
          <ConcurrencyRequestBarGraphWrapper data={results} />
          <br />
          <ConcurrencyRequestResults data={results} />
        </>
      )}
    </div>
  );
}
