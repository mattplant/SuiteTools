// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file useEntityList.ts
 * @description Criteria-driven list fetch loop shared by SuiteTools list pages.
 */

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { handleError, toArray } from "@suiteworks/suitetools-shared";
import { useErrorBoundaryTrigger } from "./useErrorBoundaryTrigger";

type UseEntityListOptions<TItem, TCriteria> = {
  /** Initial criteria (also passed through to RecordCriteria as defaultCriteria). */
  defaultCriteria: TCriteria;
  /** Fetch rows for the current criteria; may return a raw array-like value. */
  fetchList: (criteria: TCriteria) => Promise<readonly TItem[] | TItem[]>;
  /**
   * Extra effect dependencies beyond `criteria` (e.g. settings or prop-driven filters).
   * Avoid putting unstable inline arrays here — pass a stable value or memoize.
   */
  deps?: readonly unknown[];
  /**
   * Optional soft status after a successful fetch (e.g. scrape empty/partial UX).
   * Cleared when a fetch starts and on error.
   */
  getStatusMessage?: (rows: TItem[]) => string | null;
};

type UseEntityListResult<TItem, TCriteria> = {
  criteria: TCriteria;
  setCriteria: Dispatch<SetStateAction<TCriteria>>;
  results: TItem[];
  statusMessage: string | null;
};

/**
 * Owns criteria/results state and the ignore-safe list fetch effect used by list pages.
 * @template TItem - Row type.
 * @template TCriteria - Criteria object type.
 * @param options - Default criteria, fetch function, optional extras.
 * @returns Criteria setters, normalized results, and optional status message.
 */
export function useEntityList<TItem, TCriteria>(
  options: UseEntityListOptions<TItem, TCriteria>,
): UseEntityListResult<TItem, TCriteria> {
  const { defaultCriteria, fetchList, deps = [], getStatusMessage } = options;
  const triggerError = useErrorBoundaryTrigger();
  const [criteria, setCriteria] = useState<TCriteria>(defaultCriteria);
  const [results, setResults] = useState<TItem[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchData(): Promise<void> {
      try {
        if (!ignore) {
          setStatusMessage(null);
        }
        const data = await fetchList(criteria);
        const normalized = toArray<TItem>(data);
        if (!ignore) {
          setResults(normalized);
          setStatusMessage(getStatusMessage?.(normalized) ?? null);
        }
      } catch (err) {
        if (!ignore) {
          setResults([]);
          setStatusMessage(null);
        }
        handleError(err, { reactTrigger: triggerError });
      }
    }

    void fetchData();
    return (): void => {
      ignore = true;
    };
    // fetchList / getStatusMessage intentionally omitted — pages pass inline wrappers; deps covers extras.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- criteria + triggerError + deps
  }, [criteria, triggerError, ...deps]);

  return { criteria, setCriteria, results, statusMessage };
}
