/**
 * SuiteTools App - Main Application Class
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from 'N/log';
import * as url from 'N/url';
import { EntryPoints } from 'N/types';
import { SuiteToolsCommon } from '../common/SuiteToolsCommon';
import { SuiteToolsAppView } from './SuiteToolsAppView';

/**
 * SuiteTools Application Class
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsApp {
  private _apiUrl: string;
  private _stCommon: SuiteToolsCommon;

  get apiUrl(): string {
    return this._apiUrl;
  }
  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(context: EntryPoints.Suitelet.onRequestContext | null = null) {
    this._apiUrl = url.resolveScript({
      scriptId: 'customscript_idev_suitetools_api', // the SuiteTools API script id
      deploymentId: 'customdeploy_idev_suitetools_api', // the SuiteTools API deployment id
      returnExternalUrl: false,
    });
    this._stCommon = new SuiteToolsCommon();

    if (!context) {
      this.bootstrapLibrary(context);
    } else {
      this.bootstrapSpa(context);
    }
  }

  private bootstrapLibrary(context: EntryPoints.Suitelet.onRequestContext): void {
    log.debug({ title: 'SuiteToolsApp:bootstrapLibrary() initiated', details: context });

    // verify integrity of app settings before proceeding
    const issues = [];
    // check that settings were found
    const settingsFound = this.stCommon.stSettings.getSettings();
    if (!settingsFound) {
      issues.push('SuiteToolsApp:bootstrapLibrary() did not find any settings');
    }
    // check that core configs are set
    if (!this.stCommon.stSettings.cssUrl || !this.stCommon.stSettings.jsUrl) {
      issues.push('Core config settings were not set.');
    }
    // log app issues
    if (issues.length > 0) {
      log.error({ title: 'SuiteToolsApp:bootstrapLibrary() found issues', details: issues });
    }
  }

  private bootstrapSpa(context: EntryPoints.Suitelet.onRequestContext): void {
    const stAppView = new SuiteToolsAppView(context, this);

    try {
      // get the app settings
      const settingsFound = this._stCommon.stSettings.getSettings();
      if (!settingsFound) {
        // if no settings were found, initialize the app
        log.error({ title: `SuiteToolsApp:bootstrapSpa() did not find any settings`, details: null });
        this._stCommon.stSettings.initializeApp();
      }

      // verify integrity of app settings before proceeding
      const appIssues = [];
      // check that core configs are set
      if (!this._stCommon.stSettings.cssUrl || !this._stCommon.stSettings.jsUrl) {
        appIssues.push('Core config settings were not set. Refresh page to see if the issue has been resolved.');
      }

      // render the SPA or issues form
      if (appIssues.length === 0) {
        // render the SPA
        stAppView.renderSpa();
      } else {
        // log app issues and render the app issues form
        log.error({ title: 'SuiteToolsApp:bootstrapSpa() found issues', details: appIssues });
        stAppView.renderAppIssuesForm(appIssues);
      }
    } catch (e) {
      // log the error and render the app error form
      log.error({ title: 'SuiteToolsApp:bootstrapSpa() caught error', details: e });
      stAppView.renderAppErrorForm(e);
    }
  }
}
