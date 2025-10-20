/**
 * SuiteTools App - View Management Class
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from 'N/log';
import type * as error from 'N/error';
import type { EntryPoints } from 'N/types';
import type { SuiteToolsApp } from './SuiteToolsApp';

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
    lines.push('<!-- SuiteTools Application -->');
    lines.push('<!-- appUrl: ' + this._stApp.stCommon.appUrl + ' -->');
    lines.push('<!-- apiUrl: ' + this.stApp.apiUrl + ' -->');
    lines.push('<!-- NetSuite -->');
    return lines.join('\n');
  }
}
