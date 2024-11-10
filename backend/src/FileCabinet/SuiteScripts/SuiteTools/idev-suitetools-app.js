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
define(["require", "exports", "N/log", "N/runtime", "N/url", "./idev-suitetools-model", "./idev-suitetools-library", "./idev-suitetools-view"], function (require, exports, log, runtime, url, idev_suitetools_model_1, idev_suitetools_library_1, idev_suitetools_view_1) {
    "use strict";
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
        get appSettingsCustomRecord() {
            return this._appSettingsCustomRecord;
        }
        get appCssFile() {
            return this._appCssFile;
        }
        get appJsFile() {
            return this._appJsFile;
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
        get apiUrl() {
            return this._apiUrl;
        }
        constructor(context = null) {
            // application settings
            // these are needed when we use the SuiteToolsApp as either an application or a library
            this._appDir = 'SuiteTools'; // the application folder name in the /SuiteScripts folder
            this._appSettingsCustomRecord = 'customrecord_idev_suitetools_settings'; // the application settings custom record
            // these are needed when we use the SuiteToolsApp as an application
            this._appApiScriptId = 'customscript_idev_suitetools_api'; // the SuiteTools API script id
            this._appApiDeploymentId = 'customdeploy_idev_suitetools_api'; // the SuiteTools API deployment id
            this._appCssFile = 'dist/output.css'; // the SPA site's CSS file
            this._appJsFile = 'dist/app-bundle.js'; // the SPA site's JS file
            // these are needed when we use the SuiteToolsApp as a library
            //   the SuiteTools application script id and deployment id
            this._appScriptId = 'customscript_idev_suitetools_app';
            this._appDeploymentId = 'customdeploy_idev_suitetools_app';
            log.debug({ title: 'SuiteToolsApp:constructor() initiated', details: null });
            // add the libraries
            this._stLib = new idev_suitetools_library_1.SuiteToolsLibrary(this);
            // add the classes
            this._stAppSettings = new SuiteToolsAppSettings(this);
            this._stAppNs = new SuiteToolsAppNetSuite();
            this._stModel = new idev_suitetools_model_1.SuiteToolsModel(this);
            this._stView = new idev_suitetools_view_1.SuiteToolsView(this);
            const host = url.resolveDomain({
                hostType: url.HostType.APPLICATION,
                accountId: this._stAppNs.runtime.accountId,
            });
            if (context) {
                // configure to run as APPLICATION
                log.debug({ title: 'SuiteToolsApp:constructor() initiated as an application', details: null });
                this._context = context;
                // build this script's URLs (dynamically)
                this._scriptUrl = url.resolveScript({
                    scriptId: runtime.getCurrentScript().id,
                    deploymentId: runtime.getCurrentScript().deploymentId,
                    returnExternalUrl: false,
                });
                this._scriptFullUrl = 'https://' + host + this._scriptUrl;
                // get the SuiteTools API URL
                this._apiUrl = url.resolveScript({
                    scriptId: this._appApiScriptId,
                    deploymentId: this._appApiDeploymentId,
                    returnExternalUrl: false,
                });
                // get the settings
                this.stAppSettings.getSettings();
                // bootstrap the SPA page
                this.bootstrapSpa();
            }
            else {
                // configure to use as a LIBRARY
                log.debug({ title: 'SuiteToolsApp:constructor() initiated as a library', details: null });
                // build this script's URLs (statically)
                this._scriptUrl = url.resolveScript({
                    scriptId: this._appScriptId,
                    deploymentId: this._appDeploymentId,
                    returnExternalUrl: false,
                });
                this._scriptFullUrl = 'https://' + host + this._scriptUrl;
            }
        }
        bootstrapSpa() {
            log.debug({ title: 'SuiteToolsApp:bootstrapSpa()', details: null });
            const devMode = this.stAppSettings.devMode;
            log.debug({ title: 'SuiteToolsApp:bootstrapSpa() dev mode = ', details: devMode });
            if (devMode) {
                // do not catch errors in dev mode so that we can see where the error is occurring
                this.bootstrapHelper();
            }
            else {
                // catch errors in production mode so that we can show a user friendly error form
                try {
                    this.bootstrapHelper();
                }
                catch (e) {
                    log.error({ title: 'SuiteToolsApp:bootstrapSpa() caught error', details: e });
                    // show an error form
                    this.stView.renderAppErrorForm(e, devMode);
                }
            }
        }
        bootstrapHelper() {
            const appIssues = this.performChecks();
            if (appIssues.length > 0) {
                // tell user about the issues
                this.stView.renderAppIssuesForm(appIssues);
            }
            else {
                this.stView.renderSpa();
            }
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        performChecks() {
            log.debug({ title: 'SuiteToolsApp:performChecks() initiated', details: null });
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
         * TODO: Do we need this?
         *
         * @param message
         */
        setAlert(message) {
            log.debug({ title: 'SuiteToolsApp:setAlert() initiated with', details: { message: message } });
            this.setSession('alert', message);
        }
        // TODO: Do we need this?
        getAlert() {
            return this.getSession('alert');
        }
        /**
         * Set session value.
         *
         * TODO: move to SuiteToolsAppNetSuite?
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
         * TODO: move to SuiteToolsAppNetSuite?
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
            log.debug({ title: 'SuiteToolsAppSettings:constructor() initiated', details: null });
            this._stApp = stApp;
        }
        /**
         * Get Settings
         */
        getSettings() {
            log.debug({ title: `SuiteToolsAppSettings:getSettings() initiated`, details: '' });
            const sql = `
    SELECT
      ${this.stApp.appSettingsCustomRecord}.id,
      ${this.stApp.appSettingsCustomRecord}.custrecord_idev_st_config_css_url AS cssUrl,
      ${this.stApp.appSettingsCustomRecord}.custrecord_idev_st_config_js_url AS jsUrl,
      ${this.stApp.appSettingsCustomRecord}.custrecord_idev_st_setting_dev_mode AS devMode,
      ${this.stApp.appSettingsCustomRecord}.custrecord_idev_st_config_last_logins AS lastLogins,
      ${this.stApp.appSettingsCustomRecord}.custrecord_idev_st_config_integrations AS integrations,
      ${this.stApp.appSettingsCustomRecord}.custrecord_idev_st_config_tokens AS tokens,
      ${this.stApp.appSettingsCustomRecord}.custrecord_idev_st_config_users AS users,
    FROM
      ${this.stApp.appSettingsCustomRecord}
    WHERE
      isInactive = 'F'
    `;
            const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
            log.debug({ title: `SuiteToolsAppSettings:getSettings() sqlResults = `, details: sqlResults });
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
            const success = this.stApp.stLib.stLibNs.stLibNsRecord.updateCustomRecord(this.stApp.appSettingsCustomRecord, this._recordId, coreConfigs);
            log.debug({ title: `SuiteToolsAppSettings:saveCoreConfigs() completed successfully?`, details: success });
        }
        createCoreConfigs() {
            log.debug({ title: `SuiteToolsAppSettings:createCoreConfigs() initiated`, details: '' });
            const coreConfigs = this.determineCoreConfigs();
            this.stApp.stLib.stLibNs.stLibNsRecord.createCustomRecord(this.stApp.appSettingsCustomRecord, coreConfigs);
            log.debug({ title: `SuiteToolsAppSettings:createCoreConfigs() completed`, details: null });
        }
        /**
         * Determine the core configs
         *
         * Helper function for updateCoreConfigs() and createCoreConfigs()
         */
        determineCoreConfigs() {
            // log.debug({ title: `SuiteToolsAppSettings:determineCoreConfigs() initiated`, details: '' });
            const coreConfigs = {
                custrecord_idev_st_config_css_url: this.stApp.stLib.stLibNs.stLibNsFile.getFileURL(this.stApp.appCssFile),
                custrecord_idev_st_config_js_url: this.stApp.stLib.stLibNs.stLibNsFile.getFileURL(this.stApp.appJsFile),
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
