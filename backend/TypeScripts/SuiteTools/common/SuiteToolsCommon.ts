// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Shared foundation for both the Suitelet and the RESTlet.
 *
 * @fileoverview
 * Nineteen backend modules import this — it is the widest dependency in the workspace. Holds
 * the jobs, settings and NetSuite library instances, so the app and the API share one
 * construction path instead of each assembling its own.
 *
 * @remarks
 * `_appFiles` maps the SPA build's output paths, so it is the coupling point between the
 * frontend build and the backend: renaming a bundle in the frontend build without editing this
 * map breaks the served app at runtime, with nothing failing at compile time.
 *
 * @see ../idev-suitetools-app.ts – the Suitelet built on this
 * @see ../idev-suitetools-api.ts – the RESTlet built on this
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 *
 * @NApiVersion 2.1
 */

import * as runtime from "N/runtime";
import { SuiteToolsCommonJobs } from "./SuiteToolsCommonJobs";
import { SuiteToolsCommonSettings } from "./SuiteToolsCommonSettings";
import { SuiteToolsCommonLibrary } from "./library/SuiteToolsCommonLibrary";

/**
 * Common functionality between SuiteTools App and SuiteTools API
 */
export class SuiteToolsCommon {
  // classes
  private _stJobs: SuiteToolsCommonJobs;
  private _stSettings: SuiteToolsCommonSettings;
  private _stLib: SuiteToolsCommonLibrary;
  // the application directory in the /SuiteScripts folder
  private _appDir = "SuiteTools";
  // Application files the SPA build emits, all relative to the app directory. One map so adding a
  // file is a single edit here rather than a new constant plus a new getter.
  private _appFiles = {
    css: "dist/output.css",
    js: "dist/app-bundle.js",
    notices: "dist/third-party-notices.json",
  } as const;
  // application settings record
  private _appSettingsRecord = "customrecord_idev_suitetools_settings"; // the application settings custom record

  get stJobs(): SuiteToolsCommonJobs {
    return this._stJobs;
  }
  get stSettings(): SuiteToolsCommonSettings {
    return this._stSettings;
  }
  get stLib(): SuiteToolsCommonLibrary {
    return this._stLib;
  }

  get appDir(): string {
    return this._appDir;
  }
  get appCssFile(): string {
    return this._appFiles.css;
  }
  get appJsFile(): string {
    return this._appFiles.js;
  }
  get appNoticesFile(): string {
    return this._appFiles.notices;
  }
  get appSettingsRecord(): string {
    return this._appSettingsRecord;
  }
  get runtime(): typeof runtime {
    return runtime;
  }
  get isAdmin(): boolean {
    return runtime.getCurrentUser().roleId === "administrator";
  }
  get isProduction(): boolean {
    return String(runtime.EnvType[runtime.envType]) === "PRODUCTION";
  }

  /**
   * Initializes the SuiteToolsCommon instance.
   *
   * Instantiates the common helper objects (jobs, settings, library) used by the instance.
   * Each helper is constructed with a reference to this SuiteToolsCommon instance so they
   * can access shared state and methods.
   */
  constructor() {
    this._stJobs = new SuiteToolsCommonJobs(this);
    this._stSettings = new SuiteToolsCommonSettings(this);
    this._stLib = new SuiteToolsCommonLibrary(this);
  }
}
