/**
 * SuiteTools View
 *
 * This script handles the presentation.
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
 * @NApiVersion 2.1
 */

import error = require('N/error');
import log = require('N/log');
// @ts-expect-error TS2307: Cannot find module since it is relative to the JavaScript file being deployed to NetSuite
import Handlebars = require('./handlebars.min');
import { SuiteToolsApp } from './idev-suitetools-app';

/**
 * SuiteTools View
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsView {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsView:constructor() initiated', details: null });
    this._stApp = stApp;
  }

  /**
   * Render SPA page
   *
   * @returns HTML content
   */
  public renderSpa(): void {
    log.debug({ title: 'SuiteToolsView:renderSpa() initiated', details: null });

    const layoutValues = {};

    // // TODO verify that this does not negatively impact and then remove the values from settings
    // (layoutValues['css'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileURL(this.stApp.appCssFile)),
    //   (layoutValues['js'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileURL(this.stApp.appJsFile));
    layoutValues['css'] = this.stApp.stAppSettings.cssUrl;
    layoutValues['js'] = this.stApp.stAppSettings.jsUrl;

    // layoutValues['scriptUrl'] = this.stApp.scriptUrl;
    // layoutValues['userName'] = this.stApp.stAppNs.runtime.getCurrentUser().name;
    // layoutValues['userEmail'] = this.stApp.stAppNs.runtime.getCurrentUser().email;

    // TODO move this to client side
    // layoutValues['alert'] = this.stApp.getAlert();

    // TODO move this to client side
    // if (this.stApp.stAppSettings.devMode) {
    //   layoutValues['remainingUsage'] =
    //     this.stApp.stAppNs.runtime.getCurrentScript().getRemainingUsage() +
    //     ' units' +
    //     ' (' +
    //     this.stApp.stAppNs.runtime.getCurrentScript().getRemainingUsage() / 10 +
    //     '%)';
    //   layoutValues['sql'] = this.stApp.getSession('sql');
    //   layoutValues['search'] = this.stApp.getSession('search');
    // }

    const layout = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('pages/index.html');
    const layoutTemplate = Handlebars.compile(layout);
    let content = layoutTemplate(layoutValues);
    content += this.getPageFooterComments();

    this.stApp.context.response.write(content);
  }

  /**
   * Renders the Application Error form.
   *
   * @param appError - issues with the application that prevent it from running properly
   */
  public renderAppErrorForm(e: error.SuiteScriptError, devMode: boolean): void {
    log.debug({ title: 'SuiteToolsView:renderAppErrorForm() initiated', details: e });

    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('pages/appError.html');
    const bodyValues = {};
    bodyValues['id'] = e.id;
    bodyValues['name'] = e.name;
    bodyValues['message'] = e.message;
    if (devMode && Array.isArray(e.stack) && e.stack.length > 0) {
      const stackLines = e.stack[0];
      log.debug({ title: 'SuiteToolsController:renderAppErrorForm() stackLines', details: stackLines });
      const stackLinesArray = stackLines.split('at');
      log.debug({ title: 'SuiteToolsController:renderAppErrorForm() stackLinesArray', details: stackLinesArray });
      bodyValues['stack'] = stackLinesArray;
    }
    this.renderPageOnly(body, bodyValues);
  }

  /**
   * Renders the Application Issues form.
   *
   * @param issues - issues with the application that prevent it from running properly
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public renderAppIssuesForm(issues: any[]): void {
    log.debug({ title: 'SuiteToolsView:renderAppIssuesForm() initiated', details: { issues: issues } });

    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('pages/appIssues.html');
    const bodyValues = {};
    bodyValues['issues'] = issues;
    this.renderPageOnly(body, bodyValues);
  }

  /**
   * Renders the page without the layout.
   *
   * @param body - the templated content
   * @param [bodyValues] - the values to use in the template
   * @returns HTML content
   */
  private renderPageOnly(body: string, bodyValues?: object): void {
    log.debug({ title: 'SuiteToolsView:RenderPage() initiated', details: null });

    const bodyTemplate = Handlebars.compile(body);
    const bodyContent = bodyTemplate(bodyValues);
    this.stApp.context.response.write(bodyContent);
  }

  private getPageFooterComments(): string {
    log.debug({ title: 'SuiteToolsView:getPageFooterComments() initiated', details: null });

    const lines = [];
    lines.push('<!-- SuiteTools Application' + ' -->');
    lines.push('<!-- ScriptUrl: ' + this.stApp.scriptUrl + ' -->');
    lines.push('<!-- ApiUrl: ' + this.stApp.apiUrl + ' -->');
    lines.push('<!-- NetSuite -->');
    return lines.join('\n');
  }
}
