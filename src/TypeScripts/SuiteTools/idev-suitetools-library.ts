/**
 * SuiteTools Library
 *
 * This is the library file for SuiteTools.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * Copyright (C) 2023  Matthew Plant
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @NApiVersion 2.1
 */

import file = require('N/file');
import log = require('N/log');
import query = require('N/query');
import record = require('N/record');
import redirect = require('N/redirect');
import search = require('N/search');
import url = require('N/url');

import { SuiteToolsApp } from './idev-suitetools-app';

/**
 * SuiteTools Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsLibrary {
  private _stApp: SuiteToolsApp;
  private _stLibNs: SuiteToolsLibraryNetSuite;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  get stLibNs(): SuiteToolsLibraryNetSuite {
    return this._stLibNs;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsLibrary:constructor() initiated', details: null });
    this._stApp = stApp;

    this._stLibNs = new SuiteToolsLibraryNetSuite(this.stApp);
  }
}

/**
 * SuiteTools NetSuite Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsLibraryNetSuite {
  private _stApp: SuiteToolsApp;
  private _stLibNsFile: SuiteToolsLibraryNetSuiteFile;
  private _stLibNsRecord: SuiteToolsLibraryNetSuiteRecord;
  private _stLibNsScript: SuiteToolsLibraryNetSuiteScript;
  private _stLibNsSearch: SuiteToolsLibraryNetSuiteSearch;
  private _stLibNsSuiteQl: SuiteToolsLibraryNetSuiteSuiteQl;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }
  get stLibNsFile(): SuiteToolsLibraryNetSuiteFile {
    return this._stLibNsFile;
  }
  get stLibNsRecord(): SuiteToolsLibraryNetSuiteRecord {
    return this._stLibNsRecord;
  }
  get stLibNsScript(): SuiteToolsLibraryNetSuiteScript {
    return this._stLibNsScript;
  }
  get stLibNsSearch(): SuiteToolsLibraryNetSuiteSearch {
    return this._stLibNsSearch;
  }
  get stLibNsSuiteQl(): SuiteToolsLibraryNetSuiteSuiteQl {
    return this._stLibNsSuiteQl;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsLibraryNetSuite:constructor() initiated', details: null });
    this._stApp = stApp;

    this._stLibNsFile = new SuiteToolsLibraryNetSuiteFile(this.stApp);
    this._stLibNsRecord = new SuiteToolsLibraryNetSuiteRecord(this.stApp);
    this._stLibNsScript = new SuiteToolsLibraryNetSuiteScript(this.stApp);
    this._stLibNsSearch = new SuiteToolsLibraryNetSuiteSearch(this.stApp);
    this._stLibNsSuiteQl = new SuiteToolsLibraryNetSuiteSuiteQl(this.stApp);
  }
}

/**
 * SuiteTools NetSuite File Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsLibraryNetSuiteFile {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:constructor() initiated', details: null });
    this._stApp = stApp;
  }

  /**
   * Get NetSuite file object.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file
   */
  private getFile(id: number | string): file.File {
    log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:getFile() initiated', details: { id: id } });

    let fileObj: file.File;
    if (typeof id === 'string') {
      const filePath = `/SuiteScripts/${this.stApp.appDir}/${id}`;
      fileObj = file.load({ id: filePath });
    } else {
      fileObj = file.load({ id: id });
    }
    log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:getFile() fileObj', details: fileObj });

    return fileObj;
  }

  /**
   * Gets NetSuite file contents.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file contents
   */
  public getFileContents(id: number | string): string {
    log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:getFileContents() initiated', details: { id: id } });

    const fileObj = this.getFile(id);

    return fileObj.getContents();
  }

  /**
   * Gets NetSuite file URL.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file url
   */
  public getFileURL(fileName: string): string {
    log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:getFileContents() initiated', details: { fileName: fileName } });

    const fileObj = this.getFile(fileName);

    return fileObj.url;
  }
}

