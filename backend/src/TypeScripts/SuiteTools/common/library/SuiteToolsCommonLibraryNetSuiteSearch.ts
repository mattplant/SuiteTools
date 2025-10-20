/**
 * SuiteTools Library - NetSuite Search Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from 'N/log';
import * as search from 'N/search';
import type { SuiteToolsCommon } from '../SuiteToolsCommon';

/**
 * SuiteTools NetSuite Search Library
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
   * Runs the Search query.
   *
   * @param type
   * @param columns
   * @param filters
   * @param rows
   * @param [setSession]
   * @returns the search results
   */
  public search(
    type: string,
    columns: string[] | search.Column[],
    filters: search.Filter[],
    rows: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[] {
    log.debug({
      title: `SuiteToolsCommonLibraryNetSuiteSearch:search() initiated`,
      details: { type: type, columns: columns, filters: filters, rows: rows },
    });

    const stSearch = search.create({ type: type });
    stSearch.columns = columns;
    stSearch.filters = filters;

    // TODO: use run().each() instead of run().getRange() for the 4,000 result limit
    // var searchResultCount = scriptexecutionlogSearchObj.runPaged().count;
    // log.debug("scriptexecutionlogSearchObj result count",searchResultCount);
    // scriptexecutionlogSearchObj.run().each(function(result){
    // // .run().each has a limit of 4,000 results
    // return true;
    // });

    // default number of required values if not specified
    if (!rows) {
      rows = '1000';
    }

    // run the search
    const searchResults = stSearch.run().getRange({
      start: 0,
      end: parseInt(rows),
    });

    log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteSearch:search() returning', details: searchResults });

    return searchResults;
  }

  /**
   * Runs the Search query.
   *
   * @param id
   * @returns the search results
   */
  public run(
    id: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[] {
    log.debug({
      title: `SuiteToolsCommonLibraryNetSuiteSearch:run() initiated`,
      details: { id: id },
    });

    const stSearch = search.load({ id: id });

    // TODO: use run().each() instead of run().getRange() for the 4,000 result limit
    // var searchResultCount = scriptexecutionlogSearchObj.runPaged().count;
    // log.debug("scriptexecutionlogSearchObj result count",searchResultCount);
    // scriptexecutionlogSearchObj.run().each(function(result){
    // // .run().each has a limit of 4,000 results
    // return true;
    // });

    // run the search
    const searchResults = stSearch.run().getRange({
      start: 0,
      end: 1000,
    });

    log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteSearch:run() returning', details: searchResults });

    return searchResults;
  }

  /**
   * Gets the Saved Search's internal id.
   *
   * @param id - the saved search id (e.g. "customsearch_...")
   * @returns the internal id
   */
  public getSearchInternalId(id: string): number {
    log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteRecord:getSearchInternalId() initiated', details: { id: id } });

    // get the internal id of the "Saved Search Lookup" (id: customsearch_idev_search_lookup) search
    let internalId = 0;
    // need to leverage an existing search since not all saved searches are accessible via the API
    const searchLookupObj = search.load({ id: 'customsearch_idev_search_lookup', type: search.Type.SAVED_SEARCH });
    searchLookupObj.filters.push(search.createFilter({ name: 'ID', operator: search.Operator.IS, values: id }));
    const searchLookupResults = searchLookupObj.run().getRange({ start: 0, end: 1 });
    if (searchLookupResults.length > 0) {
      const result = searchLookupResults[0].getValue({ name: 'internalid' });
      // check if type of result  is string
      if (typeof result === 'string') {
        internalId = parseInt(result);
      }
    }
    log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteRecord:getSearchInternalId() returning', details: internalId });

    return internalId;
  }
}
