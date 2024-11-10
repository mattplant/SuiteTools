/* eslint-disable @typescript-eslint/ban-ts-comment */
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
    exports.put = exports.post = exports.get = exports.SuiteToolsApi = void 0;
    /**
     * SuiteTools API
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsApi {
        get stApp() {
            return this._stApp;
        }
        constructor() {
            log.debug({ title: 'SuiteToolsApi:constructor() initiated', details: null });
            this._stApp = new idev_suitetools_app_1.SuiteToolsApp();
        }
    }
    exports.SuiteToolsApi = SuiteToolsApi;
    /**
     * Handles the GET request event.
     *
     * @param requestParams The request parameters.
     * @returns The response.
     */
    function get(requestParams) {
        log.debug({ title: 'SuiteToolsApi:get() initiated', details: requestParams });
        // initialize the SuiteTools API
        const stApi = new SuiteToolsApi();
        // verify that the required parameters are present
        // @ts-ignore-next-line
        const endpoint = requestParams.endpoint;
        if (!endpoint) {
            throw error.create({
                name: 'SUITE_TOOLS_MISSING_PARAMETER',
                message: `Missing required parameter: endpoint`,
                notifyOff: true,
            });
        }
        // handle the request
        switch (endpoint) {
            case 'optionValues':
                return getOptionValues(stApi, requestParams);
            case 'scriptLog':
                return getScriptLog(stApi, requestParams);
            case 'scriptLogs':
                return getScriptLogs(stApi, requestParams);
            case 'script':
                return getScript(stApi, requestParams);
            case 'scripts':
                return getScripts(stApi, requestParams);
            case 'settings':
                return getSettings(stApi, requestParams);
            case 'system':
                return getSystem(stApi, requestParams);
            default:
                throw error.create({
                    name: 'SUITE_TOOLS_INVALID_PARAMETER',
                    message: `Invalid parameter: endpoint=${endpoint}`,
                    notifyOff: true,
                });
        }
    }
    exports.get = get;
    /**
     * Handles the POST request event.
     *
     * @param postParams The request parameters.
     * @returns The response.
     */
    function post(postParams) {
        log.debug({ title: 'SuiteToolsApi:post() initiated', details: postParams });
        // initialize the SuiteTools API
        // const stApi = new SuiteToolsApi();
        // verify that the required parameters are present
        // @ts-ignore-next-line
        const endpoint = postParams.endpoint;
        if (!endpoint) {
            throw error.create({
                name: 'SUITE_TOOLS_MISSING_PARAMETER',
                message: `Missing required parameter: endpoint`,
                notifyOff: true,
            });
        }
        // handle the request
        switch (endpoint) {
            // case '???':
            default:
                throw error.create({
                    name: 'SUITE_TOOLS_INVALID_PARAMETER',
                    message: `Invalid parameter: endpoint=${endpoint}`,
                    notifyOff: true,
                });
        }
    }
    exports.post = post;
    /**
     * Handles the PUT request event.
     *
     * @param requestParams The request parameters.
     * @returns The response.
     */
    function put(requestBody) {
        log.debug({ title: 'SuiteToolsApi:put() initiated', details: requestBody });
        // initialize the SuiteTools API
        const stApi = new SuiteToolsApi();
        // TODO remove this line
        const endpoint = 'settings';
        // // verify that the required parameters are present
        // const endpoint = requestBody.endpoint;
        // if (!endpoint) {
        //   throw error.create({
        //     name: 'SUITE_TOOLS_MISSING_PARAMETER',
        //     message: `Missing required parameter: endpoint`,
        //     notifyOff: true,
        //   });
        // }
        // handle the request
        switch (endpoint) {
            case 'settings':
                return putSettings(stApi, requestBody);
            default:
                throw error.create({
                    name: 'SUITE_TOOLS_INVALID_PARAMETER',
                    message: `Invalid parameter: endpoint=${endpoint}`,
                    notifyOff: true,
                });
        }
    }
    exports.put = put;
    /**
     * Get Server Script Log
     * @param requestParams
     * @returns settings
     */
    function getScriptLog(stApi, requestParams) {
        log.debug({ title: 'SuiteToolsApi:getScriptLog() initiated', details: requestParams });
        // verify that the required parameters are present
        // @ts-ignore-next-line
        const id = requestParams.id;
        if (!id) {
            throw error.create({
                name: 'SUITE_TOOLS_MISSING_PARAMETER',
                message: `Missing required parameter: id`,
                notifyOff: true,
            });
        }
        const data = stApi.stApp.stModel.getScriptLog(id);
        const result = JSON.stringify(data);
        log.debug({ title: 'SuiteToolsApi:getScriptLog() returning', details: result });
        // @ts-ignore-next-line
        return result;
    }
    /**
     * Get Server Script Logs
     *
     * @param requestParams
     * @returns settings
     */
    function getScriptLogs(stApi, requestParams) {
        log.debug({ title: 'SuiteToolsApi:getScriptLogs() initiated', details: requestParams });
        const rows = requestParams['rows'] ? requestParams['rows'] : '50';
        const levels = convertMultiSelectToArray(requestParams['level']);
        // const user = convertMultiSelectToArray(requestParams["user"]);
        const scripttype = convertMultiSelectToArray(requestParams['scripttype']);
        const owner = convertMultiSelectToArray(requestParams['owner']);
        const date = requestParams['date'] ? requestParams['date'] : '15';
        // retrieve the script logs data
        const data = stApi.stApp.stModel.getScriptLogsViaSuiteQL(rows, levels, scripttype, null, owner, date, '', '');
        const result = JSON.stringify(data);
        log.debug({ title: 'SuiteToolsApi:getScriptLogs() returning', details: result });
        // @ts-ignore-next-line
        return result;
    }
    /**
     * Get Server Script Log
     * @param requestParams
     * @returns settings
     */
    function getScript(stApi, requestParams) {
        log.debug({ title: 'SuiteToolsApi:getScript() initiated', details: requestParams });
        // verify that the required parameters are present
        // @ts-ignore-next-line
        const id = requestParams.id;
        if (!id) {
            throw error.create({
                name: 'SUITE_TOOLS_MISSING_PARAMETER',
                message: `Missing required parameter: id`,
                notifyOff: true,
            });
        }
        const data = stApi.stApp.stModel.getScript(id);
        const result = JSON.stringify(data);
        log.debug({ title: 'SuiteToolsApi:getScript() returning', details: result });
        // @ts-ignore-next-line
        return result;
    }
    /**
     * Get Scripts
     *
     * @param requestParams
     * @returns settings
     */
    function getScripts(stApi, requestParams) {
        log.debug({ title: 'SuiteToolsApi:getScripts() initiated', details: requestParams });
        // const active = requestParams["active"] ? requestParams["active"] : "yes";
        // const versions = convertMultiSelectToArray(requestParams["versions"]);
        const scripttype = convertMultiSelectToArray(requestParams['scripttype']);
        // const scripts = convertMultiSelectToArray(requestParams["scripts"]);
        const owner = convertMultiSelectToArray(requestParams['owner']);
        // const file or files
        // retrieve the scripts
        const data = stApi.stApp.stModel.getScripts(null, null, scripttype, null, owner, null);
        const result = JSON.stringify(data);
        log.debug({ title: 'SuiteToolsApi:getScripts() returning', details: result });
        // @ts-ignore-next-line
        return result;
    }
    /**
     * Get settings.
     * @param requestParams
     * @returns settings
     */
    function getSettings(stApi, requestParams) {
        log.debug({ title: 'SuiteToolsApi:getSettings() initiated', details: requestParams });
        // return the settings
        stApi.stApp.stAppSettings.getSettings();
        const settings = {
            recordId: stApi.stApp.stAppSettings.recordId,
            cssUrl: stApi.stApp.stAppSettings.cssUrl,
            jsUrl: stApi.stApp.stAppSettings.jsUrl,
            devMode: stApi.stApp.stAppSettings.devMode,
        };
        const result = JSON.stringify(settings);
        log.debug({ title: 'SuiteToolsApi:getSettings() returning', details: result });
        // @ts-ignore-next-line
        return result;
    }
    /**
     * Put settings.
     * @param requestParams
     * @returns settings
     */
    function putSettings(stApi, requestBody) {
        log.debug({ title: 'SuiteToolsApi:putSettings() initiated', details: requestBody });
        // @ts-ignore-next-line
        const devMode = requestBody.devMode;
        const updateSettings = { custrecord_idev_st_setting_dev_mode: devMode };
        stApi.stApp.stAppSettings.getSettings();
        const success = stApi.stApp.stLib.stLibNs.stLibNsRecord.updateCustomRecord(stApi.stApp.appSettingsCustomRecord, stApi.stApp.stAppSettings.recordId, updateSettings);
        log.debug({ title: `SuiteToolsApi:putSettings() saved successfully?`, details: success });
        // @ts-ignore-next-line
        return JSON.stringify({
            status: 200,
            data: 'Settings updated',
        });
    }
    /**
     * Get system.
     * @param requestParams
     * @returns system
     */
    function getSystem(stApi, requestParams) {
        log.debug({ title: 'SuiteToolsApi:getSystem() initiated', details: requestParams });
        // return the settings
        const system = {
            // system
            accountId: stApi.stApp.stAppNs.runtime.accountId,
            envType: stApi.stApp.stAppNs.runtime.envType,
            isProduction: stApi.stApp.stAppNs.isProduction,
            version: stApi.stApp.stAppNs.runtime.version,
            processorCount: stApi.stApp.stAppNs.runtime.processorCount,
            queueCount: stApi.stApp.stAppNs.runtime.queueCount,
            // user
            userId: stApi.stApp.stAppNs.runtime.getCurrentUser().id,
            userName: stApi.stApp.stAppNs.runtime.getCurrentUser().name,
            userEmail: stApi.stApp.stAppNs.runtime.getCurrentUser().email,
            userLocation: stApi.stApp.stAppNs.runtime.getCurrentUser().location,
            userDepartment: stApi.stApp.stAppNs.runtime.getCurrentUser().department,
            userRole: stApi.stApp.stAppNs.runtime.getCurrentUser().role,
            userRoleId: stApi.stApp.stAppNs.runtime.getCurrentUser().roleId,
            isAdmin: stApi.stApp.stAppNs.isAdmin,
            userSubsidiary: stApi.stApp.stAppNs.runtime.getCurrentUser().subsidiary,
        };
        const result = JSON.stringify(system);
        log.debug({ title: 'SuiteToolsApi:getSystem() returning', details: result });
        // @ts-ignore-next-line
        return result;
    }
    /**
     * Get option values for select fields.
     *
     * @param stApi
     * @param requestParams
     * @returns settings
     */
    function getOptionValues(stApi, requestParams) {
        log.debug({ title: 'SuiteToolsApi:getOptionValues() initiated', details: requestParams });
        let data = '';
        let result = '';
        // verify that the required parameters are present
        // @ts-ignore-next-line
        const type = requestParams.type;
        if (!type) {
            throw error.create({
                name: 'SUITE_TOOLS_MISSING_PARAMETER',
                message: `Missing required parameter: type`,
                notifyOff: true,
            });
        }
        // determine the SQL query to run
        switch (type) {
            case 'owner':
                data = stApi.stApp.stModel.getEmployeeList(true);
                break;
            case 'scripttype':
                data = stApi.stApp.stModel.getScriptTypeList();
                break;
            case 'user':
                data = stApi.stApp.stModel.getEmployeeList(true);
                break;
            default:
                throw error.create({
                    name: 'SUITE_TOOLS_INVALID_PARAMETER',
                    message: `Invalid parameter: type=${type}`,
                    notifyOff: true,
                });
        }
        assertIsOptionValuesResponse(data);
        // need to convert the OptionValuesResponse response to the expected OptionValues type
        const optionValues = convertOptionValuesResponse(data);
        if (optionValues.length === 0) {
            log.error({ title: 'SuiteToolsApi:getOptionValues() no results', details: '' });
        }
        else {
            result = JSON.stringify(optionValues);
            log.debug({ title: 'SuiteToolsApi:getOptionValues() returning', details: result });
        }
        // @ts-ignore-next-line
        return result;
    }
    function assertIsOptionValuesResponse(data) {
        log.debug({ title: 'SuiteToolsApi:assertIsOptionValuesResponse() initiated', details: data });
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
    function convertOptionValuesResponse(values) {
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
    // UTILITIES
    function convertMultiSelectToArray(field) {
        return field ? (field.includes(',') ? field.split(',') : [field]) : null;
    }
});
