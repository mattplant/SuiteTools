/**
 * SuiteTools API
 *
 * This script handles the SuiteTools API calls.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * Copyright (C) 2024  Matthew Plant
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
 * @NScriptType Restlet
 */
define(["require", "exports", "N/error", "N/log", "./idev-suitetools-app"], function (require, exports, error, log, idev_suitetools_app_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuiteToolsApiPut = exports.SuiteToolsApiGetOptions = exports.SuiteToolsApiGet = exports.SuiteToolsApi = void 0;
    exports.get = get;
    exports.put = put;
    /**
     * Handles the GET request event.
     *
     * @param requestParams The request parameters.
     * @returns The response.
     */
    function get(requestParams) {
        log.audit({ title: 'get() initiated', details: requestParams });
        const stApi = new SuiteToolsApi();
        const response = JSON.stringify(stApi.stApiGet.process(requestParams));
        log.audit({ title: 'get() returning', details: response });
        return response;
    }
    // TODO add POST method
    /**
     * Handles the PUT request event.
     *
     * @param requestParams The request parameters.
     * @returns The response.
     */
    function put(requestBody) {
        log.audit({ title: 'put() initiated', details: requestBody });
        const stApi = new SuiteToolsApi();
        const response = JSON.stringify(stApi.stApiPut.process(requestBody));
        log.audit({ title: 'put() returning', details: response });
        return response;
    }
    /**
     * SuiteTools API
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsApi {
        get stApiGet() {
            return this._stApiGet;
        }
        get stApiPut() {
            return this._stApiPut;
        }
        get stApp() {
            return this._stApp;
        }
        constructor() {
            log.debug({ title: 'SuiteToolsApi:constructor() initiated', details: null });
            this._stApiGet = new SuiteToolsApiGet(this);
            this._stApiPut = new SuiteToolsApiPut(this);
            this._stApp = new idev_suitetools_app_1.SuiteToolsApp();
        }
    }
    exports.SuiteToolsApi = SuiteToolsApi;
    class SuiteToolsApiGet {
        get stApi() {
            return this._stApi;
        }
        get stApiGetOptions() {
            return this._stApiGetOptions;
        }
        constructor(stApi) {
            log.debug({ title: 'SuiteToolsApiGet:constructor() initiated', details: null });
            this._stApi = stApi;
            this._stApiGetOptions = new SuiteToolsApiGetOptions(stApi);
        }
        process(requestParams) {
            log.debug({ title: 'SuiteToolsApiGet:process() initiated', details: requestParams });
            this.assertIsRequestParams(requestParams);
            const response = { data: null };
            // // verify that the required parameters are present
            const endpoint = requestParams.endpoint;
            switch (endpoint) {
                case 'file':
                    response.data = this.getFile(requestParams);
                    break;
                case 'files':
                    response.data = this.getFiles(requestParams);
                    break;
                case 'optionValues':
                    response.data = this.stApiGetOptions.process(requestParams);
                    break;
                case 'script':
                    response.data = this.getScript(requestParams);
                    break;
                case 'scripts':
                    response.data = this.getScripts(requestParams);
                    response.data = this.cleanScriptsData(response.data);
                    break;
                case 'scriptLog':
                    response.data = this.getScriptLog(requestParams);
                    break;
                case 'scriptLogs':
                    response.data = this.getScriptLogs(requestParams);
                    break;
                case 'settings':
                    response.data = this.getSettings(requestParams);
                    break;
                case 'system':
                    response.data = this.getSystem(requestParams);
                    break;
                case 'user':
                    response.data = this.getUser(requestParams);
                    break;
                case 'users':
                    response.data = this.getUsers(requestParams);
                    response.data = this.cleanUsersData(response.data);
                    break;
                default:
                    throw error.create({
                        name: 'SUITE_TOOLS_INVALID_PARAMETER',
                        message: `Invalid parameter: endpoint=${endpoint}`,
                        notifyOff: true,
                    });
            }
            response.remainingUsage = this.stApi.stApp.stAppNs.runtime.getCurrentScript().getRemainingUsage();
            log.debug({ title: 'SuiteToolsApiGet:process() returning', details: response });
            return response;
        }
        assertIsRequestParams(data) {
            // check if the data is an object
            if (typeof data !== 'object' || data === null) {
                throw new Error('Request params data is not an object');
            }
            // endpoint
            if (!('endpoint' in data)) {
                throw new Error('Request params data is missing the "endpoint" field');
            }
            if (typeof data.endpoint !== 'string') {
                throw new Error('Request params data "endpoint" field is not a string');
            }
        }
        convertMultiSelectToArray(field) {
            return field ? (field.includes(',') ? field.split(',') : [field]) : null;
        }
        cleanScriptsData(scripts) {
            log.debug({ title: 'SuiteToolsApiGet:cleanScriptsData() initiated', details: scripts });
            if (scripts && Array.isArray(scripts) && scripts.length > 0) {
                scripts.forEach((script) => {
                    // switch isinactive values to active values
                    if (script.isinactive === 'F') {
                        script.isinactive = 'Yes';
                    }
                    else {
                        script.isinactive = 'No';
                    }
                });
            }
            // log.debug({ title: 'SuiteToolsApiGet:cleanScriptsData() returning', details: scripts });
            return scripts;
        }
        cleanUsersData(data) {
            log.debug({ title: 'SuiteToolsApiGet:cleanUsersData() initiated', details: data });
            if (data && Array.isArray(data) && data.length > 0) {
                data.forEach((script) => {
                    // switch isinactive values to active values
                    if (script.isinactive === 'F') {
                        script.isinactive = 'Yes';
                    }
                    else {
                        script.isinactive = 'No';
                    }
                    // clear role field if empty
                    if (script.role === ' ()') {
                        script.role = '';
                    }
                    // clear supervisor field if empty
                    if (script.supervisor === ' ()') {
                        script.supervisor = '';
                    }
                    // set title field to "" if empty
                    if (script.title === null) {
                        script.title = '';
                    }
                });
            }
            // log.debug({ title: 'SuiteToolsApiGet:cleanUsersData() returning', details: data });
            return data;
        }
        /**
         * Get File
         *
         * @param requestParams
         * @returns settings
         */
        getFile(requestParams) {
            log.debug({ title: 'SuiteToolsApiGet:getFile() initiated', details: requestParams });
            const id = requestParams.id;
            if (!id) {
                throw error.create({
                    name: 'SUITE_TOOLS_MISSING_PARAMETER',
                    message: `Missing required parameter: id`,
                    notifyOff: true,
                });
            }
            const result = this.stApi.stApp.stModel.getFile(id);
            // log.debug({ title: 'SuiteToolsApiGet:getFile() returning', details: result });
            return result;
        }
        /**
         * Get Files
         *
         * @param requestParams
         * @returns settings
         */
        getFiles(requestParams) {
            log.debug({ title: 'SuiteToolsApiGet:getFiles() initiated', details: requestParams });
            const row = requestParams['rows'];
            const types = this.convertMultiSelectToArray(requestParams['filetype']);
            const createdDate = requestParams['createddate'];
            const modifiedDate = requestParams['lastmodifieddate'];
            const result = this.stApi.stApp.stModel.getFiles(row, types, createdDate, modifiedDate);
            // log.debug({ title: 'SuiteToolsApiGet:getFiles() returning', details: result });
            return result;
        }
        /**
         * Get Script
         *
         * @param requestParams
         * @returns settings
         */
        getScript(requestParams) {
            log.debug({ title: 'SuiteToolsApi:getScript() initiated', details: requestParams });
            const id = requestParams.id;
            if (!id) {
                throw error.create({
                    name: 'SUITE_TOOLS_MISSING_PARAMETER',
                    message: `Missing required parameter: id`,
                    notifyOff: true,
                });
            }
            const result = this.stApi.stApp.stModel.getScript(id);
            // log.debug({ title: 'SuiteToolsApi:getScript() returning', details: result });
            return result;
        }
        /**
         * Get Scripts
         *
         * @param requestParams
         * @returns settings
         */
        getScripts(requestParams) {
            log.debug({ title: 'SuiteToolsApiGet:getScripts() initiated', details: requestParams });
            const active = requestParams['active'];
            const versions = this.convertMultiSelectToArray(requestParams['version']);
            const scripttypes = this.convertMultiSelectToArray(requestParams['scripttype']);
            const scripts = this.convertMultiSelectToArray(requestParams['scriptrecord']);
            const owners = this.convertMultiSelectToArray(requestParams['owner']);
            const files = this.convertMultiSelectToArray(requestParams['file']);
            const result = this.stApi.stApp.stModel.getScripts(active, versions, scripttypes, scripts, owners, files);
            // log.debug({ title: 'SuiteToolsApiGet:getScripts() returning', details: result });
            return result;
        }
        /**
         * Get Server Script Log
         *
         * @param requestParams
         * @returns settings
         */
        getScriptLog(requestParams) {
            log.debug({ title: 'SuiteToolsApiGet:getScriptLog() initiated', details: requestParams });
            const id = requestParams.id;
            if (!id) {
                throw error.create({
                    name: 'SUITE_TOOLS_MISSING_PARAMETER',
                    message: `Missing required parameter: id`,
                    notifyOff: true,
                });
            }
            const result = this.stApi.stApp.stModel.getScriptLog(id);
            // log.debug({ title: 'SuiteToolsApiGet:getScriptLog() returning', details: result });
            return result;
        }
        /**
         * Get Server Script Logs
         *
         * @param requestParams
         * @returns settings
         */
        getScriptLogs(requestParams) {
            log.debug({ title: 'SuiteToolsApiGet:getScriptLogs() initiated', details: requestParams });
            const row = requestParams['rows'] ? requestParams['rows'] : '50';
            const levels = this.convertMultiSelectToArray(requestParams['level']);
            // const users = this.convertMultiSelectToArray(requestParams['user']);
            const types = this.convertMultiSelectToArray(requestParams['scripttype']);
            const scripts = this.convertMultiSelectToArray(requestParams['scriptname']);
            const owners = this.convertMultiSelectToArray(requestParams['owner']);
            const date = requestParams['createddate'] ? requestParams['createddate'] : '15';
            const title = requestParams['title'];
            const detail = requestParams['detail'];
            const result = this.stApi.stApp.stModel.getScriptLogsViaSuiteQL(row, levels, types, scripts, owners, date, title, detail);
            // log.debug({ title: 'SuiteToolsApiGet:getScriptLogs() returning', details: result });
            return result;
        }
        /**
         * Get Settings.
         *
         * @param requestParams
         * @returns settings
         */
        getSettings(requestParams) {
            log.debug({ title: 'SuiteToolsApiGet:getSettings() initiated', details: requestParams });
            this.stApi.stApp.stAppSettings.getSettings();
            const result = {
                recordId: this.stApi.stApp.stAppSettings.recordId,
                cssUrl: this.stApi.stApp.stAppSettings.cssUrl,
                jsUrl: this.stApi.stApp.stAppSettings.jsUrl,
                devMode: this.stApi.stApp.stAppSettings.devMode,
            };
            // log.debug({ title: 'SuiteToolsApiGet:getSettings() returning', details: result });
            return result;
        }
        /**
         * Get system values.
         *
         * @param requestParams
         * @returns system
         */
        getSystem(requestParams) {
            log.debug({ title: 'SuiteToolsApiGet:getSystem() initiated', details: requestParams });
            const result = {
                // system
                accountId: this.stApi.stApp.stAppNs.runtime.accountId,
                envType: this.stApi.stApp.stAppNs.runtime.envType,
                isProduction: this.stApi.stApp.stAppNs.isProduction,
                version: this.stApi.stApp.stAppNs.runtime.version,
                processorCount: this.stApi.stApp.stAppNs.runtime.processorCount,
                queueCount: this.stApi.stApp.stAppNs.runtime.queueCount,
                // user
                userId: this.stApi.stApp.stAppNs.runtime.getCurrentUser().id,
                userName: this.stApi.stApp.stAppNs.runtime.getCurrentUser().name,
                userEmail: this.stApi.stApp.stAppNs.runtime.getCurrentUser().email,
                userLocation: this.stApi.stApp.stAppNs.runtime.getCurrentUser().location,
                userDepartment: this.stApi.stApp.stAppNs.runtime.getCurrentUser().department,
                userRole: this.stApi.stApp.stAppNs.runtime.getCurrentUser().role,
                userRoleId: this.stApi.stApp.stAppNs.runtime.getCurrentUser().roleId,
                isAdmin: this.stApi.stApp.stAppNs.isAdmin,
                userSubsidiary: this.stApi.stApp.stAppNs.runtime.getCurrentUser().subsidiary,
            };
            // log.debug({ title: 'SuiteToolsApiGet:getSystem() returning', details: result });
            return result;
        }
        /**
         * Get Script
         *
         * @param requestParams
         * @returns settings
         */
        getUser(requestParams) {
            log.debug({ title: 'SuiteToolsApi:getUser() initiated', details: requestParams });
            const id = requestParams.id;
            if (!id) {
                throw error.create({
                    name: 'SUITE_TOOLS_MISSING_PARAMETER',
                    message: `Missing required parameter: id`,
                    notifyOff: true,
                });
            }
            const result = this.stApi.stApp.stModel.getUser(id);
            // log.debug({ title: 'SuiteToolsApi:getUser() returning', details: result });
            return result;
        }
        /**
         * Get Users
         *
         * @param requestParams
         * @returns settings
         */
        getUsers(requestParams) {
            log.debug({ title: 'SuiteToolsApiGet:getUsers() initiated', details: requestParams });
            const active = requestParams['active'];
            const role = requestParams['role'];
            const supervisors = this.convertMultiSelectToArray(requestParams['owner']);
            const result = this.stApi.stApp.stModel.getUsers(active, role, supervisors);
            // log.debug({ title: 'SuiteToolsApiGet:getUsers() returning', details: result });
            return result;
        }
    }
    exports.SuiteToolsApiGet = SuiteToolsApiGet;
    class SuiteToolsApiGetOptions {
        get stApi() {
            return this._stApi;
        }
        constructor(stApi) {
            log.debug({ title: 'SuiteToolsApiGetOptions:constructor() initiated', details: null });
            this._stApi = stApi;
        }
        process(requestParams) {
            log.debug({ title: 'SuiteToolsApiGetOptions:process() initiated', details: requestParams });
            let data;
            // let result: OptionValuesResponse[];
            let result = {};
            // verify that the required parameters are present
            const type = requestParams.type;
            switch (type) {
                case 'file':
                    data = this.stApi.stApp.stModel.getFileList(true);
                    break;
                case 'filetype':
                    data = this.stApi.stApp.stModel.getFileTypeList();
                    break;
                case 'owner':
                    data = this.stApi.stApp.stModel.getEmployeeList(true);
                    break;
                case 'script':
                    data = this.stApi.stApp.stModel.getScriptList();
                    break;
                case 'scripttype':
                    data = this.stApi.stApp.stModel.getScriptTypeList();
                    break;
                case 'role':
                    data = this.stApi.stApp.stModel.getRoleList(true);
                    break;
                case 'user':
                    data = this.stApi.stApp.stModel.getEmployeeList(true);
                    break;
                default:
                    throw error.create({
                        name: 'SUITE_TOOLS_INVALID_PARAMETER',
                        message: `Invalid parameter: type=${type}`,
                        notifyOff: true,
                    });
            }
            this.assertIsOptionValuesResponse(data);
            const optionValues = this.convertOptionValuesResponse(data);
            if (optionValues.length === 0) {
                log.error({ title: 'SuiteToolsApiGetOptions:process() no results', details: '' });
            }
            else {
                result = optionValues;
            }
            // log.debug({ title: 'SuiteToolsApiGetOptions:process() returning', details: result });
            return result;
        }
        assertIsOptionValuesResponse(data) {
            log.debug({ title: 'SuiteToolsApiGetOptions:assertIsOptionValuesResponse() initiated', details: data });
            if (!Array.isArray(data)) {
                throw new Error('OptionValuesResponse is not an array');
            }
            if (data.length === 0) {
                throw new Error('OptionValuesResponse is empty');
            }
            // check the data for the required fields
            // id
            if (!('id' in data[0])) {
                throw new Error('OptionValuesResponse is missing the "id" field');
            }
            // if (typeof data[0].id !== 'number') {
            //     throw new Error('OptionValuesResponse "id" field is not a number');
            // }
            // name
            if (!('name' in data[0])) {
                throw new Error('OptionValuesResponse is missing the "name" field');
            }
            if (typeof data[0].name !== 'string') {
                throw new Error('OptionValuesResponse "name" field is not a string');
            }
        }
        convertOptionValuesResponse(values) {
            const options = [];
            if (values && Array.isArray(values) && values.length > 0) {
                values.forEach((option) => {
                    options.push({
                        value: String(option.id),
                        text: option.name,
                    });
                });
            }
            return options;
        }
    }
    exports.SuiteToolsApiGetOptions = SuiteToolsApiGetOptions;
    class SuiteToolsApiPut {
        get stApi() {
            return this._stApi;
        }
        constructor(stApi) {
            log.debug({ title: 'SuiteToolsApiPut:constructor() initiated', details: null });
            this._stApi = stApi;
        }
        process(requestBody) {
            log.debug({ title: 'SuiteToolsApiPut:process() initiated', details: requestBody });
            this.assertIsRequestBody(requestBody);
            let response;
            const endpoint = requestBody.endpoint;
            switch (endpoint) {
                case 'settings':
                    response = this.putSettings(requestBody.data);
                    break;
                default:
                    throw error.create({
                        name: 'SUITE_TOOLS_INVALID_PARAMETER',
                        message: `Invalid parameter: endpoint=${endpoint}`,
                        notifyOff: true,
                    });
            }
            response.remainingUsage = this.stApi.stApp.stAppNs.runtime.getCurrentScript().getRemainingUsage();
            // log.debug({ title: 'SuiteToolsApiPut:process() returning', details: response });
            return response;
        }
        assertIsRequestBody(data) {
            log.debug({ title: 'SuiteToolsApiPut:assertIsRequestBody() initiated', details: data });
            if (typeof data !== 'object' || data === null) {
                throw new Error('Request body data is not an object');
            }
            // endpoint
            if (!('endpoint' in data)) {
                throw new Error('Request params data is missing the "endpoint" field');
            }
            if (typeof data.endpoint !== 'string') {
                throw new Error('Request params data "endpoint" field is not a string');
            }
            // data
            if (!('data' in data)) {
                throw new Error('Request params data is missing the "data" field');
            }
            if (typeof data.data !== 'object') {
                throw new Error('Request params data "data" field is not a object');
            }
        }
        assertIsRequestBodyData(data) {
            if (typeof data !== 'object' || data === null) {
                throw new Error('Request body data is not an object');
            }
        }
        putSettings(requestBodyData) {
            this.assertIsRequestBodyData(requestBodyData);
            const devMode = requestBodyData.devMode;
            const updateSettings = { custrecord_idev_st_setting_dev_mode: devMode };
            this.stApi.stApp.stAppSettings.getSettings();
            const success = this.stApi.stApp.stLib.stLibNs.stLibNsRecord.updateCustomRecord(this.stApi.stApp.appSettingsCustomRecord, this.stApi.stApp.stAppSettings.recordId, updateSettings);
            log.debug({ title: `SuiteToolsApiPut:putSettings() saved successfully?`, details: success });
            return {
                status: 200,
                data: 'Settings updated',
            };
        }
    }
    exports.SuiteToolsApiPut = SuiteToolsApiPut;
});
