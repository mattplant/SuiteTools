// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The Suitelet that serves the SuiteTools single-page app.
 *
 * @fileoverview
 * NetSuite invokes this directly. It is the entry point a user's browser hits, and it does
 * almost nothing itself — `SuiteToolsApp` renders the shell HTML that loads the built frontend
 * bundle.
 *
 * @remarks
 * This is the Suitelet whose URL the frontend later reads back as `data-app-url`; the app
 * cannot construct any of its own links without it. Data does not flow through here — the SPA
 * fetches from the RESTlet once loaded.
 *
 * @see ./app/SuiteToolsApp.ts – the shell rendering and the data-app-url attribute
 * @see ./idev-suitetools-api.ts – the RESTlet serving the app's data
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 *
 * @NScriptName SuiteTools SuiteToolsApp
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

import type { EntryPoints } from "N/types";
import * as log from "N/log";
import { SuiteToolsApp } from "./app/SuiteToolsApp";

/**
 * Suitelet onRequest event handler
 *
 * Routes the SuiteTools application requests to the appropriate handler.
 *
 * @param context - this Suitelet's context object
 */
export function onRequest(context: EntryPoints.Suitelet.onRequestContext): void {
  log.debug({ title: "SuiteToolsApp:onRequest()", details: context });

  // initialize the SuiteTools application
  new SuiteToolsApp(context);
}
