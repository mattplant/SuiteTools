/**
 * SuiteTools Library
 *
 * This is the library file for SuiteTools.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * Copyright (C) 2024  Matthew Plant
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

import * as email from 'N/email';
import * as file from 'N/file';
import * as log from 'N/log';
import * as query from 'N/query';
import * as record from 'N/record';
import * as redirect from 'N/redirect';
import * as runtime from 'N/runtime';
import * as search from 'N/search';
import * as task from 'N/task';
import * as url from 'N/url';

/**
 * Common functionality between SuiteTools App and SuiteTools API
 */
export class SuiteToolsCommon {
  // classes
  private _stLib: SuiteToolsCommonLibrary;
  private _stSettings: SuiteToolsCommonSettings;
  // application url
  private _appScriptId = 'customscript_idev_suitetools_app';
  private _appDeploymentId = 'customdeploy_idev_suitetools_app';
  private _appUrl: string;
  // the application directory in the /SuiteScripts folder
  private _appDir = 'SuiteTools';
  // application files
  private _appCssFile = 'dist/output.css';
  private _appJsFile = 'dist/app-bundle.js';
  // application settings record
  private _appSettingsRecord = 'customrecord_idev_suitetools_settings'; // the application settings custom record

  get stSettings(): SuiteToolsCommonSettings {
    return this._stSettings;
  }
  get stLib(): SuiteToolsCommonLibrary {
    return this._stLib;
  }

  get appUrl(): string {
    return this._appUrl;
  }
  get appDir(): string {
    return this._appDir;
  }
  get appCssFile(): string {
    return this._appCssFile;
  }
  get appJsFile(): string {
    return this._appJsFile;
  }
  get appSettingsRecord(): string {
    return this._appSettingsRecord;
  }
  get runtime() {
    return runtime;
  }
  get isAdmin(): boolean {
    return runtime.getCurrentUser().roleId == 'administrator';
  }
  get isProduction(): boolean {
    return String(runtime.EnvType[runtime.envType]) === 'PRODUCTION';
  }

  constructor() {
    // log.debug({ title: 'SuiteToolsCommon:constructor() initiated', details: null });
    this._stLib = new SuiteToolsCommonLibrary(this);
    this._stSettings = new SuiteToolsCommonSettings(this);

    this._appUrl = url.resolveScript({
      scriptId: this._appScriptId,
      deploymentId: this._appDeploymentId,
      returnExternalUrl: false,
    });
  }
}

