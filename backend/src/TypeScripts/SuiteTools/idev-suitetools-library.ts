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

import email = require('N/email');
import file = require('N/file');
import log = require('N/log');
import query = require('N/query');
import record = require('N/record');
import redirect = require('N/redirect');
import runtime = require('N/runtime');
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
  private _stLibGeneral: SuiteToolsLibraryGeneral;
  private _stLibNs: SuiteToolsLibraryNetSuite;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  get stLibGeneral(): SuiteToolsLibraryGeneral {
    return this._stLibGeneral;
  }

  get stLibNs(): SuiteToolsLibraryNetSuite {
    return this._stLibNs;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsLibrary:constructor() initiated', details: null });
    this._stApp = stApp;
    this._stLibGeneral = new SuiteToolsLibraryGeneral(this.stApp);
    this._stLibNs = new SuiteToolsLibraryNetSuite(this.stApp);
  }
}

/**
 * SuiteTools General Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsLibraryGeneral {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsLibraryGeneral:constructor() initiated', details: null });
    this._stApp = stApp;
  }

  /**
   * Format date object into a string with the format YYYY-MM-DD hh24:mi:ss.
   *
   * TODO replace with moment.js
   *
   * @param {Date} date - the date object to format
   * @returns {string} formattedDate - the formatted date string
   */
  public formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    let hour = '' + d.getHours();
    let minute = '' + d.getMinutes();
    let second = '' + d.getSeconds();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    if (second.length < 2) second = '0' + second;
    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
  }
}

/**
 * SuiteTools NetSuite Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsLibraryNetSuite {
  private _stApp: SuiteToolsApp;
  private _stLibNsEmail: SuiteToolsLibraryNetSuiteEmail;
  private _stLibNsFile: SuiteToolsLibraryNetSuiteFile;
  private _stLibNsHttp: SuiteToolsLibraryNetSuiteHttp;
  private _stLibNsRecord: SuiteToolsLibraryNetSuiteRecord;
  private _stLibNsScript: SuiteToolsLibraryNetSuiteScript;
  private _stLibNsSearch: SuiteToolsLibraryNetSuiteSearch;
  private _stLibNsSuiteQl: SuiteToolsLibraryNetSuiteSuiteQl;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }
  get stLibNsEmail(): SuiteToolsLibraryNetSuiteEmail {
    return this._stLibNsEmail;
  }
  get stLibNsFile(): SuiteToolsLibraryNetSuiteFile {
    return this._stLibNsFile;
  }
  get stLibNsHttp(): SuiteToolsLibraryNetSuiteHttp {
    return this._stLibNsHttp;
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

    this._stLibNsEmail = new SuiteToolsLibraryNetSuiteEmail(this.stApp);
    this._stLibNsFile = new SuiteToolsLibraryNetSuiteFile(this.stApp);
    this._stLibNsHttp = new SuiteToolsLibraryNetSuiteHttp(this.stApp);
    this._stLibNsRecord = new SuiteToolsLibraryNetSuiteRecord(this.stApp);
    this._stLibNsScript = new SuiteToolsLibraryNetSuiteScript(this.stApp);
    this._stLibNsSearch = new SuiteToolsLibraryNetSuiteSearch(this.stApp);
    this._stLibNsSuiteQl = new SuiteToolsLibraryNetSuiteSuiteQl(this.stApp);
  }
}

/**
 * SuiteTools NetSuite Email Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsLibraryNetSuiteEmail {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteEmail:constructor() initiated', details: null });
    this._stApp = stApp;
  }

  /**
   * Send Email Notification
   *
   * @param subject - email subject
   * @param content - email core content
   */
  public sendNotification(subject: string, content: string) {
    log.debug({ title: 'SuiteToolsLibraryNetSuiteEmail:sendNotification() initiated', details: { subject: subject } });

    // TODO lookup instead of hardcode these
    // override values as needed
    const author = 123456789; // get from current user
    const replyTo = 'i@idev.systems'; // get from current user

    // TODO add recipient logic
    const recipients: string | string[] = replyTo; // default to replyTo
    // recipients = replyTo;
    // log.debug('sendNotification() recipients', recipients);

    // TODO add wrapper content around content
    const body = content;

    // send email
    email.send({ author: author, recipients: recipients, replyTo: replyTo, subject: subject, body: body });
    log.debug({
      title: 'SuiteToolsLibraryNetSuiteEmail:sendNotification() email sent',
      details: { author: author, recipients: recipients, replyTo: replyTo, subject: subject },
    });
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
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:getFile() fileObj', details: fileObj });

    return fileObj;
  }

  /**
   * Gets NetSuite file contents.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file contents
   */
  public getFileContents(id: number | string): string {
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:getFileContents() initiated', details: { id: id } });

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
    log.debug({ title: 'SuiteToolsLibraryNetSuiteFile:getFileURL() initiated', details: { fileName: fileName } });

    const fileObj = this.getFile(fileName);

    return fileObj.url;
  }
}

