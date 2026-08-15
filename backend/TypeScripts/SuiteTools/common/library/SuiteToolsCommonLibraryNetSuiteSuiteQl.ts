/**
 * SuiteTools Library - NetSuite SuiteQL Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from "N/log";
import * as query from "N/query";
import { UnexpectedError } from "@suiteworks/suitetools-shared/errors";
import type { SuiteQLResults } from "../types";

// Forward declaration to avoid circular dependency
declare class SuiteToolsCommon {}

/**
 * SuiteTools NetSuite SuiteQL Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteSuiteQl {
  private _stCommon: SuiteToolsCommon | null;

  get stCommon(): SuiteToolsCommon | null {
    return this._stCommon;
  }

  // Map/Reduce helpers construct this standalone, without the app bootstrapped, and pass null.
  constructor(stCommon: SuiteToolsCommon | null) {
    this._stCommon = stCommon;
  }

  /**
   * Runs the SuiteQL query.
   *
   * Successful empty result sets return `[]`. Runtime SuiteQL failures throw
   * {@link UnexpectedError} so callers/API transport can escalate — they must
   * not be mistaken for “no rows”.
   *
   * @param sql - the sql query
   * @returns the query results
   */
  public query(sql: string): SuiteQLResults {
    if (sql) {
      // remove line endings
      sql = sql.toString().replace(/(\r\n|\n|\r)/gm, " ");
    }
    log.debug({ title: "SuiteToolsCommonLibraryNetSuiteSuiteQl:query() initiated with ", details: { sql: sql } });

    try {
      return query.runSuiteQL({ query: sql }).asMappedResults() as SuiteQLResults;
    } catch (error) {
      log.error({ title: "SuiteToolsCommonLibraryNetSuiteSuiteQl:query() error", details: error });
      const sqlSnippet = String(sql || "")
        .replace(/\s+/g, " ")
        .slice(0, 240);
      throw new UnexpectedError("SuiteQL.query()", error, { sqlSnippet });
    }
  }

  /**
   * Gets field value from SQL query
   *
   * @param sql - the sql query
   * @param field - the field to return
   * @returns the field value or empty string if not found
   */
  public getSqlValue(sql: string, field: string): string {
    let resultField = ""; // default to empty string
    const resultSet = this.query(sql);
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteSuiteQl:getSqlValue() resultSet =', details: resultSet });
    // grab the first row if it exists
    if (resultSet.length > 0) {
      const resultJson = resultSet[0];
      // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteSuiteQl:getSqlValue() resultJson = ', details: resultJson });
      const resultObject = JSON.parse(JSON.stringify(resultJson));
      if (resultObject[field]) {
        // return the field value since it exists
        resultField = resultObject[field];
      }
    }
    log.debug({ title: "SuiteToolsCommonLibraryNetSuiteSuiteQl:getSqlValue() returning", details: resultField });

    return String(resultField);
  }
}
