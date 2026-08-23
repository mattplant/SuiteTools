// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The criteria-driven fetch loop every list page runs on.
 *
 * @fileoverview
 * Sixteen modules use it. Owns the whole cycle a list screen needs — current criteria, the
 * fetch that reruns when they change, loading state, and error reporting through
 * `useErrorBoundaryTrigger` — so a list page supplies a `fetchList` and renders rows.
 *
 * @remarks
 * `deps` is spread into the effect's dependency array, so an inline array literal there
 * re-fetches on every render; pass a stable or memoised value. `getStatusMessage` is a soft
 * status for partial results (an empty scrape, say) and is deliberately cleared when a fetch
 * starts and on error, so it can never outlive the rows it described.
 *
 * @see ./useErrorBoundaryTrigger.ts – how fetch failures surface
 * @see ../components/shared/criteria/types.ts – the criteria shape driving the loop
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
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

  // fetchList / getStatusMessage intentionally omitted — pages pass inline wrappers; deps covers extras.
  // Permanent by design, not deferred work: including the wrappers would refetch on every
  // render, and the dep array ends in `...deps` — a spread the rule cannot analyse statically,
  // so it can never be satisfied here. The documented `deps` option is the refetch contract.
  // biome-ignore lint/correctness/useExhaustiveDependencies: callers pass inline wrappers whose identity changes every render; the explicit `deps` option is the intended refetch trigger
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
  }, [criteria, triggerError, ...deps]);

  return { criteria, setCriteria, results, statusMessage };
}