/**
 * SuiteTools Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibrary {
  private _stCommon: SuiteToolsCommon;
  private _stLibGeneral: SuiteToolsCommonLibraryGeneral;
  private _stLibNs: SuiteToolsCommonLibraryNetSuite;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  get stLibGeneral(): SuiteToolsCommonLibraryGeneral {
    return this._stLibGeneral;
  }

  get stLibNs(): SuiteToolsCommonLibraryNetSuite {
    return this._stLibNs;
  }

  constructor(stCommon: SuiteToolsCommon) {
    // log.debug({ title: 'SuiteToolsCommonLibrary:constructor() initiated', details: null });
    this._stCommon = stCommon;
    this._stLibGeneral = new SuiteToolsCommonLibraryGeneral(this.stCommon);
    this._stLibNs = new SuiteToolsCommonLibraryNetSuite(this.stCommon);
  }
}

/**
 * SuiteTools General Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryGeneral {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    // log.debug({ title: 'SuiteToolsCommonLibraryGeneral:constructor() initiated', details: null });
    this._stCommon = stCommon;
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
export class SuiteToolsCommonLibraryNetSuite {
  private _stCommon: SuiteToolsCommon;
  private _stLibNsEmail: SuiteToolsCommonLibraryNetSuiteEmail;
  private _stLibNsFile: SuiteToolsCommonLibraryNetSuiteFile;
  private _stLibNsHttp: SuiteToolsCommonLibraryNetSuiteHttp;
  private _stLibNsRecord: SuiteToolsCommonLibraryNetSuiteRecord;
  private _stLibNsScript: SuiteToolsCommonLibraryNetSuiteScript;
  private _stLibNsSearch: SuiteToolsCommonLibraryNetSuiteSearch;
  private _stLibNsSuiteQl: SuiteToolsCommonLibraryNetSuiteSuiteQl;
  private _stLibNsTask: SuiteToolsCommonLibraryNetSuiteTask;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }
  get stLibNsEmail(): SuiteToolsCommonLibraryNetSuiteEmail {
    return this._stLibNsEmail;
  }
  get stLibNsFile(): SuiteToolsCommonLibraryNetSuiteFile {
    return this._stLibNsFile;
  }
  get stLibNsHttp(): SuiteToolsCommonLibraryNetSuiteHttp {
    return this._stLibNsHttp;
  }
  get stLibNsRecord(): SuiteToolsCommonLibraryNetSuiteRecord {
    return this._stLibNsRecord;
  }
  get stLibNsScript(): SuiteToolsCommonLibraryNetSuiteScript {
    return this._stLibNsScript;
  }
  get stLibNsSearch(): SuiteToolsCommonLibraryNetSuiteSearch {
    return this._stLibNsSearch;
  }
  get stLibNsSuiteQl(): SuiteToolsCommonLibraryNetSuiteSuiteQl {
    return this._stLibNsSuiteQl;
  }
  get stLibNsTask(): SuiteToolsCommonLibraryNetSuiteTask {
    return this._stLibNsTask;
  }

  constructor(stCommon: SuiteToolsCommon) {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuite:constructor() initiated', details: null });
    this._stCommon = stCommon;

    this._stLibNsEmail = new SuiteToolsCommonLibraryNetSuiteEmail(this.stCommon);
    this._stLibNsFile = new SuiteToolsCommonLibraryNetSuiteFile(this.stCommon);
    this._stLibNsHttp = new SuiteToolsCommonLibraryNetSuiteHttp(this.stCommon);
    this._stLibNsRecord = new SuiteToolsCommonLibraryNetSuiteRecord(this.stCommon);
    this._stLibNsScript = new SuiteToolsCommonLibraryNetSuiteScript(this.stCommon);
    this._stLibNsSearch = new SuiteToolsCommonLibraryNetSuiteSearch(this.stCommon);
    this._stLibNsSuiteQl = new SuiteToolsCommonLibraryNetSuiteSuiteQl(this.stCommon);
    this._stLibNsTask = new SuiteToolsCommonLibraryNetSuiteTask(this.stCommon);
  }
}

/**
 * SuiteTools NetSuite Email Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteEmail {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteEmail:constructor() initiated', details: null });
    this._stCommon = stCommon;
  }

  /**
   * Send Email Notification
   *
   * @param subject - email subject
   * @param content - email core content
   */
  public sendNotification(subject: string, content: string) {
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteEmail:sendNotification() initiated',
      details: { subject: subject },
    });

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
      title: 'SuiteToolsCommonLibraryNetSuiteEmail:sendNotification() email sent',
      details: { author: author, recipients: recipients, replyTo: replyTo, subject: subject },
    });
  }
}

