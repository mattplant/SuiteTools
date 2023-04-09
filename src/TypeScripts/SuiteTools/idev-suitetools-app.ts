/**
 * SuiteTools Controller
 *
 * This script handles routing and application settings.
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
 * @NScriptName SuiteTools Controller
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

import { EntryPoints } from 'N/types';
import log = require('N/log');
import runtime = require('N/runtime');
import url = require('N/url');

import { SuiteToolsModel } from './idev-suitetools-model';
import { SuiteToolsView } from './idev-suitetools-view';
import { SuiteToolsController } from './idev-suitetools-controller';
import { SuiteToolsLibrary } from './idev-suitetools-library';

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
  // application settings
  private _appDir = 'SuiteTools'; // the folder name in the /SuiteScripts folder
  private _appName = 'SuiteTools';
  private _appVersion = '0.1.0';
  private _appBuiltWith =
    'Built with <a href="https://github.com/mattplant/netsuite-typescript-sdf/" target="_blank">NetSuite TypeScript SDF Project Template</a>.';
  private _appFooter = `${this.appName} &bull; ${this.appBuiltWith}`;
  private _hideNavBar = true;
  // libraries
  private _stLib: SuiteToolsLibrary;
  // classes
  private _stAppNs: SuiteToolsAppNetSuite;
  private _stAppSettings: SuiteToolsAppSettings;
  private _stModel: SuiteToolsModel;
  private _stView: SuiteToolsView;
  private _stController: SuiteToolsController;
  // environment values
  private _context: EntryPoints.Suitelet.onRequestContext;
  private _scriptUrl: string;

  // application settings
  get appDir(): string {
    return this._appDir;
  }
  get appName(): string {
    return this._appName;
  }
  get appVersion(): string {
    return this._appVersion;
  }
  get appBuiltWith(): string {
    return this._appBuiltWith;
  }
  get appFooter(): string {
    return this._appFooter;
  }
  get hideNavBar(): boolean {
    return this._hideNavBar;
  }
  // libraries
  get stLib(): SuiteToolsLibrary {
    return this._stLib;
  }
  // classes
  get stAppNs(): SuiteToolsAppNetSuite {
    return this._stAppNs;
  }
  get stAppSettings(): SuiteToolsAppSettings {
    return this._stAppSettings;
  }
  get stModel(): SuiteToolsModel {
    return this._stModel;
  }
  get stView(): SuiteToolsView {
    return this._stView;
  }
  get stController(): SuiteToolsController {
    return this._stController;
  }
  // environment values
  get context(): EntryPoints.Suitelet.onRequestContext {
    return this._context;
  }
  get scriptUrl(): string {
    return this._scriptUrl;
  }

  constructor(context: EntryPoints.Suitelet.onRequestContext) {
    // log.debug({ title: 'SuiteToolsApp:constructor() initiated', details: null });

    // initialize the SuiteTools application
    this.initialize(context);

    // route the request
    this.route();
  }

  private initialize(context: EntryPoints.Suitelet.onRequestContext): void {
    // log.debug({ title: 'SuiteToolsApp:initialize()', details: null });

    // add the libraries
    this._stLib = new SuiteToolsLibrary(this);

    // add the classes
    this._stAppSettings = new SuiteToolsAppSettings(this);
    this._stAppNs = new SuiteToolsAppNetSuite();
    this._stModel = new SuiteToolsModel(this);
    this._stView = new SuiteToolsView(this);
    this._stController = new SuiteToolsController(this);

    // set the context
    this._context = context;

    // get this script's URL
    this._scriptUrl = url.resolveScript({
      scriptId: runtime.getCurrentScript().id,
      deploymentId: runtime.getCurrentScript().deploymentId,
      returnExternalUrl: false,
    });
  }

  private route(): void {
    // log.debug({ title: 'SuiteToolsApp:route()', details: null });

    const devMode = this.stAppSettings.devMode;
    log.debug({ title: 'SuiteToolsApp:route() dev mode = ', details: devMode });

    try {
      const appIssues = this.performChecks();
      if (appIssues.length > 0) {
        // tell user about the issues
        this._stController.renderAppIssuesForm(appIssues);
      } else {
        if (this._context.request.method === 'GET') {
          this._stController.getRequestHandler();
        } else {
          this._stController.postRequestHandler();
        }
      }
    } catch (e) {
      log.error({ title: 'SuiteToolsApp:route() caught error', details: e });
      // show an error form
      this._stController.renderAppErrorForm(e, devMode);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private performChecks(): any[] {
    // log.debug({ title: 'SuiteToolsApp:performChecks() initiated', details: null });
    const results = [];

    // check that core configs are set
    if (!this._stAppSettings.cssUrl || !this._stAppSettings.jsUrl) {
      results.push(
        'Core config settings were not set. SuiteTools has tried to fix issue. Please refresh the page. If issue persists, please contact your administrator.'
      );
    }

    if (results.length > 0) {
      log.error({ title: 'SuiteToolsApp:performChecks() found issues', details: results });
    }

    return results;
  }

  /**
   * Sets alert
   *
   * @param message
   */
  public setAlert(message: string): void {
    log.debug({ title: 'SuiteToolsApp:setAlert() initiated with', details: { message: message } });

    this.setSession('alert', message);
  }

  public getAlert(): string {
    // // get it
    // const alert = this.stAppNs.currentSession.get({ name: 'alert' });
    // // clear it
    // this.stAppNs.currentSession.set({ name: 'alert', value: null });
    // log.debug({ title: 'SuiteToolsApp:getAlert() returning', details: alert });

    // return alert;

    return this.getSession('alert');
  }

  /**
   * Set session value.
   *
   * @param key - name of session variable
   * @param value - value of session variable
   */
  public setSession(key: string, value: string): void {
    log.debug({ title: 'SuiteToolsApp:setSession() initiated with', details: { key: key, value: value } });

    this.stAppNs.runtime.getCurrentSession().set({
      name: key,
      value: value,
    });
  }

  /**
   * Get session value.
   *
   * @param key
   * @returns session key
   */
  public getSession(key: string): string {
    // log.debug({ title: 'SuiteToolsApp:getSession() initiated with', details: { key: key } });

    // get it
    const value = this.stAppNs.runtime.getCurrentSession().get({ name: key });
    // clear it
    this.stAppNs.runtime.getCurrentSession().set({ name: key, value: null });
    // log.debug({ title: 'SuiteToolsApp:getSession() returning', details: value });

    return value;
  }
}

