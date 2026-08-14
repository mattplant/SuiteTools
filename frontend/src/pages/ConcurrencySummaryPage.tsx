// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import type { CriteriaFields } from "../components/features/concurrency/summary/types";
import { getConcurrencySummary } from "../adapters/api/concurrencySummary";
import { RecordCriteria } from "../components/features/concurrency/summary/RecordCriteria";
import type { ConcurrencySummaryData } from "../components/features/concurrency/summary/types";
import { ConcurrencySummaryOverview } from "../components/features/concurrency/summary/Overview";
import { ConcurrencySummaryHeatMapWrapper } from "../components/features/concurrency/summary/heatMap/Wrapper";
import { ConcurrencySummaryViolations } from "../components/features/concurrency/summary/Violations";
import { useAppSettingsContext } from "../hooks/useAppSettingsContext";
import { useErrorBoundaryTrigger } from "../hooks/useErrorBoundaryTrigger";
import { handleError } from "@suiteworks/suitetools-shared";
import { APM_UNAVAILABLE_MESSAGE, isApmUnavailableError } from "../lib/netsuite/ApmUnavailableError";

/**
 * Concurrency Summary page — APM concurrency overview for a date range.
 * @returns The rendered Concurrency Summary page.
 */
export function ConcurrencySummaryPage(): React.ReactElement {
  const { settings } = useAppSettingsContext();
  const triggerError = useErrorBoundaryTrigger();

  const defaultCriteria: CriteriaFields = { startDate: new Date(), endDate: new Date() };
  const [criteria, setCriteria] = useState<CriteriaFields>(defaultCriteria);
  const [results, setResults] = useState<ConcurrencySummaryData>();
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchData(): Promise<void> {
      if (!settings?.accountId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setStatusMessage(null);
        const data = await getConcurrencySummary(criteria, settings.accountId);
        if (!ignore) {
          setResults(data);
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
      <h2 className="text-xl font-bold text-slate-900">Concurrency Summary</h2>
      <RecordCriteria defaultCriteria={defaultCriteria} setCriteria={setCriteria} />
      {statusMessage ? <p className="mb-2 text-sm text-amber-700">{statusMessage}</p> : null}
      {loading ? (
        <p>Loading...</p>
      ) : results ? (
        <>
          <ConcurrencySummaryOverview data={results} />
          <br />
          <ConcurrencySummaryHeatMapWrapper data={results} />
          <ConcurrencySummaryViolations data={results} />
        </>
      ) : null}
    </div>
  );
}