/**
 * SuiteTools NetSuite File Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteFile {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:constructor() initiated', details: null });
    this._stCommon = stCommon;
  }

  /**
   * Get NetSuite file object.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file
   */
  private getFileObj(id: number | string): file.File {
    log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileObj() initiated', details: { id: id } });

    let fileObj: file.File;
    if (typeof id === 'string') {
      const filePath = `/SuiteScripts/${this.stCommon.appDir}/${id}`;
      fileObj = file.load({ id: filePath });
    } else {
      fileObj = file.load({ id: id });
    }
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileObj() fileObj', details: fileObj });

    return fileObj;
  }

  /**
   * Gets NetSuite file contents.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file contents
   */
  public getFileContents(id: number | string): string {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileContents() initiated', details: { id: id } });

    const fileObj = this.getFileObj(id);

    return fileObj.getContents();
  }

  /**
   * Gets NetSuite file contents.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file contents
   */
  public getFileLastModified(id: number | string): string {
    log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileContents() initiated', details: { id: id } });

    const fileObj = this.getFileObj(id);
    const sql = `select TO_CHAR(File.LastModifiedDate, 'YYYY-MM-DD HH24:MI:SS') as lastModifiedDate from file where id = ${fileObj.id}`;
    const result = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    const lastModifiedDate = result[0].lastmodifieddate;
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileContents() lastModifiedDate',
      details: lastModifiedDate,
    });

    return lastModifiedDate;
  }

  /**
   * Gets NetSuite file URL.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file url
   */
  public getFileURL(fileName: string): string {
    log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileURL() initiated', details: { fileName: fileName } });

    const fileObj = this.getFileObj(fileName);

    return fileObj.url;
  }
}

/**
 * SuiteTools NetSuite Http Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteHttp {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteHttp:constructor() initiated', details: null });
    this._stCommon = stCommon;
  }

  /**
   * Builds the NetSuite record URL.
   *
   * @param recordType - the record type
   * @param recordId - the record id
   */
  public buildRecordUrl(recordType: string, recordId: string): string {
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteHttp:buildRecordUrl() initiated',
      details: { recordType: recordType, recordId: recordId },
    });
    const path = url.resolveRecord({
      recordType: recordType,
      recordId: recordId,
    });
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteHttp:buildRecordUrl() returning', details: path });

    return path;
  }

  // /**
  //  * Get HTTP page.
  //  *
  //  * @param url - the URL to the page to load
  //  * @returns string
  //  */
  // public getPage(url: string): string {
  //   log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteHttp:getPage() initiated', details: { url: url } });

  //   const response = https.get({ url: url });
  //   log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteHttp:getPage() response', details: response });
  //   const body = response.body;
  //   log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteHttp:getPage() body', details: body });

  //   return body;
  // }

  // /**
  //  * Get JSON HTTP page.
  //  *
  //  * @param url - the URL to the page to load
  //  * @returns string
  //  */
  // public getJsonPage(url: string): string {
  //   log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteHttp:getJsonPage() initiated', details: { url: url } });

  //   const response = https.get({ url: url });
  //   log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteHttp:getJsonPage() response', details: response });

  //   // check that response code is 200
  //   if (response.code !== 200) {
  //     throw new Error(`SuiteToolsCommonLibraryNetSuiteHttp:getJsonPage() response code = ${response.code}`);
  //   }

  //   const body = response.body;
  //   log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteHttp:getJsonPage() body', details: body });

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
export class SuiteToolsCommonLibraryNetSuiteRecord {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteRecord:constructor() initiated', details: null });
    this._stCommon = stCommon;
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
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:createCustomRecord() initiated',
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
      log.error({
        title: `SuiteToolsCommonLibraryNetSuiteRecord:createCustomRecord - Error on ${recordType}`,
        details: e,
      });
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
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:getCustomRecord() initiated',
      details: { recordType: recordType, recordId: recordId },
    });

    try {
      const recordObj = record.load({
        type: recordType,
        id: recordId,
      });

      return recordObj;
    } catch (e) {
      log.error({
        title: `SuiteToolsCommonLibraryNetSuiteRecord:getCustomRecord - Error on ${recordType}`,
        details: e,
      });
    }
  }

  /**
   * Update custom record or list entry
   *
   * @param recordType
   * @param recordId
   * @returns true if successful else false
   */
  public updateCustomRecord(recordType: string, recordId: string, values: object): boolean {
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:updateCustomRecord() initiated',
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
      log.error({
        title: `SuiteToolsCommonLibraryNetSuiteRecord:updateCustomRecord - Error on ${recordType}`,
        details: e,
      });
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
          title: 'SuiteToolsCommonLibraryNetSuiteRecord:clearCustomRecord() deleting record',
          details: { recordType: recordType, recordID: recordId },
        });
        record.delete({ type: recordType, id: recordId });
      }
      success = true;
    } catch (e) {
      log.error({
        title: `SuiteToolsCommonLibraryNetSuiteRecord:clearCustomRecord - Error on ${recordType}`,
        details: e,
      });
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
          title: 'SuiteToolsCommonLibraryNetSuiteRecord:disableCustomRecord() disabling record',
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
      log.error({
        title: `SuiteToolsCommonLibraryNetSuiteRecord:disableCustomRecord - Error on ${recordType}`,
        details: e,
      });
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
    const resultSet = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:getCustomListInternalId() - resultSet',
      details: resultSet,
    });
    if (resultSet.length > 0) {
      result = resultSet[0].internalid;
    }
    log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteRecord:getCustomListInternalId() returning', details: result });

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
    const resultSet = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:getCustomRecordInternalId() - resultSet',
      details: resultSet,
    });
    if (resultSet.length > 0) {
      result = resultSet[0].internalid;
    }
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:getCustomRecordInternalId() returning',
      details: result,
    });

    return result;
  }
}

