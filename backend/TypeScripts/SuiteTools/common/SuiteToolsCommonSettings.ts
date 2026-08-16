/**
 * SuiteTools Library - Settings
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from "N/log";

// Forward declaration to avoid circular dependency
declare class SuiteToolsCommon {
  appSettingsRecord: string;
  appJsFile: string;
  appCssFile: string;
  // biome-ignore lint/suspicious/noExplicitAny: forward-declared member, typed loosely to avoid a circular dependency; tracked in #83
  runtime: any;
  // biome-ignore lint/suspicious/noExplicitAny: forward-declared member, typed loosely to avoid a circular dependency; tracked in #83
  stLib: any;
  // biome-ignore lint/suspicious/noExplicitAny: forward-declared member, typed loosely to avoid a circular dependency; tracked in #83
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

  // The settings below are populated by getSettings(), not by the constructor, and getSettings()
  // assigns nothing when the settings record is missing or inactive (it returns false instead).
  // They are therefore genuinely absent until a *successful* load -- on a fresh install, or when
  // a caller ignores the getSettings() return value. The `undefined` in these types records that
  // reality rather than asserting an initialisation the constructor does not perform.
  private _appBundle: string | undefined;
  private _recordId: number | undefined;
  private _cssUrl: string | undefined;
  private _jsUrl: string | undefined;
  private _devMode: boolean | undefined;
  private _notifyAuthor: number | undefined;
  private _notifyEmail: string | undefined;
  // Already nullable, and `null` is what parseLastLogins() returns for "no stored logins", so
  // consumers cannot distinguish "not loaded" from "loaded and empty" -- nor do they need to.
  private _lastLogins: LastLogins | null = null;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }
  get appBundle(): string | undefined {
    return this._appBundle;
  }
  get recordId(): number | undefined {
    return this._recordId;
  }
  get cssUrl(): string | undefined {
    return this._cssUrl;
  }
  get jsUrl(): string | undefined {
    return this._jsUrl;
  }
  get devMode(): boolean | undefined {
    return this._devMode;
  }
  get notifyAuthor(): number | undefined {
    return this._notifyAuthor;
  }
  get notifyEmail(): string | undefined {
    return this._notifyEmail;
  }
  get lastLogins(): LastLogins | null {
    return this._lastLogins;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Get Settings
   */
  public getSettings(): boolean {
    log.debug({ title: `SuiteToolsCommonSettings:getSettings() initiated`, details: "" });
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
      this._devMode = sqlResults[0].devmode === "T";
      this._notifyAuthor = sqlResults[0].notifyauthor;
      this._notifyEmail = sqlResults[0].notifyemail;
      this._lastLogins = this.parseLastLogins(sqlResults[0].lastlogins);
      this._appBundle = this.stCommon.stLib.stLibNs.stLibNsFile.getFileLastModified(this.stCommon.appJsFile);
      settingsFound = true;
    }

    return settingsFound;
  }

  private parseLastLogins(raw: unknown): LastLogins | null {
    if (raw == null || raw === "") {
      return null;
    }
    try {
      const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (!parsed || typeof parsed !== "object") {
        return null;
      }
      return parsed as LastLogins;
    } catch (e) {
      log.error({ title: "SuiteToolsCommonSettings:parseLastLogins() failed", details: e });
      return null;
    }
  }

  public initializeApp(): void {
    log.audit({ title: `SuiteToolsCommonSettings:initializeApp() initiated`, details: "" });

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
