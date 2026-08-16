/**
 * SuiteTools App - View Management Class
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from "N/log";
import type { EntryPoints } from "N/types";
import type { SuiteToolsApp } from "./SuiteToolsApp";
import type { Settings } from "../common/SuiteToolsCommonSettings";

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
   *
   * @param settings - the loaded settings snapshot. Passed in rather than read back off
   *   `stSettings`, which no longer holds state; this also makes the dependency explicit
   *   instead of relying on bootstrapSpa having loaded first.
   */
  public renderSpa(settings: Settings): void {
    const css = settings.cssUrl;
    const js = settings.jsUrl;
    // SuiteToolsApp:bootstrapSpa() only reaches renderSpa() once it has confirmed both URLs are
    // set, but that invariant lives in another class. Re-check it here so the absent case is
    // handled locally rather than emitting a page with broken asset URLs.
    if (!css || !js) {
      log.error({ title: "SuiteToolsAppView:renderSpa() core config settings were not set", details: { css, js } });
      this.renderAppIssuesForm([
        "Core config settings were not set. Refresh page to see if the issue has been resolved.",
      ]);
      return;
    }
    const cacheBust = encodeURIComponent(settings.appBundle || String(Date.now()));
    const cssWithBust = this.withCacheBust(css, cacheBust);
    const jsWithBust = this.withCacheBust(js, cacheBust);
    const appUrl = this.stApp.appUrl;
    let content = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SuiteTools</title>
    <script type="module" crossorigin src="${jsWithBust}"></script>
    <link rel="stylesheet" crossorigin href="${cssWithBust}" />
  </head>
  <body>
    <div id="root" data-app-url="${appUrl}"></div>
  </body>
</html>`;
    content += this.getPageFooterComments();
    this._context.response.write(content);
  }

  /**
   * Append a cache-busting query param so File Cabinet asset updates are picked up immediately.
   */
  private withCacheBust(assetUrl: string, version: string): string {
    if (!assetUrl) {
      return assetUrl;
    }
    const separator = assetUrl.includes("?") ? "&" : "?";
    return `${assetUrl}${separator}v=${version}`;
  }

  /**
   * Normalize a caught value into the fields the error form renders.
   *
   * A `catch` binding is `unknown`: it may be a NetSuite SuiteScriptError, a plain Error
   * (no `id`, and a newline-delimited string `stack`), or a thrown non-object. Reading the
   * SuiteScriptError shape off those unchecked previously rendered the literal "undefined".
   *
   * @param e - the caught value
   * @returns the error fields, with absent ones defaulted rather than rendered as "undefined"
   */
  private normalizeAppError(e: unknown): { id: string; name: string; message: string; stack: string[] } {
    if (typeof e !== "object" || e === null) {
      return { id: "", name: "Error", message: String(e), stack: [] };
    }
    const candidate = e as { id?: unknown; name?: unknown; message?: unknown; stack?: unknown };

    let stack: string[] = [];
    if (Array.isArray(candidate.stack)) {
      // SuiteScriptError.stack is a string[].
      stack = candidate.stack.filter((line): line is string => typeof line === "string");
    } else if (typeof candidate.stack === "string") {
      // A plain Error stack is one newline-delimited string; keep it as a single entry so the
      // existing split("at") formatting below still applies.
      stack = [candidate.stack];
    }

    return {
      id: typeof candidate.id === "string" ? candidate.id : "",
      name: typeof candidate.name === "string" ? candidate.name : "Error",
      message: typeof candidate.message === "string" ? candidate.message : "",
      stack,
    };
  }

  /**
   * Render application error form.
   *
   * @param caught - the caught value from the application bootstrap
   */
  public renderAppErrorForm(caught: unknown): void {
    const e = this.normalizeAppError(caught);
    // build stack lines string for content from error if in dev mode
    let stackString = "";
    if (e.stack.length > 0) {
      const stackLines = e.stack[0];
      log.debug({ title: "SuiteToolsController:renderAppErrorForm() stackLines", details: stackLines });
      const stackLinesArray = stackLines.split("at");
      log.debug({ title: "SuiteToolsController:renderAppErrorForm() stackLinesArray", details: stackLinesArray });
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
    let issueString = "";
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
    log.debug({ title: "SuiteToolsAppView:getPageFooterComments() initiated", details: null });
    const lines = [];
    lines.push("<!-- SuiteTools Application -->");
    lines.push(`<!-- appUrl: ${this.stApp.appUrl} -->`);
    lines.push(`<!-- apiUrl: ${this.stApp.apiUrl} -->`);
    lines.push("<!-- NetSuite -->");
    return lines.join("\n");
  }
}
