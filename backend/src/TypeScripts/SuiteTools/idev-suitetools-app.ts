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
  // classes
  private _stCommon: SuiteToolsCommon;
  private _stAppView: SuiteToolsAppView;
  // application settings
  private _appApiScriptId = 'customscript_idev_suitetools_api'; // the SuiteTools API script id
  private _appApiDeploymentId = 'customdeploy_idev_suitetools_api'; // the SuiteTools API deployment id
  private _apiUrl: string;
  // environment values
  private _context: EntryPoints.Suitelet.onRequestContext;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }
  get stAppView(): SuiteToolsAppView {
    return this._stAppView;
  }
  get apiUrl(): string {
    return this._apiUrl;
  }
  get context(): EntryPoints.Suitelet.onRequestContext {
    return this._context;
  }

  constructor(context: EntryPoints.Suitelet.onRequestContext | null = null) {
    log.debug({ title: 'SuiteToolsApp:constructor() initiated', details: null });

    this._stCommon = new SuiteToolsCommon();
    this._stAppView = new SuiteToolsAppView(this);
    this._context = context;
    this._apiUrl = url.resolveScript({
      scriptId: this._appApiScriptId,
      deploymentId: this._appApiDeploymentId,
      returnExternalUrl: false,
    });
    this.stCommon.stSettings.getSettings();
    this.bootstrapSpa();
  }

  private bootstrapSpa(): void {
    log.debug({ title: 'SuiteToolsApp:bootstrapSpa()', details: null });

    const devMode = this.stCommon.stSettings.devMode;
    log.debug({ title: 'SuiteToolsApp:bootstrapSpa() dev mode = ', details: devMode });
    if (devMode) {
      this.bootstrapHelper();
    } else {
      try {
        this.bootstrapHelper();
      } catch (e) {
        log.error({ title: 'SuiteToolsApp:bootstrapSpa() caught error', details: e });
        this.stAppView.renderAppErrorForm(e, devMode);
      }
    }
  }

  private bootstrapHelper(): void {
    const appIssues = this.performChecks();
    if (appIssues.length > 0) {
      this.stAppView.renderAppIssuesForm(appIssues);
    } else {
      this.stAppView.renderSpa();
    }
  }

  private performChecks(): string[] {
    log.debug({ title: 'SuiteToolsApp:performChecks() initiated', details: null });
    const results = [];

    // check that core configs are set
    if (!this._stCommon.stSettings.cssUrl || !this._stCommon.stSettings.jsUrl) {
      results.push(
        'Core config settings were not set. SuiteTools has tried to fix issue. Please refresh the page. If issue persists, please contact your administrator.',
      );
    }

    if (results.length > 0) {
      log.error({ title: 'SuiteToolsApp:performChecks() found issues', details: results });
    }

    return results;
  }

  // /**
  //  * Set session value.
  //  *
  //  * TODO: if still used move to SuiteToolsAppNetSuite?
  //  *
  //  * @param key - name of session variable
  //  * @param value - value of session variable
  //  */
  // public setSession(key: string, value: string): void {
  //   log.debug({ title: 'SuiteToolsApp:setSession() initiated with', details: { key: key, value: value } });

  //   this.stCommon.runtime.getCurrentSession().set({
  //     name: key,
  //     value: value,
  //   });
  // }

  //   /**
  //    * Get session value.
  //    *
  //    * TODO: if still used move to SuiteToolsAppNetSuite?
  //    *
  //    * @param key
  //    * @returns session key
  //    */
  //   public getSession(key: string): string {
  //     // log.debug({ title: 'SuiteToolsApp:getSession() initiated with', details: { key: key } });

  //     // get it
  //     const value = this.stCommon.runtime.getCurrentSession().get({ name: key });
  //     // clear it
  //     this.stCommon.runtime.getCurrentSession().set({ name: key, value: null });
  //     // log.debug({ title: 'SuiteToolsApp:getSession() returning', details: value });

  //     return value;
  //   }
}

/**
 * SuiteTools App View
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsAppView {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsAppView:constructor() initiated', details: null });
    this._stApp = stApp;
  }

  /**
   * Render SPA page
   */
  public renderSpa(): void {
    log.debug({ title: 'SuiteToolsAppView:renderSpa() initiated', details: null });
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
    this.stApp.context.response.write(content);
  }

  /**
   * Renders the Application Error form.
   *
   * @param appError - issues with the application that prevent it from running properly
   */
  public renderAppErrorForm(e: error.SuiteScriptError, devMode: boolean): void {
    log.debug({ title: 'SuiteToolsAppView:renderAppErrorForm() initiated', details: e });

    // build stack lines string for content from error if in dev mode
    let stackString = '';
    if (devMode && Array.isArray(e.stack) && e.stack.length > 0) {
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
    this.stApp.context.response.write(content);
  }

  /**
   * Renders the Application Issues form.
   *
   * @param issues - issues with the application that prevent it from running properly
   */
  public renderAppIssuesForm(issues: string[]): void {
    log.debug({ title: 'SuiteToolsAppView:renderAppIssuesForm() initiated', details: { issues: issues } });

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
    this.stApp.context.response.write(content);
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