/**
 * SuiteTools NetSuite Record Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsLibraryNetSuiteRecord {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:constructor() initiated', details: null });
    this._stApp = stApp;
  }

  /**
   * Create custom record or list entry
   *
   * @param recordType
   * @param recordId
   * @returns true if successful else false
   */
  public createCustomRecord(recordType: string, values: object): boolean {
    log.debug({
      title: 'SuiteToolsLibraryNetSuiteRecord:createCustomRecord() initiated',
      details: { recordType: recordType, values: values },
    });
    let success = false;

    try {
      const recordObj = record.create({
        type: recordType,
      });
      for (const field in values) {
        recordObj.setValue({ fieldId: field, value: values[field] });
      }
      recordObj.save({
        enableSourcing: false,
        ignoreMandatoryFields: true,
      });
      success = true;
    } catch (e) {
      log.error({ title: `SuiteToolsLibraryNetSuiteRecord:createCustomRecord - Error on ${recordType}`, details: e });
    }

    return success;
  }

  /**
   * Update custom record or list entry
   *
   * @param recordType
   * @param recordId
   * @returns true if successful else false
   */
  public updateCustomRecord(recordType: string, recordId: number, values: object): boolean {
    log.debug({
      title: 'SuiteToolsLibraryNetSuiteRecord:updateCustomRecord() initiated',
      details: { recordType: recordType, recordId: recordId, values: values },
    });
    let success = false;

    try {
      const recordObj = record.load({
        type: recordType,
        id: recordId,
      });
      for (const field in values) {
        recordObj.setValue({ fieldId: field, value: values[field] });
      }
      recordObj.save({
        enableSourcing: false,
        ignoreMandatoryFields: true,
      });
      success = true;
    } catch (e) {
      log.error({ title: `SuiteToolsLibraryNetSuiteRecord:updateCustomRecord - Error on ${recordType}`, details: e });
    }

    return success;
  }

  /**
   * Clears custom record.
   *
   * @param recordType
   * @returns true if successful else false
   */
  public clearCustomRecord(recordType: string): boolean {
    let success = false;
    try {
      const queryResults = query.runSuiteQL({ query: `SELECT ID FROM ${recordType}` }).asMappedResults();
      for (let i = 0; i < queryResults.length; i++) {
        const recordId = queryResults[i].id as string;
        log.debug({
          title: 'SuiteToolsLibraryNetSuiteRecord:clearCustomRecord() deleting record',
          details: { recordType: recordType, recordID: recordId },
        });
        record.delete({ type: recordType, id: recordId });
      }
      success = true;
    } catch (e) {
      log.error({ title: `SuiteToolsLibraryNetSuiteRecord:clearCustomRecord - Error on ${recordType}`, details: e });
    }

    return success;
  }

  /**
   * Disable custom record or list
   *
   * @param recordType
   * @returns true if successful else false
   */
  public disableCustomRecord(recordType: string): boolean {
    let success = false;
    try {
      const queryResults = query.runSuiteQL({ query: `SELECT ID FROM ${recordType}` }).asMappedResults();
      for (let i = 0; i < queryResults.length; i++) {
        const recordId = queryResults[i].id as string;
        log.debug({
          title: 'SuiteToolsLibraryNetSuiteRecord:disableCustomRecord() disabling record',
          details: { recordType: recordType, recordId: recordId },
        });

        const disableRecord = record.load({
          type: recordType,
          id: recordId,
        });
        // set field "isinactive" to true
        disableRecord.setValue({ fieldId: 'isinactive', value: true });
        // save record
        disableRecord.save({
          enableSourcing: false,
          ignoreMandatoryFields: true,
        });
      }
      success = true;
    } catch (e) {
      log.error({ title: `SuiteToolsLibraryNetSuiteRecord:disableCustomRecord - Error on ${recordType}`, details: e });
    }

    return success;
  }

  /**
   * Gets the Custom List's internal id.
   *
   * @param customList - the custom list id (e.g. "customlist_...")
   * @returns the internal id
   */
  public getCustomListInternalId(customList: string): number {
    let result = 0;
    const sql = `
        SELECT
          CustomList.internalId,
        FROM
          CustomList
        WHERE
          CustomList.scriptId = '${customList.toUpperCase()}'
      `;
    const resultSet = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:getCustomListInternalId() - resultSet', details: resultSet });
    if (resultSet.length > 0) {
      result = resultSet[0].internalid;
    }
    log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:getCustomListInternalId() returning', details: result });

    return result;
  }

  /**
   * Gets the Custom Record's internal id.
   *
   * @param customRecord - the custom record id (e.g. "customrecord_...")
   * @returns the internal id
   */
  public getCustomRecordInternalId(customRecord: string): number {
    let result = 0;
    const sql = `
        SELECT
          CustomRecordType.internalId,
        FROM
          CustomRecordType
        WHERE
          CustomRecordType.scriptId = '${customRecord.toUpperCase()}'
      `;
    const resultSet = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:getCustomRecordInternalId() - resultSet', details: resultSet });
    if (resultSet.length > 0) {
      result = resultSet[0].internalid;
    }
    log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:getCustomRecordInternalId() returning', details: result });

    return result;
  }
}

