// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * SuiteTools App - Main Application Class
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from "N/log";
import * as url from "N/url";
import type { EntryPoints } from "N/types";
import { SuiteToolsCommon } from "../common/SuiteToolsCommon";
import { SuiteToolsAppView } from "./SuiteToolsAppView";

/**
 * SuiteTools Application Class
 */
export class SuiteToolsApp {
  private _appUrl: string;
  private _apiUrl: string;
  private _stCommon: SuiteToolsCommon;

  get appUrl(): string {
    return this._appUrl;
  }
  get apiUrl(): string {
    return this._apiUrl;
  }
  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(context: EntryPoints.Suitelet.onRequestContext | null = null) {
    this._appUrl = url.resolveScript({
      scriptId: "customscript_idev_suitetools_app",
      deploymentId: "customdeploy_idev_suitetools_app",
      returnExternalUrl: false,
    });
    this._apiUrl = url.resolveScript({
      scriptId: "customscript_idev_suitetools_api", // the SuiteTools API script id
      deploymentId: "customdeploy_idev_suitetools_api", // the SuiteTools API deployment id
      returnExternalUrl: false,
    });
    this._stCommon = new SuiteToolsCommon();

    if (!context) {
      this.bootstrapLibrary(context);
    } else {
      this.bootstrapSpa(context);
    }
  }

  // Only ever called when there is no Suitelet context -- see the constructor.
  private bootstrapLibrary(context: EntryPoints.Suitelet.onRequestContext | null): void {
    log.debug({ title: "SuiteToolsApp:bootstrapLibrary() initiated", details: context });

    // verify integrity of app settings before proceeding
    const issues = [];
    // check that settings were found
    const settings = this.stCommon.stSettings.getSettings();
    if (!settings) {
      issues.push("SuiteToolsApp:bootstrapLibrary() did not find any settings");
    }
    // The SPA asset URLs are not checked here. They are only meaningful to a rendered page, and
    // the library bootstrap serves the map/reduce jobs -- which would now pay for two File Cabinet
    // lookups to log a warning about assets they never emit.
    // log app issues
    if (issues.length > 0) {
      log.error({ title: "SuiteToolsApp:bootstrapLibrary() found issues", details: issues });
    }
  }

  private bootstrapSpa(context: EntryPoints.Suitelet.onRequestContext): void {
    const stAppView = new SuiteToolsAppView(context, this);

    try {
      // get the app settings
      const settings = this._stCommon.stSettings.getSettings();
      if (!settings) {
        // if no settings were found, initialize the app
        log.error({ title: `SuiteToolsApp:bootstrapSpa() did not find any settings`, details: null });
        this._stCommon.stSettings.initializeApp();
        // initializeApp() creates the record but does not reload; the issues form below tells the
        // user to refresh, which is the same behaviour as before the snapshot change.
      }

      // Resolve the SPA's asset URLs from the File Cabinet. Done here, at the one point that
      // consumes them, rather than inside getSettings() -- and rather than read back off the
      // settings record, where a value written once by initializeApp() can silently go stale if
      // the file is ever deleted and re-created instead of overwritten.
      const cssUrl = this.stCommon.stLib.stLibNs.stLibNsFile.getFileUrl(this.stCommon.appCssFile);
      const jsUrl = this.stCommon.stLib.stLibNs.stLibNsFile.getFileUrl(this.stCommon.appJsFile);

      // verify integrity of app settings before proceeding
      const appIssues = [];
      // check that settings were found -- the snapshot above predates initializeApp(), so this is
      // the just-initialized case. Listed explicitly now that it no longer arrives implicitly via
      // the missing stored URLs it used to leave behind.
      if (!settings) {
        appIssues.push("The settings record was just created. Refresh page to see if the issue has been resolved.");
      }
      // check that the app's assets are deployed
      if (!cssUrl || !jsUrl) {
        appIssues.push("Application files were not found. Refresh page to see if the issue has been resolved.");
      }

      // render the SPA or issues form
      // `settings &&` narrows the snapshot, and `cssUrl && jsUrl` narrows the URLs to the
      // non-empty strings renderSpa() requires; an empty appIssues already implies the latter.
      if (settings && cssUrl && jsUrl && appIssues.length === 0) {
        // render the SPA
        stAppView.renderSpa(settings, cssUrl, jsUrl);
      } else {
        // log app issues and render the app issues form
        log.error({ title: "SuiteToolsApp:bootstrapSpa() found issues", details: appIssues });
        stAppView.renderAppIssuesForm(appIssues);
      }
    } catch (e) {
      // log the error and render the app error form
      log.error({ title: "SuiteToolsApp:bootstrapSpa() caught error", details: e });
      stAppView.renderAppErrorForm(e);
    }
  }
}