/**
 * SuiteTools NetSuite Script Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteScript {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteScript:constructor() initiated', details: null });
    this._stCommon = stCommon;
  }

  // /**
  //  * Builds the SuiteScript script URL.
  //  *
  //  * @param accountId - the account id
  //  * @param scriptId - the script id
  //  * @param deploymentId - the deployment id
  //  * @param parameters - the parameters
  //  */
  // // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // buildScriptUrl(accountId: string, scriptId: string, deploymentId: string, params: any[]): string {
  //   log.debug({
  //     title: 'SuiteToolsCommonLibraryNetSuiteScript:callScript() initiated',
  //     details: { scriptId: scriptId, deploymentId: deploymentId, params: params },
  //   });
  //   const scheme = 'https://';
  //   const host = url.resolveDomain({
  //     hostType: url.HostType.APPLICATION,
  //     accountId: accountId,
  //   });
  //   log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteScript:callScript() host', details: host });
  //   const path = url.resolveScript({
  //     scriptId: scriptId,
  //     deploymentId: deploymentId,
  //   });
  //   log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteScript:callScript() scriptUrl', details: path });
  //   const parameters = '&' + params.join('&');
  //   const scriptUrl = scheme + host + path + parameters;
  //   log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteScript:callScript() parameters', details: parameters });
  //   log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteScript:callScript() returning', details: scriptUrl });

  //   return scriptUrl;
  // }

  // /**
  //  * Redirects to SuiteTools script.
  //  *
  //  * @param parameters - the parameters
  //  */
  // public redirectToSuiteTools(params: object): void {
  //   this.redirectToScript(runtime.getCurrentScript().id, runtime.getCurrentScript().deploymentId, params);
  // }

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
        title: 'SuiteToolsCommonLibraryNetSuiteScript:redirectToScript() initiated',
        details: { scriptId: scriptId, deploymentId: deploymentId, params: params },
      });
      const scriptUrl = url.resolveScript({
        scriptId: scriptId,
        deploymentId: deploymentId,
      });
      log.debug({
        title: 'SuiteToolsCommonLibraryNetSuiteScript:redirectToScript() redirecting to',
        details: scriptUrl,
      });
      redirect.redirect({
        url: scriptUrl,
        parameters: params,
      });
    } catch (e) {
      log.error('SuiteToolsCommonLibraryNetSuiteScript:redirectToScript() error', e);
    }
  }
}

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
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteSearch:constructor() initiated', details: null });
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

