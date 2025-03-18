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
import * as https from 'N/https';
import * as query from 'N/query';
import * as record from 'N/record';
import * as redirect from 'N/redirect';
import * as runtime from 'N/runtime';
import * as search from 'N/search';
import * as task from 'N/task';
import * as url from 'N/url';

/**
 * Common functionality between SuiteTools App and SuiteTools API
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommon {
  // classes
  private _stJobs: SuiteToolsCommonJobs;
  private _stSettings: SuiteToolsCommonSettings;
  private _stLib: SuiteToolsCommonLibrary;
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

  get stJobs(): SuiteToolsCommonJobs {
    return this._stJobs;
  }
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
    this._stJobs = new SuiteToolsCommonJobs(this);
    this._stSettings = new SuiteToolsCommonSettings(this);
    this._stLib = new SuiteToolsCommonLibrary(this);

    // TODO should this be moved into the bootstrap() method?
    this._appUrl = url.resolveScript({
      scriptId: this._appScriptId,
      deploymentId: this._appDeploymentId,
      returnExternalUrl: false,
    });
  }
}

/**
 * Jobs support for SuiteTools App and SuiteTools API
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonJobs {
  private _stCommon: SuiteToolsCommon;
  private _appJobRecord = 'customrecord_idev_suitetools_job';
  private _appJobRunRecord = 'customrecord_idev_suitetools_job_run';

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Initializes jobs
   *
   * Add the jobs when we first install the SuiteTools app.
   */
  public initializeJobs(): void {
    log.debug({ title: `SuiteToolsCommonJobs:initializeJobs() initiated`, details: '' });

    // ADD THE DEFAULT JOBS
    // recent script errors job
    const recentScriptErrorsJob = {
      name: 'Recent Script Errors',
      custrecord_idev_st_mr_job_desc:
        'The job notifies user of recent errors (Error, Emergency, System) across all script execution logs.',
      custrecord_idev_st_mr_job_scheduled: true,
      custrecord_idev_st_mr_job_notify: true,
    };
    this.stCommon.stLib.stLibNs.stLibNsRecord.createCustomRecordEntry(this._appJobRecord, recentScriptErrorsJob);
    // last logins job
    const lastLoginsJob = {
      name: 'Last Logins',
      custrecord_idev_st_mr_job_desc: 'This job get the last logins for the users, tokens and integrations.',
      custrecord_idev_st_mr_job_scheduled: false, // script can not be scheduled since it needs to be run in UI
      custrecord_idev_st_mr_job_notify: false, // no need to notify user since not able to be scheduled
    };
    this.stCommon.stLib.stLibNs.stLibNsRecord.createCustomRecordEntry(this._appJobRecord, lastLoginsJob);
    log.debug({ title: `SuiteToolsCommonJobs::initializeJobs() completed`, details: null });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getScheduledJobs(): any[] {
    log.debug('SuiteToolsCommonJobs:getScheduledJobs() initiated', null);

    const customRecord = 'customrecord_idev_suitetools_job';
    const sql = `SELECT
      ${customRecord}.id,
      ${customRecord}.name,
    FROM
      ${customRecord}
    WHERE
      ${customRecord}.isinactive = 'F'
      AND custrecord_idev_st_mr_job_scheduled = 'T'
    ORDER BY
      ${customRecord}.id ASC`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      log.audit(`getJobs() - No active scheduled job records found`, null);
    } else {
      log.debug({ title: 'SuiteToolsCommonJobs:getScheduledJobs() returning', details: sqlResults });
    }

    return sqlResults;
  }

  /**
   * Creates job run record
   *
   * @param id - job id
   * @returns job run record id
   */
  public createJobRunRecord(id: string): number {
    log.debug('SuiteToolsCommonJobs:createJobRunRecord() initiated', { id });

    // TODO should we save job data also?

    // save new job run record
    const jobRunRecordId = this.stCommon.stLib.stLibNs.stLibNsRecord.createCustomRecordEntry(this._appJobRunRecord, {
      custrecord_idev_st_mr_job_run_job_id: id,
    });
    log.debug({ title: 'SuiteToolsCommonJobs:createJobRunRecord() created job run record', details: jobRunRecordId });

    return jobRunRecordId;
  }

  /**
   * Updates job run record
   *
   * @param id - job run record id
   * @param completed - did the job complete successfully?
   * @param results - job results
   */
  public updateJobRunRecord(id: string, completed: boolean, results: string): void {
    log.debug('SuiteToolsCommonJobs:updateJobRunRecord() initiated', { id, completed, results });
    // update job run record
    this.stCommon.stLib.stLibNs.stLibNsRecord.updateCustomRecordEntry(this._appJobRunRecord, id, {
      custrecord_idev_st_mr_job_run_completed: completed,
      custrecord_idev_st_mr_job_run_results: results,
    });
  }

  /**
   * Get Job Last Run
   *
   * Look up via the job run records when the last time a job was run
   *
   * @param id - the job to look up
   * @returns results
   */
  public getJobLastRun(id: string): string {
    log.debug({ title: `SuiteToolsCommonJobs:getJobLastRun() initiated`, details: { id: id } });
    let result = '';
    const customRecord = this._appJobRunRecord;
    const sql = `SELECT TOP 1
        TO_CHAR ( ${customRecord}.created, 'YYYY-MM-DD HH24:MI:SS' ) AS lastrun
      FROM
        ${customRecord}
      WHERE
        ${customRecord}.custrecord_idev_st_mr_job_run_job_id = ${id}
      ORDER by
        ${customRecord}.created DESC`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length !== 0) {
      result = String(sqlResults[0].lastrun);
    }

    return result;
  }

  /**
   * Runs job
   *
   * @param jobId
   * @param jobData
   * @returns void
   */
  public async runJob(jobId: string, jobData: object): Promise<void> {
    log.debug('SuiteToolsCommonJobs:runJob() initiated', { jobId, jobData });
    let result: object;
    let completed = false;
    if (jobId) {
      // load job details
      const jobDetails = this.stCommon.stLib.stLibNs.stLibNsRecord.getCustomRecord(this._appJobRecord, Number(jobId));
      if (jobDetails) {
        log.debug('SuiteToolsCommonJobs:runJob() job details', jobDetails);
        const lastRun = this.getJobLastRun(jobId);
        // create new job run record
        const jobRunId = this.createJobRunRecord(jobId);
        // execute the job
        log.debug('SuiteToolsCommonJobs:runJob() executing job', jobId);
        switch (String(jobId)) {
          case '1': // Recent Script Errors
            result = this.getRecentScriptErrorsJob(lastRun);
            completed = true;
            break;
          case '2': // Last Logins
            result = this.initiateLastLoginsJob(jobData);
            completed = true;
            break;
          default:
            log.error('SuiteToolsCommonJobs:runJob() error', `Unknown job id: ${jobId}`);
        }
        log.debug('SuiteToolsCommonJobs:runJob() job processed', { jobId, completed, result });
        // update job run record after execution
        this.updateJobRunRecord(String(jobRunId), completed, JSON.stringify(result));
        // send notification email if job is set to notify
        const notify = jobDetails.getValue('custrecord_idev_st_mr_job_notify');
        if (notify) {
          const notifyAuthor = this.stCommon.stSettings.notifyAuthor;
          const notifyEmail = this.stCommon.stSettings.notifyEmail;
          this.stCommon.stLib.stLibNs.stLibNsEmail.sendNotification(
            notifyAuthor,
            [notifyEmail],
            notifyEmail,
            'SuiteTools Job Notification',
            JSON.stringify(result),
          );
        }
      } else {
        log.error('SuiteToolsCommonJobs:runJob() error', `Job details not found for job id: ${jobId}`);
      }
    } else {
      log.error('SuiteToolsCommonJobs:runJob() error', 'No job id provided');
    }
  }

  /**
   * Gets recent script errors
   *
   * @param lastRun - last run timestamp
   * @returns recent script errors
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getRecentScriptErrorsJob(lastRun: string): any[] {
    log.debug({
      title: `SuiteToolsCommonJobs:getRecentScriptErrorsJob() initiated`,
      details: { lastRun },
    });
    // get the errors from the script execution log
    let levels = ['ERROR', 'EMERGENCY', 'SYSTEM'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any[] = [];
    let sql = `SELECT
      ScriptNote.internalid AS id,
      TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD HH24:MI:SS' ) AS timestamp,
      ScriptNote.type,
      script.scripttype,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      BUILTIN.DF( script.name ) || ' (' || script.id  || ')' AS scriptname,
      ScriptNote.title, REPLACE( detail, '"', '""' ) AS detail
    FROM ScriptNote
    INNER JOIN script
      ON ScriptNote.scripttype = script.id`;
    // add where clause
    const where: string[] = [];
    if (levels) {
      if (Array.isArray(levels)) {
        levels = levels.map((type) => {
          return `'${type.toUpperCase()}'`;
        });
        where.push(`ScriptNote.type IN (${levels.join(',')})`);
      }
    }
    // add in time filter
    if (lastRun) {
      where.push(`ScriptNote.date > TO_DATE('${lastRun}', 'YYYY-MM-DD HH24:MI:SS')`);
    } else {
      where.push(`ScriptNote.date > SYSDATE - ( 60 / 1440 )`); // last 60 minutes
    }
    // add where clause
    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    // add order by
    sql += ` ORDER BY ScriptNote.internalId DESC`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length !== 0) {
      result = sqlResults;
    }

    return result;
  }

  /**
   * Initiate last logins job
   *
   * @param requestBodyData
   * @returns object
   */
  public initiateLastLoginsJob(requestBodyData: object): object {
    log.debug({ title: 'SuiteToolsCommonJobs:initiateLastLoginsJob() initiated', details: requestBodyData });
    let message = '';
    let entityRecords: object;

    // get the entity records (integration and tokens) from the request body
    if (Array.isArray(requestBodyData) && requestBodyData.every((item) => typeof item === 'object' && item !== null)) {
      entityRecords = requestBodyData;
      log.debug({ title: 'SuiteToolsCommonJobs:initiateLastLoginsJob() set entity records', details: entityRecords });
    }

    // TODO users
    // const response = this.stApi.stApiModel.getUsers('U');
    // if (response && Array.isArray(response.data) && response.data.length > 0) {
    //   for (const user of response.data) {
    //     entityRecords.push({
    //       type: 'user',
    //       name: user['email'],
    //     });
    //   }
    // }

    log.debug({
      title: 'SuiteToolsCommonJobs:initiateLastLoginsJob() identity records',
      details: entityRecords,
    });
    if (entityRecords) {
      // submit the task
      const params = {
        custscript_idev_st_mr_logins_entity: JSON.stringify(entityRecords),
        custscript_idev_st_mr_logins_set_id: this.stCommon.stSettings.recordId,
      };
      const scriptTaskId = this.stCommon.stLib.stLibNs.stLibNsTask.submit(
        'MAP_REDUCE',
        'customscript_idev_suitetools_mr_logins',
        'customdeploy_idev_suitetools_mr_logins',
        params,
      );
      message = 'Last logins script initiated with task id of ' + scriptTaskId;
      // NOTE: the results are saved in the summary step of the last logins script
    } else {
      message = 'No active entity records found';
    }
    log.debug({ title: 'SuiteToolsCommonJobs:initiateLastLoginsJob() returning', details: message });

    return {
      data: {},
      message: message,
    };
  }
}