/**
 * SuiteTools NetSuite Script Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsLibraryNetSuiteScript {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteScript:constructor() initiated', details: null });
    this._stApp = stApp;
  }

  /**
   * Redirects to SuiteScript script.
   *
   * @param scriptId - the script id
   * @param deploymentId - the deployment id
   * @param parameters - the parameters
   */
  public redirectToScript(scriptId: string, deploymentId: string, params: object): void {
    try {
      log.debug({
        title: 'SuiteToolsLibraryNetSuiteScript:redirectToScript() initiated',
        details: { scriptId: scriptId, deploymentId: deploymentId, params: params },
      });
      const scriptUrl = url.resolveScript({
        scriptId: scriptId,
        deploymentId: deploymentId,
      });
      log.debug({ title: 'SuiteToolsLibraryNetSuiteScript:redirectToScript() redirecting to', details: scriptUrl });
      redirect.redirect({
        url: scriptUrl,
        parameters: params,
      });
    } catch (e) {
      log.error('SuiteToolsLibraryNetSuiteScript:redirectToScript() error', e);
    }
  }
}

/**
 * SuiteTools NetSuite Search Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsLibraryNetSuiteSearch {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteSearch:constructor() initiated', details: null });
    this._stApp = stApp;
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
    setSession = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[] {
    log.debug({
      title: `SuiteToolsLibraryNetSuiteSearch:search() initiated`,
      details: { type: type, columns: columns, filters: filters, rows: rows, setSession: setSession },
    });

    // default number of required values if not specified
    if (!rows) {
      rows = '50';
    }

    const stSearch = search.create({ type: type });
    stSearch.columns = columns;
    stSearch.filters = filters;

    if (setSession) {
      // save the search to the session for display in the UI if in DEV mode
      this.stApp.setSession('search', JSON.stringify(stSearch));
    }

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
      end: parseInt(rows),
    });

    log.debug({ title: 'SuiteToolsLibraryNetSuiteSearch:search() returning', details: searchResults });

    return searchResults;
  }

  /**
   * Gets the Saved Search's internal id.
   *
   * @param id - the saved search id (e.g. "customsearch_...")
   * @returns the internal id
   */
  public getSearchInternalId(id: string): number {
    log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:getSearchInternalId() initiated', details: { id: id } });

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
    log.debug({ title: 'SuiteToolsLibraryNetSuiteRecord:getSearchInternalId() returning', details: internalId });

    return internalId;
  }
}

/**
 * SuiteTools NetSuite SuiteQL Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsLibraryNetSuiteSuiteQl {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:constructor() initiated', details: null });
    this._stApp = stApp;
  }

  /**
   * Runs the SuiteQL query.
   *
   * @param sql - the sql query
   * @param [setSession] - set to true to save the query to the session for display in the UI if in DEV mode
   * @returns the query results
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public query(sql: string, setSession = false): any[] {
    if (sql) {
      // remove line endings
      sql = sql.toString().replace(/(\r\n|\n|\r)/gm, ' ');
    }
    log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:query() initiated with ', details: { sql: sql } });
    if (setSession) {
      // save the sql to the session for display in the UI if in DEV mode
      this.stApp.setSession('sql', sql);
    }

    let results = [];
    try {
      results = query.runSuiteQL({ query: sql }).asMappedResults();
    } catch (error) {
      log.error({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:query() error', details: error });
      results = [];
    }
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:query() returning', details: results });

    return results;
  }

  /**
   * Gets field value from SQL query
   *
   * @param sql - the sql query
   * @param field - the field to return
   * @returns the field value or empty string if not found
   */
  public getSqlValue(sql: string, field: string): string {
    let resultField = ''; // default to empty string
    const resultSet = this.query(sql);
    log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:getSqlValue() resultSet =', details: resultSet });
    // grab the first row if it exists
    if (resultSet.length > 0) {
      const resultJson = resultSet[0];
      log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:getSqlValue() resultJson = ', details: resultJson });
      const resultObject = JSON.parse(JSON.stringify(resultJson));
      if (resultObject[field]) {
        // return the field value since it exists
        resultField = resultObject[field];
      }
    }
    log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:getSqlValue() returning', details: resultField });

    return String(resultField);
  }
}