/**
 * SuiteTools NetSuite SuiteQL Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteSuiteQl {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteSuiteQl:constructor() initiated', details: null });
    this._stCommon = stCommon;
  }

  /**
   * Runs the SuiteQL query.
   *
   * @param sql - the sql query
   * @returns the query results
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public query(sql: string): any[] {
    if (sql) {
      // remove line endings
      sql = sql.toString().replace(/(\r\n|\n|\r)/gm, ' ');
    }
    log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteSuiteQl:query() initiated with ', details: { sql: sql } });

    let results = [];
    try {
      results = query.runSuiteQL({ query: sql }).asMappedResults();
    } catch (error) {
      log.error({ title: 'SuiteToolsCommonLibraryNetSuiteSuiteQl:query() error', details: error });
      results = [];
    }
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteSuiteQl:query() returning', details: results });

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
    log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteSuiteQl:getSqlValue() returning', details: resultField });

    return String(resultField);
  }
}

/**
 * SuiteTools NetSuite Task Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteTask {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Submits the NetSuite task.
   *
   * @param scriptType
   * @param scriptId
   * @param deploymentId
   * @param params
   * @returns the script task id
   */
  public submit(taskType: string, scriptId: string, deploymentId: string, params: object): string {
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteTask:submit() initiated',
      details: { taskType: taskType, scriptId: scriptId, deploymentId: deploymentId },
    });

    let scriptTaskId = '';
    let taskTypeEnum: task.TaskType = null;
    // set the task type to the task.TaskType enum
    if (taskType === 'SCHEDULED_SCRIPT') {
      taskTypeEnum = task.TaskType.SCHEDULED_SCRIPT;
    } else if (taskType === 'MAP_REDUCE') {
      taskTypeEnum = task.TaskType.MAP_REDUCE;
    } else if (taskType === 'CSV_IMPORT') {
      taskTypeEnum = task.TaskType.CSV_IMPORT;
    } else if (taskType === 'ENTITY_DEDUPLICATION') {
      taskTypeEnum = task.TaskType.ENTITY_DEDUPLICATION;
    } else if (taskType === 'WORKFLOW_TRIGGER') {
      taskTypeEnum = task.TaskType.WORKFLOW_TRIGGER;
    } else if (taskType === 'SEARCH') {
      taskTypeEnum = task.TaskType.SEARCH;
    } else if (taskType === 'RECORD_ACTION') {
      taskTypeEnum = task.TaskType.RECORD_ACTION;
    } else if (taskType === 'SUITE_QL') {
      taskTypeEnum = task.TaskType.SUITE_QL;
    } else if (taskType === 'QUERY') {
      taskTypeEnum = task.TaskType.QUERY;
    }
    if (taskTypeEnum) {
      // initiate the last logins map/reduce script
      const scriptTask = task.create({
        taskType: task.TaskType.MAP_REDUCE, // Cast to the correct type
        scriptId: scriptId,
        deploymentId: deploymentId,
        params: params,
      });
      scriptTaskId = scriptTask.submit();
    }
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteTask:submit() returning',
      details: scriptTaskId,
    });

    return scriptTaskId;
  }
}

type LastLogins = { finished: string; data: { name: { type: string; name: string }; lastLogin: string }[] };

/**
 * Settings info for SuiteTools App and SuiteTools API
 */