// define type for Last Logins data
type LastLogins = { finished: string; data: { name: { type: string; name: string }; lastLogin: string }[] };

/**
 * Settings info for SuiteTools App and SuiteTools API
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonSettings {
  private _stCommon: SuiteToolsCommon;
  private _appBundle: string;
  private _recordId: number;
  private _cssUrl: string;
  private _jsUrl: string;
  private _devMode: boolean;
  private _notifyAuthor: number;
  private _notifyEmail: string;
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
  get notifyAuthor(): number {
    return this._notifyAuthor;
  }
  get notifyEmail(): string {
    return this._notifyEmail;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get lastLogins(): LastLogins {
    return this._lastLogins;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Get Settings
   */
  public getSettings(): boolean {
    log.debug({ title: `SuiteToolsCommonSettings:getSettings() initiated`, details: '' });
    let settingsFound = false;

    const sql = `
    SELECT
      ${this.stCommon.appSettingsRecord}.id,
      ${this.stCommon.appSettingsRecord}.custrecord_idev_st_config_css_url AS cssUrl,
      ${this.stCommon.appSettingsRecord}.custrecord_idev_st_config_js_url AS jsUrl,
      ${this.stCommon.appSettingsRecord}.custrecord_idev_st_setting_dev_mode AS devMode,
      ${this.stCommon.appSettingsRecord}.custrecord_idev_st_setting_notify_author AS notifyAuthor,
      ${this.stCommon.appSettingsRecord}.custrecord_idev_st_setting_notify_email AS notifyEmail,
      ${this.stCommon.appSettingsRecord}.custrecord_idev_st_config_last_logins AS lastLogins,
    FROM
      ${this.stCommon.appSettingsRecord}
    WHERE
      isInactive = 'F'
    `;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    log.debug({ title: `SuiteToolsCommonSettings:getSettings() sqlResults = `, details: sqlResults });

    if (sqlResults.length > 0) {
      // set the settings to the first returned result
      this._recordId = sqlResults[0].id;
      this._cssUrl = sqlResults[0].cssurl;
      this._jsUrl = sqlResults[0].jsurl;
      this._devMode = sqlResults[0].devmode === 'T' ? true : false;
      this._notifyAuthor = sqlResults[0].notifyauthor;
      this._notifyEmail = sqlResults[0].notifyemail;
      this._lastLogins = JSON.parse(sqlResults[0].lastlogins);
      this._appBundle = this.stCommon.stLib.stLibNs.stLibNsFile.getFileLastModified(this.stCommon.appJsFile);
      settingsFound = true;
    }

    return settingsFound;
  }

  public initializeApp(): void {
    log.audit({ title: `SuiteToolsCommonSettings:initializeApp() initiated`, details: '' });

    const cssUrl = this.stCommon.stLib.stLibNs.stLibNsFile.getFileUrl(this.stCommon.appCssFile);
    const jsUrl = this.stCommon.stLib.stLibNs.stLibNsFile.getFileUrl(this.stCommon.appJsFile);
    const notifyEmail = this.stCommon.runtime.getCurrentUser().email;
    const configs = {
      custrecord_idev_st_config_css_url: cssUrl,
      custrecord_idev_st_config_js_url: jsUrl,
      custrecord_idev_st_setting_dev_mode: false,
      custrecord_idev_st_setting_notify_author: this.stCommon.runtime.getCurrentUser().id,
      custrecord_idev_st_setting_notify_email: notifyEmail,
    };
    const recId = this.stCommon.stLib.stLibNs.stLibNsRecord.createCustomRecordEntry(
      this.stCommon.appSettingsRecord,
      configs,
    );
    log.debug({ title: `SuiteToolsCommonSettings:initializeApp() created settings record`, details: recId });

    // initialize the jobs
    this.stCommon.stJobs.initializeJobs();

    log.debug({ title: `SuiteToolsCommonSettings:initializeApp() completed`, details: null });
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

  public getElementFromHtmlString(htmlString: string, id: string): string {
    log.debug('getElementFromHtmlString() initiated', { htmlString, id });
    try {
      let result = '';
      // const pattern = /<([a-zA-Z]+)\s+id="div__body"[^>]*>([\s\S]*?)<\/\1>/;
      const pattern = /<table\s+id="div__body"[^>]*>([\s\S]*?)<\/table>/;
      const match = htmlString.match(pattern);
      log.debug('getElementFromHtmlString() match', match);
      if (match) {
        const elementType = match[1]; // element type (e.g., table, div)
        const elementContent = match[2]; // element content
        result = `<${elementType} id="${id}">${elementContent}</${elementType}>`;
      } else {
        throw new Error(`Element with id ${id} not found`);
      }
      log.debug('getElementFromHtmlString() returning', result);

      return result;
    } catch (e) {
      log.error('getElementFromHtmlString() error', e);
    }
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
    this._stCommon = stCommon;
  }

  /**
   * Send Email Notification
   *
   * @param subject - email subject
   * @param content - email core content
   */
  public sendNotification(
    author: number,
    recipients: [number] | [string],
    replyTo: string,
    subject: string,
    body: string,
  ): void {
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteEmail:sendNotification() initiated',
      details: { author: author, recipients: recipients, replyTo: replyTo, subject: subject, body: body },
    });

    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteEmail:sendNotification() sending email',
      details: { author: author, recipients: recipients, replyTo: replyTo, subject: subject, body: body },
    });
    // send email
    try {
      email.send({ author: author, recipients: recipients, replyTo: replyTo, subject: subject, body: body });
    } catch (error) {
      log.error({
        title: 'SuiteToolsCommonLibraryNetSuiteEmail:sendNotification() error sending email',
        details: { error: error },
      });
    }
    // log.debug({
    //   title: 'SuiteToolsCommonLibraryNetSuiteEmail:sendNotification() email sent',
    //   details: null,
    // });
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
    this._stCommon = stCommon;
  }

  /**
   * Get NetSuite file object.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file
   */
  private getFileObj(id: number | string): file.File {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileObj() initiated', details: { id: id } });
    let fileObj: file.File;
    if (typeof id === 'string') {
      const filePath = `/SuiteScripts/${this.stCommon.appDir}/${id}`;
      fileObj = file.load({ id: filePath });
    } else {
      fileObj = file.load({ id: id });
    }

    return fileObj;
  }

  /**
   * Gets NetSuite file contents.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file contents
   */
  public getFileContents(id: number | string): string {
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
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileContents() initiated', details: { id: id } });
    const fileObj = this.getFileObj(id);
    const sql = `select TO_CHAR(File.LastModifiedDate, 'YYYY-MM-DD HH24:MI:SS') as lastModifiedDate from file where id = ${fileObj.id}`;
    const result = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    const lastModifiedDate = result[0].lastmodifieddate;

    return lastModifiedDate;
  }

  /**
   * Gets NetSuite file URL.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file url
   */
  public getFileUrl(fileName: string): string {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileURL() initiated', details: { fileName: fileName } });
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
    this._stCommon = stCommon;
  }

  /**
   * Get request
   *
   * @param url - the request url
   * @returns the get request reponse body
   */
  public async getRequest(url: string): Promise<string> {
    log.debug('getRequest() initiated', { url });
    let response;
    try {
      response = await https.get
        .promise({
          url: url,
        })
        .then(function (response) {
          log.debug({
            title: 'getRequest() response',
            details: response,
          });
          log.debug('getRequest() response body', response.body);

          return response.body;
        })
        .catch(function onRejected(reason) {
          log.debug({
            title: 'getRequest() invalid request',
            details: reason,
          });
        });
    } catch (e) {
      log.error('getRequest() error', e);
      // throw (e);
    }
    log.debug('getRequest() returning', response);

    return response;
  }
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
    this._stCommon = stCommon;
  }

  /**
   * Create custom record or list entry
   *
   * @param recordType
   * @param values
   * @returns record id of newly created record if successful else 0
   */
  public createCustomRecordEntry(recordType: string, values: object): number {
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:createCustomRecordEntry() initiated',
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
        title: `SuiteToolsCommonLibraryNetSuiteRecord:createCustomRecordEntry - Error on ${recordType}`,
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
  public updateCustomRecordEntry(recordType: string, recordId: string, values: object): boolean {
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
    this._stCommon = stCommon;
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
