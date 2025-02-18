/**
 * SuiteTools SuiteToolsApp
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
 * @NScriptName SuiteTools SuiteToolsApp
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

import { EntryPoints } from 'N/types';
import * as error from 'N/error';
import * as log from 'N/log';
import * as url from 'N/url';
import { SuiteToolsCommon } from './idev-suitetools-common';

/**
 * Suitelet onRequest event handler
 *
 * Routes the SuiteTools application requests to the appropriate handler.
 *
 * @param context - this Suitelet's context object
 */
export function onRequest(context: EntryPoints.Suitelet.onRequestContext): void {
  log.debug({ title: 'SuiteToolsApp:onRequest()', details: context });

  // initialize the SuiteTools application
  new SuiteToolsApp(context);
}

/**
 * This is the SuiteTools Application.
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
        appIssues.push('Core config settings were not set.');
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

/**
 * SuiteTools App View
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsAppView {
  private _context: EntryPoints.Suitelet.onRequestContext;
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(context: EntryPoints.Suitelet.onRequestContext, stApp: SuiteToolsApp) {
    this._context = context;
    this._stApp = stApp;
  }

  /**
   * Render SPA
   */
  public renderSpa(): void {
    const css = this.stApp.stCommon.stSettings.cssUrl;
    const js = this.stApp.stCommon.stSettings.jsUrl;
    let content = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SuiteTools</title>
    <script type="module" crossorigin src="${js}"></script>
    <link rel="stylesheet" crossorigin href="${css}" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;
    content += this.getPageFooterComments();
    this._context.response.write(content);
  }

  /**
   * Render application error form.
   *
   * @param appError - application error
   */
  public renderAppErrorForm(e: error.SuiteScriptError): void {
    // build stack lines string for content from error if in dev mode
    let stackString = '';
    if (Array.isArray(e.stack) && e.stack.length > 0) {
      const stackLines = e.stack[0];
      log.debug({ title: 'SuiteToolsController:renderAppErrorForm() stackLines', details: stackLines });
      const stackLinesArray = stackLines.split('at');
      log.debug({ title: 'SuiteToolsController:renderAppErrorForm() stackLinesArray', details: stackLinesArray });
      if (stackLinesArray.length > 1) {
        stackString = `<h3 class="text-xl">Stack:</h3>
    <ul>`;
        for (const line of stackLinesArray) {
          stackString += `<li>${line}</li>`;
        }
        stackString += `    </ul>`;
      }
    }

    const content = `<div class="mb-2">
  <h2 class="text-2xl">Error</h2>
  <div class="mb-2">
    <p>Oops. Something went wrong.</p>
    <p>Please try your request again. If that doesn't work, please contact your administrator.</p>
  </div>
  <div class="mb-2">
    <p>${e.id}</p>
    <h3 class="text-xl">${e.name}</h3>
    <p>${e.message}</p>
    <p>${stackString}</p>
  </div>
</div>`;
    this._context.response.write(content);
  }

  /**
   * Render application issues form.
   *
   * @param issues - issues with the application that prevent it from running properly
   */
  public renderAppIssuesForm(issues: string[]): void {
    let issueString = '';
    for (const issue of issues) {
      issueString += `<li>${issue}</li>`;
    }
    const content = `<div class="mb-2">
  <h2 class="text-2xl">SuiteTools</h2>
  <div class="mb-2">
    <p>Application issues were discovered.</p>
  </div>
  <div class="mb-2">
    <h3 class="text-xl">Issue(s)</h3>
    <ul>
      ${issueString}
    </ul>
  </div>
</div>`;
    this._context.response.write(content);
  }

  private getPageFooterComments(): string {
    log.debug({ title: 'SuiteToolsAppView:getPageFooterComments() initiated', details: null });
    const lines = [];
    lines.push('<!-- SuiteTools Application' + ' -->');
    lines.push('<!-- appUrl: ' + this._stApp.stCommon.appUrl + ' -->');
    lines.push('<!-- apiUrl: ' + this.stApp.apiUrl + ' -->');
    lines.push('<!-- NetSuite -->');
    return lines.join('\n');
  }
}