/**
 * Settings info for SuiteTools App
 */
export class SuiteToolsAppSettings {
  private _stApp: SuiteToolsApp;
  private _recordId: number;
  private _cssUrl: string;
  private _jsUrl: string;
  private _devMode: boolean;
  private _integrations: string;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }
  get recordId(): number {
    return this._recordId;
  }
  get cssUrl(): string {
    return this._cssUrl;
  }
  get jsUrl(): string {
    return this._jsUrl;
  }
  get devMode(): boolean {
    return this._devMode;
  }
  get integrations(): string {
    return this._integrations;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsAppSettings:constructor() initiated', details: null });
    this._stApp = stApp;

    // get the settings
    this.getSettings();
  }

  /**
   * Get Settings
   */
  public getSettings(): void {
    // log.debug({ title: `SuiteToolsAppSettings:getSettings() initiated`, details: '' });

    const sql = `
    SELECT
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.id,
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.custrecord_idev_st_config_css_url AS cssUrl,
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.custrecord_idev_st_config_js_url AS jsUrl,
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.custrecord_idev_st_setting_dev_mode AS devMode,
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.custrecord_idev_st_config_integrations AS integrations,
    FROM
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS
    WHERE
      isInactive = 'F'
    `;
    const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    // log.debug({ title: `SuiteToolsAppSettings:getSettings() sqlResults = `, details: sqlResults });

    if (sqlResults.length === 0) {
      // since no results then create core configs
      log.error({ title: `SuiteToolsAppSettings:getSettings() no results`, details: '' });
      this.createCoreConfigs();
    } else {
      this._recordId = sqlResults[0].id;
      this._cssUrl = sqlResults[0].cssurl;
      this._jsUrl = sqlResults[0].jsurl;
      this._devMode = sqlResults[0].devmode === 'T' ? true : false;
      this._integrations = JSON.parse(sqlResults[0].integrations);

      // if core configs are not set then set them
      if (!this._cssUrl || !this._jsUrl) {
        log.error({ title: `SuiteToolsAppSettings:getSettings() missing core configs`, details: '' });
        this.updateCoreConfigs();
      }
    }
  }

  private updateCoreConfigs(): void {
    log.debug({ title: `SuiteToolsAppSettings:saveCoreConfigs() initiated`, details: '' });

    const coreConfigs = this.determineCoreConfigs();
    const success = this.stApp.stLib.stLibNs.stLibNsRecord.updateCustomRecord(
      'customrecord_idev_suitetools_settings',
      this._recordId,
      coreConfigs
    );

    log.debug({ title: `SuiteToolsAppSettings:saveCoreConfigs() completed successfully?`, details: success });
  }

  private createCoreConfigs(): void {
    log.debug({ title: `SuiteToolsAppSettings:createCoreConfigs() initiated`, details: '' });

    const coreConfigs = this.determineCoreConfigs();
    const success = this.stApp.stLib.stLibNs.stLibNsRecord.createCustomRecord(
      'customrecord_idev_suitetools_settings',
      coreConfigs
    );

    log.debug({ title: `SuiteToolsAppSettings:createCoreConfigs() completed successfully?`, details: success });
  }

  /**
   * Determine the core configs
   *
   * Helper function for updateCoreConfigs() and createCoreConfigs()
   */
  private determineCoreConfigs(): object {
    // log.debug({ title: `SuiteToolsAppSettings:initializeCoreConfigs() initiated`, details: '' });

    const coreConfigs = {
      custrecord_idev_st_config_css_url: this.stApp.stLib.stLibNs.stLibNsFile.getFileURL('output.css'),
      custrecord_idev_st_config_js_url: this.stApp.stLib.stLibNs.stLibNsFile.getFileURL(
        'public/idev-suitetools-client.js'
      ),
    };
    log.debug({ title: `SuiteToolsAppSettings:determineCoreConfigs() returning`, details: coreConfigs });

    return coreConfigs;
  }
}

/**
 * NetSuite info for SuiteTools App
 *
 * The bulk of this functionality is provided by NetSuite's runtime module.
 */
export class SuiteToolsAppNetSuite {
  get runtime() {
    return runtime;
  }

  constructor() {
    // log.debug({ title: 'SuiteToolsAppNetSuite:constructor()', details: null });
  }

  get isProduction(): boolean {
    return String(runtime.EnvType[runtime.envType]) === 'PRODUCTION';
  }

  get isAdmin(): boolean {
    return this.runtime.getCurrentUser().roleId == 'administrator';
  }
}
