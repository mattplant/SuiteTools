// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { CriteriaFields } from "../components/features/concurrency/detail/types";
import { getConcurrencyDetail } from "../adapters/api/concurrencyDetail";
import type { ConcurrencyDetailData } from "../components/features/concurrency/detail/types";
import { ConcurrencyDetailOverview } from "../components/features/concurrency/detail/Overview";
import { ConcurrencyDetailBarGraphWrapper } from "../components/features/concurrency/detail/barGraph/Wrapper";
import { ConcurrencyDetailResults } from "../components/features/concurrency/detail/Results";
import { useAppSettingsContext } from "../hooks/useAppSettingsContext";
import { useErrorBoundaryTrigger } from "../hooks/useErrorBoundaryTrigger";
import { handleError } from "@suiteworks/suitetools-shared";
import { APM_UNAVAILABLE_MESSAGE, isApmUnavailableError } from "../lib/netsuite/ApmUnavailableError";

type Params = { startDate: string; endDate: string };

/**
 * Concurrency Detail page — peaks for a selected hour.
 * @returns The rendered Concurrency Detail page.
 */
export function ConcurrencyDetailPage(): React.ReactElement {
  const params = useParams<Params>();
  const startDate = params.startDate;
  const endDate = params.endDate;
  if (!startDate || !endDate) {
    throw new Error("Missing required parameters");
  }

  const { settings } = useAppSettingsContext();
  const triggerError = useErrorBoundaryTrigger();

  const selectedCriteria: CriteriaFields = { startDate: startDate, endDate: endDate };
  const [criteria, setCriteria] = useState<CriteriaFields>(selectedCriteria);
  const [results, setResults] = useState<ConcurrencyDetailData>();
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
          const data = await getConcurrencyDetail(criteria, settings.accountId);
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
      <h2 className="text-xl font-bold text-slate-900">Concurrency Details</h2>
      <p className="text-sm text-gray-500">Below are the concurrency peaks for the selected hour.</p>
      <p className="text-sm text-gray-500">Drill in to see the incoming requests.</p>
      <br />
      {statusMessage ? <p className="mb-2 text-sm text-amber-700">{statusMessage}</p> : null}
      {loading ? (
        <p>Loading...</p>
      ) : statusMessage ? null : (
        <>
          <ConcurrencyDetailOverview data={results} />
          <br />
          <ConcurrencyDetailBarGraphWrapper data={results} />
          <br />
          <ConcurrencyDetailResults data={results} />
        </>
      )}
    </div>
  );
}