/**
 * SuiteTools NetSuite Http Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsLibraryNetSuiteHttp {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteHttp:constructor() initiated', details: null });
    this._stApp = stApp;
  }

  /**
   * Builds the NetSuite record URL.
   *
   * @param recordType - the record type
   * @param recordId - the record id
   */
  public buildRecordUrl(recordType: string, recordId: string): string {
    log.debug({
      title: 'SuiteToolsLibraryNetSuiteHttp:buildRecordUrl() initiated',
      details: { recordType: recordType, recordId: recordId },
    });
    const path = url.resolveRecord({
      recordType: recordType,
      recordId: recordId,
    });
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteHttp:buildRecordUrl() returning', details: path });

    return path;
  }

  // /**
  //  * Get HTTP page.
  //  *
  //  * @param url - the URL to the page to load
  //  * @returns string
  //  */
  // public getPage(url: string): string {
  //   log.debug({ title: 'SuiteToolsLibraryNetSuiteHttp:getPage() initiated', details: { url: url } });

  //   const response = https.get({ url: url });
  //   log.debug({ title: 'SuiteToolsLibraryNetSuiteHttp:getPage() response', details: response });
  //   const body = response.body;
  //   log.debug({ title: 'SuiteToolsLibraryNetSuiteHttp:getPage() body', details: body });

  //   return body;
  // }

  // /**
  //  * Get JSON HTTP page.
  //  *
  //  * @param url - the URL to the page to load
  //  * @returns string
  //  */
  // public getJsonPage(url: string): string {
  //   log.debug({ title: 'SuiteToolsLibraryNetSuiteHttp:getJsonPage() initiated', details: { url: url } });

  //   const response = https.get({ url: url });
  //   log.debug({ title: 'SuiteToolsLibraryNetSuiteHttp:getJsonPage() response', details: response });

  //   // check that response code is 200
  //   if (response.code !== 200) {
  //     throw new Error(`SuiteToolsLibraryNetSuiteHttp:getJsonPage() response code = ${response.code}`);
  //   }

  //   const body = response.body;
  //   log.debug({ title: 'SuiteToolsLibraryNetSuiteHttp:getJsonPage() body', details: body });

  //   const results = JSON.parse(body);
  //   log.debug({ title: 'SuiteToolsController:renderConcurrenciesForm() results =', details: results });

  //   return results;
  // }
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
   * @param values
   * @returns record id of newly created record if successful else 0
   */
  public createCustomRecord(recordType: string, values: object): number {
    log.debug({
      title: 'SuiteToolsLibraryNetSuiteRecord:createCustomRecord() initiated',
      details: { recordType: recordType, values: values },
    });
    let recordId = 0;

    try {
      const recordObj = record.create({
        type: recordType,
      });
      for (const field in values) {
        recordObj.setValue({ fieldId: field, value: values[field] });
      }
      recordId = recordObj.save({
        enableSourcing: false,
        ignoreMandatoryFields: true,
      });
    } catch (e) {
      log.error({ title: `SuiteToolsLibraryNetSuiteRecord:createCustomRecord - Error on ${recordType}`, details: e });
    }

    return recordId;
  }

  /**
   * Get custom record or list entry
   *
   * @param recordType
   * @param recordId
   * @returns value
   */
  public getCustomRecord(recordType: string, recordId: number): record.Record {
    log.debug({
      title: 'SuiteToolsLibraryNetSuiteRecord:getCustomRecord() initiated',
      details: { recordType: recordType, recordId: recordId },
    });

    try {
      const recordObj = record.load({
        type: recordType,
        id: recordId,
      });

      return recordObj;
    } catch (e) {
      log.error({ title: `SuiteToolsLibraryNetSuiteRecord:getCustomRecord - Error on ${recordType}`, details: e });
    }
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
   * Builds the SuiteScript script URL.
   *
   * @param accountId - the account id
   * @param scriptId - the script id
   * @param deploymentId - the deployment id
   * @param parameters - the parameters
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  buildScriptUrl(accountId: string, scriptId: string, deploymentId: string, params: any[]): string {
    log.debug({
      title: 'SuiteToolsLibraryNetSuiteScript:callScript() initiated',
      details: { scriptId: scriptId, deploymentId: deploymentId, params: params },
    });
    const scheme = 'https://';
    const host = url.resolveDomain({
      hostType: url.HostType.APPLICATION,
      accountId: accountId,
    });
    log.debug({ title: 'SuiteToolsLibraryNetSuiteScript:callScript() host', details: host });
    const path = url.resolveScript({
      scriptId: scriptId,
      deploymentId: deploymentId,
    });
    log.debug({ title: 'SuiteToolsLibraryNetSuiteScript:callScript() scriptUrl', details: path });
    const parameters = '&' + params.join('&');
    const scriptUrl = scheme + host + path + parameters;
    log.debug({ title: 'SuiteToolsLibraryNetSuiteScript:callScript() parameters', details: parameters });
    log.debug({ title: 'SuiteToolsLibraryNetSuiteScript:callScript() returning', details: scriptUrl });

    return scriptUrl;
  }

  /**
   * Redirects to SuiteTools script.
   *
   * @param parameters - the parameters
   */
  public redirectToSuiteTools(params: object): void {
    this.redirectToScript(runtime.getCurrentScript().id, runtime.getCurrentScript().deploymentId, params);
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
    setSession = false,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any[] {
    log.debug({
      title: `SuiteToolsLibraryNetSuiteSearch:search() initiated`,
      details: { type: type, columns: columns, filters: filters, rows: rows, setSession: setSession },
    });

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

    // default number of required values if not specified
    if (!rows) {
      rows = '1000';
    }

    // run the search
    const searchResults = stSearch.run().getRange({
      start: 0,
      end: parseInt(rows),
    });

    log.debug({ title: 'SuiteToolsLibraryNetSuiteSearch:search() returning', details: searchResults });

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
      title: `SuiteToolsLibraryNetSuiteSearch:run() initiated`,
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

    log.debug({ title: 'SuiteToolsLibraryNetSuiteSearch:run() returning', details: searchResults });

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
    // log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:getSqlValue() resultSet =', details: resultSet });
    // grab the first row if it exists
    if (resultSet.length > 0) {
      const resultJson = resultSet[0];
      // log.debug({ title: 'SuiteToolsLibraryNetSuiteSuiteQl:getSqlValue() resultJson = ', details: resultJson });
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
