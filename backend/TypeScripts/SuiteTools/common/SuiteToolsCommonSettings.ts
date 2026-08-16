/**
 * SuiteTools Library - Settings
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from "N/log";
// Type-only import: erased at compile time, so it creates no runtime cycle even though
// SuiteToolsCommon constructs this class.
import type { SuiteToolsCommon } from "./SuiteToolsCommon";
import type { SuiteQLValue } from "./types";

// define type for Last Logins data
export type LastLogins = { finished: string; data: { name: { type: string; name: string }; lastLogin: string }[] };

/**
 * A successfully loaded settings record.
 *
 * Returned as a value rather than assigned to instance fields, so "no settings record" is one
 * nullable thing a caller checks once, instead of seven optional fields re-checked at every read.
 *
 * Optionality here is the column's, not the load's: `recordId`, `devMode` and `appBundle` are
 * guaranteed by the fact that a row was found, while the four config fields are user-editable
 * and legitimately empty on a partially configured install.
 */
export type Settings = {
  /** Internal id of the settings record. Guaranteed: a row we could not address is not a load. */
  recordId: number;
  /** Always a boolean -- the column is read as `=== "T"`. */
  devMode: boolean;
  /** Last-modified stamp of the app bundle, used for cache busting. `""` if the file is missing. */
  appBundle: string;
  cssUrl: string | undefined;
  jsUrl: string | undefined;
  notifyAuthor: number | undefined;
  notifyEmail: string | undefined;
  /** `null` means "no stored logins", which is distinct from the record being absent. */
  lastLogins: LastLogins | null;
};

/**
 * Coerce a SuiteQL column to an optional string.
 *
 * Columns arrive as `string | number | boolean | null`. `null` becomes `undefined` so an unset
 * column reads as absent, rather than a `null` sitting inside a field declared `string`. Until
 * the circular dependency was removed these assignments went through `any`, so that mismatch
 * was invisible.
 */
function toOptionalString(value: SuiteQLValue): string | undefined {
  return value === null ? undefined : String(value);
}

/**
 * Coerce a SuiteQL column to an optional number.
 *
 * As {@link toOptionalString}, plus a non-numeric value is treated as absent rather than
 * allowed to propagate as `NaN`.
 */
function toOptionalNumber(value: SuiteQLValue): number | undefined {
  if (value === null) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/**
 * Settings info for SuiteTools App and SuiteTools API
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonSettings {
  private _stCommon: SuiteToolsCommon;

  // No settings state is held here. getSettings() returns a snapshot instead, so a caller cannot
  // read a field without having established that the record loaded -- the shape that let a save
  // target record id "undefined" on a fresh install.

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Load the settings record.
   *
   * @returns the settings, or `null` when no active settings record exists -- a fresh install, or
   *   one where the record was deleted or inactivated. Callers must handle `null`; there is no
   *   partially populated state to read past it.
   */
  public getSettings(): Settings | null {
    log.debug({ title: `SuiteToolsCommonSettings:getSettings() initiated`, details: "" });

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

    if (sqlResults.length === 0) {
      return null;
    }

    // Note the lowercase keys: SuiteQL's asMappedResults() lowercases the column aliases above.
    const row = sqlResults[0];
    const recordId = toOptionalNumber(row.id);
    if (recordId === undefined) {
      // A row without a usable internal id cannot be updated or referenced by the MR scripts, so
      // it is not a successful load. Narrowing here is what makes `recordId` non-optional below.
      log.error({ title: `SuiteToolsCommonSettings:getSettings() settings row has no usable id`, details: row });
      return null;
    }

    return {
      recordId,
      devMode: row.devmode === "T",
      appBundle: this.stCommon.stLib.stLibNs.stLibNsFile.getFileLastModified(this.stCommon.appJsFile),
      cssUrl: toOptionalString(row.cssurl),
      jsUrl: toOptionalString(row.jsurl),
      notifyAuthor: toOptionalNumber(row.notifyauthor),
      notifyEmail: toOptionalString(row.notifyemail),
      lastLogins: this.parseLastLogins(row.lastlogins),
    };
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
