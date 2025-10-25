/**
 * SuiteTools Library - Settings
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from 'N/log';

// Forward declaration to avoid circular dependency
declare class SuiteToolsCommon {
  appSettingsRecord: string;
  appJsFile: string;
  appCssFile: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runtime: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stLib: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stJobs: any;
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
