// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file useEntityList.ts
 * @description Criteria-driven list fetch loop shared by SuiteTools list pages.
 */

import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { handleError, toArray } from '@suiteworks/suitetools-shared';
import { useErrorBoundaryTrigger } from './useErrorBoundaryTrigger';

type UseEntityListOptions<TItem, TCriteria> = {
  /** Initial criteria (also passed through to RecordCriteria as defaultCriteria). */
  defaultCriteria: TCriteria;
  /** Fetch rows for the current criteria; may return a raw array-like value. */
  fetchList: (criteria: TCriteria) => Promise<readonly TItem[] | TItem[]>;
  /**
   * Extra effect dependencies beyond `criteria` (e.g. settings used inside `fetchList`).
   * Avoid putting unstable inline arrays here — pass a stable value or memoize.
   */
  deps?: readonly unknown[];
};

type UseEntityListResult<TItem, TCriteria> = {
  criteria: TCriteria;
  setCriteria: Dispatch<SetStateAction<TCriteria>>;
  results: TItem[];
};

/**
 * Owns criteria/results state and the ignore-safe list fetch effect used by list pages.
 * @template TItem - Row type.
 * @template TCriteria - Criteria object type.
 * @param options - Default criteria, fetch function, optional extra deps.
 * @returns Criteria setters and normalized results array.
 */
export function useEntityList<TItem, TCriteria>(
  options: UseEntityListOptions<TItem, TCriteria>,
): UseEntityListResult<TItem, TCriteria> {
  const { defaultCriteria, fetchList, deps = [] } = options;
  const triggerError = useErrorBoundaryTrigger();
  const [criteria, setCriteria] = useState<TCriteria>(defaultCriteria);
  const [results, setResults] = useState<TItem[]>([]);

  useEffect(() => {
    let ignore = false;

    async function fetchData(): Promise<void> {
      try {
        const data = await fetchList(criteria);
        const normalized = toArray<TItem>(data);
        if (!ignore) {
          setResults(normalized);
        }
      } catch (err) {
        if (!ignore) {
          setResults([]);
        }
        handleError(err, { reactTrigger: triggerError });
      }
    }

    void fetchData();
    return (): void => {
      ignore = true;
    };
    // fetchList is intentionally omitted — pages pass inline wrappers; deps covers extras.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- criteria + triggerError + deps
  }, [criteria, triggerError, ...deps]);

  return { criteria, setCriteria, results };
}