export class SuiteToolsCommonSettings {
  private _stCommon: SuiteToolsCommon;
  private _appBundle: string;
  private _recordId: number;
  private _cssUrl: string;
  private _jsUrl: string;
  private _devMode: boolean;
  private _lastLogins: LastLogins;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }
  get appBundle(): string {
    return this._appBundle;
  }
  get recordId(): number {
    return this._recordId;
  }
  get cssUrl(): string {
    return this._cssUrl;
  }
  get jsUrl(): string {
    return this._jsUrl;
  }
  get devMode(): boolean {
    return this._devMode;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get lastLogins(): LastLogins {
    return this._lastLogins;
  }

  constructor(stCommon: SuiteToolsCommon) {
    // log.debug({ title: 'SuiteToolsCommonSettings:constructor() initiated', details: null });
    this._stCommon = stCommon;
  }

  /**
   * Get Settings
   */
  public getSettings(): void {
    log.debug({ title: `SuiteToolsCommonSettings:getSettings() initiated`, details: '' });

    const sql = `
    SELECT
      ${this.stCommon.appSettingsRecord}.id,
      ${this.stCommon.appSettingsRecord}.custrecord_idev_st_config_css_url AS cssUrl,
      ${this.stCommon.appSettingsRecord}.custrecord_idev_st_config_js_url AS jsUrl,
      ${this.stCommon.appSettingsRecord}.custrecord_idev_st_setting_dev_mode AS devMode,
      ${this.stCommon.appSettingsRecord}.custrecord_idev_st_config_last_logins AS lastLogins,
    FROM
      ${this.stCommon.appSettingsRecord}
    WHERE
      isInactive = 'F'
    `;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    log.debug({ title: `SuiteToolsCommonSettings:getSettings() sqlResults = `, details: sqlResults });

    if (sqlResults.length === 0) {
      // since no results then create core configs
      log.error({ title: `SuiteToolsCommonSettings:getSettings() no results`, details: '' });
      this.createCoreConfigs();
    } else {
      this._recordId = sqlResults[0].id;
      this._cssUrl = sqlResults[0].cssurl;
      this._jsUrl = sqlResults[0].jsurl;
      this._devMode = sqlResults[0].devmode === 'T' ? true : false;
      this._lastLogins = JSON.parse(sqlResults[0].lastlogins);
      this._appBundle = this.stCommon.stLib.stLibNs.stLibNsFile.getFileLastModified(this.stCommon.appJsFile);

      // if core configs are not set then set them
      if (!this._cssUrl || !this._jsUrl) {
        log.error({ title: `SuiteToolsCommonSettings:getSettings() missing core configs`, details: '' });
        this.updateCoreConfigs();
      }
    }
  }

  private updateCoreConfigs(): void {
    log.debug({ title: `SuiteToolsCommonSettings:saveCoreConfigs() initiated`, details: '' });

    const coreConfigs = this.determineCoreConfigs();
    const success = this.stCommon.stLib.stLibNs.stLibNsRecord.updateCustomRecord(
      this.stCommon.appSettingsRecord,
      String(this._recordId),
      coreConfigs,
    );

    log.debug({ title: `SuiteToolsCommonSettings:saveCoreConfigs() completed successfully?`, details: success });
  }

  private createCoreConfigs(): void {
    log.debug({ title: `SuiteToolsCommonSettings:createCoreConfigs() initiated`, details: '' });

    const coreConfigs = this.determineCoreConfigs();
    this.stCommon.stLib.stLibNs.stLibNsRecord.createCustomRecord(this.stCommon.appSettingsRecord, coreConfigs);

    log.debug({ title: `SuiteToolsCommonSettings:createCoreConfigs() completed`, details: null });
  }

  /**
   * Determine the core configs
   *
   * Helper function for updateCoreConfigs() and createCoreConfigs()
   */
  private determineCoreConfigs(): object {
    // log.debug({ title: `SuiteToolsCommonSettings:determineCoreConfigs() initiated`, details: '' });

    const coreConfigs = {
      custrecord_idev_st_config_css_url: this.stCommon.stLib.stLibNs.stLibNsFile.getFileURL(this.stCommon.appCssFile),
      custrecord_idev_st_config_js_url: this.stCommon.stLib.stLibNs.stLibNsFile.getFileURL(this.stCommon.appJsFile),
    };
    log.debug({ title: `SuiteToolsCommonSettings:determineCoreConfigs() returning`, details: coreConfigs });

    return coreConfigs;
  }
}
