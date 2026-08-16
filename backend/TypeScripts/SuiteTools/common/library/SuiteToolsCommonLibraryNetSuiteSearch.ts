/**
 * SuiteTools Library - NetSuite Search Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from "N/log";
import * as search from "N/search";
import type { SuiteToolsCommon } from "../SuiteToolsCommon";

/**
 * SuiteTools NetSuite Search Library
 *
 * Wraps the two ways to obtain search results in NetSuite: `search()` builds an ad-hoc query
 * in code, `run()` executes a saved search defined in the UI. They are complementary, not
 * alternatives — a saved search cannot be expressed through `search.create()`, and an ad-hoc
 * query has no saved-search id to load.
 *
 * ⚠️ Currently unused. Nothing in the repo calls any method on this class; it is instantiated
 * and exposed via `SuiteToolsCommonLibraryNetSuite.stLibNsSearch` only. It is retained because
 * it is the tool's only saved-search support. Nothing here is covered by tests or exercised at
 * runtime, so treat it as unverified until something wires it up. Tracked in #85.
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteSearch {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Builds and runs an ad-hoc search.
   *
   * Use this when the query is defined in code. For a saved search, use {@link run} instead.
   *
   * @param type - the record type to search (e.g. "salesorder")
   * @param columns - the columns to return, as ids or `search.Column` objects
   * @param filters - the filters to apply
   * @param rows - maximum results to return, as a string; falsy values default to 1000. Note
   *   that `run().each()` stops at 4000 regardless, so a larger value is silently truncated.
   * @returns the search results, up to the lesser of `rows` and 4000
   */
  public search(
    type: string,
    columns: string[] | search.Column[],
    filters: search.Filter[],
    rows: string,
  ): search.Result[] {
    log.debug({
      title: `SuiteToolsCommonLibraryNetSuiteSearch:search() initiated`,
      details: { type: type, columns: columns, filters: filters, rows: rows },
    });

    const stSearch = search.create({ type: type });
    stSearch.columns = columns;
    stSearch.filters = filters;

    const maxResults = parseInt(rows || "1000", 10);
    const searchResults: search.Result[] = [];

    // each() is faster than paging via getRange(), but caps out at 4000 results.
    stSearch.run().each((result) => {
      if (searchResults.length < maxResults) {
        searchResults.push(result);
        return true; // continue processing
      }
      return false; // stop processing
    });

    log.debug({ title: "SuiteToolsCommonLibraryNetSuiteSearch:search() returning", details: searchResults });

    return searchResults;
  }

  /**
   * Loads and runs a saved search.
   *
   * Use this when the query is maintained in NetSuite by an admin. For a query defined in code,
   * use {@link search} instead.
   *
   * @param id - the saved search id (e.g. "customsearch_...") or its internal id
   * @returns the search results, capped at 1000
   */
  public run(id: string): search.Result[] {
    log.debug({ title: `SuiteToolsCommonLibraryNetSuiteSearch:run() initiated`, details: { id: id } });

    const stSearch = search.load({ id: id });
    const searchResults: search.Result[] = [];

    // Unlike search(), the cap here is fixed rather than caller-supplied.
    // each() is faster than paging via getRange(), but caps out at 4000 results.
    stSearch.run().each((result) => {
      if (searchResults.length < 1000) {
        searchResults.push(result);
        return true; // continue processing
      }
      return false; // stop processing
    });

    log.debug({ title: "SuiteToolsCommonLibraryNetSuiteSearch:run() returning", details: searchResults });

    return searchResults;
  }

  /**
   * Resolves a saved search's internal id from its script id.
   *
   * Not all saved searches are loadable through the API, so this cannot simply
   * `search.load()` the target and read its id. Instead it filters the "Saved Search Lookup"
   * saved search (`customsearch_idev_search_lookup`), which must exist in the account.
   *
   * @param id - the saved search script id (e.g. "customsearch_...")
   * @returns the internal id, or 0 if the lookup found no match
   */
  public getSearchInternalId(id: string): number {
    log.debug({ title: "SuiteToolsCommonLibraryNetSuiteSearch:getSearchInternalId() initiated", details: { id: id } });

    let internalId = 0;
    const searchLookupObj = search.load({ id: "customsearch_idev_search_lookup", type: search.Type.SAVED_SEARCH });
    searchLookupObj.filters.push(search.createFilter({ name: "ID", operator: search.Operator.IS, values: id }));
    const searchLookupResults = searchLookupObj.run().getRange({ start: 0, end: 1 });
    if (searchLookupResults.length > 0) {
      const result = searchLookupResults[0].getValue({ name: "internalid" });
      if (typeof result === "string") {
        internalId = parseInt(result, 10);
      }
    }
    log.debug({ title: "SuiteToolsCommonLibraryNetSuiteSearch:getSearchInternalId() returning", details: internalId });

    return internalId;
  }
}
