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
define(["require", "exports", "N/log", "N/runtime", "N/url", "./idev-suitetools-model", "./idev-suitetools-view", "./idev-suitetools-controller", "./idev-suitetools-library"], function (require, exports, log, runtime, url, idev_suitetools_model_1, idev_suitetools_view_1, idev_suitetools_controller_1, idev_suitetools_library_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuiteToolsAppNetSuite = exports.SuiteToolsAppSettings = exports.SuiteToolsApp = exports.onRequest = void 0;
    /**
     * Suitelet onRequest event handler
     *
     * Routes the SuiteTools application requests to the appropriate handler.
     *
     * @param context - this Suitelet's context object
     */
    function onRequest(context) {
        log.debug({ title: 'SuiteToolsApp:onRequest()', details: context });
        // initialize the SuiteTools application
        new SuiteToolsApp(context);
    }
    exports.onRequest = onRequest;
    /**
     * This is the SuiteTools Application.
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsApp {
        // application settings
        get appDir() {
            return this._appDir;
        }
        get appName() {
            return this._appName;
        }
        get appVersion() {
            return this._appVersion;
        }
        get appBuiltWith() {
            return this._appBuiltWith;
        }
        get appFooter() {
            return this._appFooter;
        }
        get hideNavBar() {
            return this._hideNavBar;
        }
        // libraries
        get stLib() {
            return this._stLib;
        }
        // classes
        get stAppNs() {
            return this._stAppNs;
        }
        get stAppSettings() {
            return this._stAppSettings;
        }
        get stModel() {
            return this._stModel;
        }
        get stView() {
            return this._stView;
        }
        get stController() {
            return this._stController;
        }
        // environment values
        get context() {
            return this._context;
        }
        get scriptUrl() {
            return this._scriptUrl;
        }
        get scriptFullUrl() {
            return this._scriptFullUrl;
        }
        constructor(context) {
            // log.debug({ title: 'SuiteToolsApp:constructor() initiated', details: null });
            // application settings
            this._appDir = 'SuiteTools'; // the folder name in the /SuiteScripts folder
            this._appName = 'SuiteTools';
            this._appVersion = '0.1.0';
            this._appBuiltWith = 'Built with <a href="https://github.com/mattplant/netsuite-typescript-sdf/" target="_blank">NetSuite TypeScript SDF Project Template</a>.';
            this._appFooter = `${this.appName} &bull; ${this.appBuiltWith}`;
            this._hideNavBar = true;
            // initialize the SuiteTools application
            this.initialize(context);
            // route the request
            this.route();
        }
        initialize(context) {
            // log.debug({ title: 'SuiteToolsApp:initialize()', details: null });
            // add the libraries
            this._stLib = new idev_suitetools_library_1.SuiteToolsLibrary(this);
            // add the classes
            this._stAppSettings = new SuiteToolsAppSettings(this);
            this._stAppNs = new SuiteToolsAppNetSuite();
            this._stModel = new idev_suitetools_model_1.SuiteToolsModel(this);
            this._stView = new idev_suitetools_view_1.SuiteToolsView(this);
            this._stController = new idev_suitetools_controller_1.SuiteToolsController(this);
            // set the context
            this._context = context;
            // get this script's URL
            this._scriptUrl = url.resolveScript({
                scriptId: runtime.getCurrentScript().id,
                deploymentId: runtime.getCurrentScript().deploymentId,
                returnExternalUrl: false,
            });
            // get this script's full URL
            const host = url.resolveDomain({
                hostType: url.HostType.APPLICATION,
                accountId: this._stAppNs.runtime.accountId,
            });
            this._scriptFullUrl = 'https://' + host + this._scriptUrl;
        }
        route() {
            // log.debug({ title: 'SuiteToolsApp:route()', details: null });
            const devMode = this.stAppSettings.devMode;
            log.debug({ title: 'SuiteToolsApp:route() dev mode = ', details: devMode });
            try {
                const appIssues = this.performChecks();
                if (appIssues.length > 0) {
                    // tell user about the issues
                    this._stController.renderAppIssuesForm(appIssues);
                }
                else {
                    if (this._context.request.method === 'GET') {
                        this._stController.getRequestHandler();
                    }
                    else {
                        this._stController.postRequestHandler();
                    }
                }
            }
            catch (e) {
                log.error({ title: 'SuiteToolsApp:route() caught error', details: e });
                // show an error form
                this._stController.renderAppErrorForm(e, devMode);
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        performChecks() {
            // log.debug({ title: 'SuiteToolsApp:performChecks() initiated', details: null });
            const results = [];
            // check that core configs are set
            if (!this._stAppSettings.cssUrl || !this._stAppSettings.jsUrl) {
                results.push('Core config settings were not set. SuiteTools has tried to fix issue. Please refresh the page. If issue persists, please contact your administrator.');
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
        setAlert(message) {
            log.debug({ title: 'SuiteToolsApp:setAlert() initiated with', details: { message: message } });
            this.setSession('alert', message);
        }
        getAlert() {
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
        setSession(key, value) {
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
        getSession(key) {
            // log.debug({ title: 'SuiteToolsApp:getSession() initiated with', details: { key: key } });
            // get it
            const value = this.stAppNs.runtime.getCurrentSession().get({ name: key });
            // clear it
            this.stAppNs.runtime.getCurrentSession().set({ name: key, value: null });
            // log.debug({ title: 'SuiteToolsApp:getSession() returning', details: value });
            return value;
        }
    }
    exports.SuiteToolsApp = SuiteToolsApp;
    /**
     * Settings info for SuiteTools App
     */
    class SuiteToolsAppSettings {
        get stApp() {
            return this._stApp;
        }
        get recordId() {
            return this._recordId;
        }
        get cssUrl() {
            return this._cssUrl;
        }
        get jsUrl() {
            return this._jsUrl;
        }
        get devMode() {
            return this._devMode;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get lastLogins() {
            return this._lastLogins;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get integrations() {
            return this._integrations;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get tokens() {
            return this._tokens;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        get users() {
            return this._users;
        }
        constructor(stApp) {
            // log.debug({ title: 'SuiteToolsAppSettings:constructor() initiated', details: null });
            this._stApp = stApp;
            // get the settings
            this.getSettings();
        }
        /**
         * Get Settings
         */
        getSettings() {
            // log.debug({ title: `SuiteToolsAppSettings:getSettings() initiated`, details: '' });
            const sql = `
    SELECT
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.id,
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.custrecord_idev_st_config_css_url AS cssUrl,
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.custrecord_idev_st_config_js_url AS jsUrl,
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.custrecord_idev_st_setting_dev_mode AS devMode,
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.custrecord_idev_st_config_last_logins AS lastLogins,
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.custrecord_idev_st_config_integrations AS integrations,
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.custrecord_idev_st_config_tokens AS tokens,
      CUSTOMRECORD_IDEV_SUITETOOLS_SETTINGS.custrecord_idev_st_config_users AS users,
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
            }
            else {
                this._recordId = sqlResults[0].id;
                this._cssUrl = sqlResults[0].cssurl;
                this._jsUrl = sqlResults[0].jsurl;
                this._devMode = sqlResults[0].devmode === 'T' ? true : false;
                this._lastLogins = JSON.parse(sqlResults[0].lastlogins);
                this._integrations = JSON.parse(sqlResults[0].integrations);
                this._tokens = JSON.parse(sqlResults[0].tokens);
                this._users = JSON.parse(sqlResults[0].users);
                // if core configs are not set then set them
                if (!this._cssUrl || !this._jsUrl) {
                    log.error({ title: `SuiteToolsAppSettings:getSettings() missing core configs`, details: '' });
                    this.updateCoreConfigs();
                }
            }
        }
        updateCoreConfigs() {
            log.debug({ title: `SuiteToolsAppSettings:saveCoreConfigs() initiated`, details: '' });
            const coreConfigs = this.determineCoreConfigs();
            const success = this.stApp.stLib.stLibNs.stLibNsRecord.updateCustomRecord('customrecord_idev_suitetools_settings', this._recordId, coreConfigs);
            log.debug({ title: `SuiteToolsAppSettings:saveCoreConfigs() completed successfully?`, details: success });
        }
        createCoreConfigs() {
            log.debug({ title: `SuiteToolsAppSettings:createCoreConfigs() initiated`, details: '' });
            const coreConfigs = this.determineCoreConfigs();
            const success = this.stApp.stLib.stLibNs.stLibNsRecord.createCustomRecord('customrecord_idev_suitetools_settings', coreConfigs);
            log.debug({ title: `SuiteToolsAppSettings:createCoreConfigs() completed successfully?`, details: success });
        }
        /**
         * Determine the core configs
         *
         * Helper function for updateCoreConfigs() and createCoreConfigs()
         */
        determineCoreConfigs() {
            // log.debug({ title: `SuiteToolsAppSettings:initializeCoreConfigs() initiated`, details: '' });
            const coreConfigs = {
                custrecord_idev_st_config_css_url: this.stApp.stLib.stLibNs.stLibNsFile.getFileURL('output.css'),
                custrecord_idev_st_config_js_url: this.stApp.stLib.stLibNs.stLibNsFile.getFileURL('public/idev-suitetools-client.js'),
            };
            log.debug({ title: `SuiteToolsAppSettings:determineCoreConfigs() returning`, details: coreConfigs });
            return coreConfigs;
        }
    }
    exports.SuiteToolsAppSettings = SuiteToolsAppSettings;
    /**
     * NetSuite info for SuiteTools App
     *
     * The bulk of this functionality is provided by NetSuite's runtime module.
     */
    class SuiteToolsAppNetSuite {
        get runtime() {
            return runtime;
        }
        constructor() {
            // log.debug({ title: 'SuiteToolsAppNetSuite:constructor()', details: null });
        }
        get isProduction() {
            return String(runtime.EnvType[runtime.envType]) === 'PRODUCTION';
        }
        get isAdmin() {
            return this.runtime.getCurrentUser().roleId == 'administrator';
        }
    }
    exports.SuiteToolsAppNetSuite = SuiteToolsAppNetSuite;
});
