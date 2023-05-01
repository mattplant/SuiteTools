/**
 * SuiteTools Controller
 *
 * This script binds the Model and View together.
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
define(["require", "exports", "N/error", "N/log", "./idev-suitetools-view"], function (require, exports, error, log, idev_suitetools_view_1) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SuiteToolsController = void 0;
    /**
     * SuiteTools Controller
     *
     * @author Matthew Plant <i@idev.systems>
     */
    class SuiteToolsController {
        get stApp() {
            return this._stApp;
        }
        constructor(stApp) {
            // log.debug({ title: 'SuiteToolsController:constructor() initiated', details: null });
            this._stApp = stApp;
        }
        /**
         * Handles the GET request event.
         */
        getRequestHandler() {
            // log.debug({ title: 'SuiteToolsController:getRequestHandler() initiated', details: null });
            // render the desired page
            const { action, id } = this.stApp.context.request.parameters;
            log.debug('SuiteToolsController:getRequestHandle() routing request', { action: action, id: id });
            switch (action) {
                // handle pages
                case 'settings':
                    this.renderSettingsForm();
                    break;
                // tools
                case 'system':
                    this.renderSystemForm();
                    break;
                // objects
                case 'files':
                    this.renderFilesForm();
                    break;
                case 'fileModal':
                    this.renderFileForm(idev_suitetools_view_1.RenderType.Modal, id);
                    break;
                // case 'file':
                //   this.renderFileForm(id);
                //   break;
                case 'scripts':
                    this.renderScriptsForm();
                    break;
                case 'scriptModal':
                    this.renderScriptForm(idev_suitetools_view_1.RenderType.Modal, id);
                    break;
                case 'script':
                    this.renderScriptForm(idev_suitetools_view_1.RenderType.Normal, id);
                    break;
                // reports
                case 'integrations':
                    this.renderIntegrationsForm();
                    break;
                case 'integrationModal':
                    this.renderIntegrationForm(idev_suitetools_view_1.RenderType.Modal, id);
                    break;
                case 'integration':
                    this.renderIntegrationForm(idev_suitetools_view_1.RenderType.Normal, id);
                    break;
                case 'tokens':
                    this.renderTokensForm();
                    break;
                case 'tokenModal':
                    this.renderTokenForm(idev_suitetools_view_1.RenderType.Modal, id);
                    break;
                case 'token':
                    this.renderTokenForm(idev_suitetools_view_1.RenderType.Normal, id);
                    break;
                case 'roles':
                    this.renderRolesForm();
                    break;
                case 'roleModal':
                    this.renderRoleForm(idev_suitetools_view_1.RenderType.Modal, id);
                    break;
                case 'role':
                    this.renderRoleForm(idev_suitetools_view_1.RenderType.Normal, id);
                    break;
                case 'users': // we are using the same form for employees and users
                    this.renderUsersForm();
                    break;
                case 'userModal':
                    this.renderUserForm(idev_suitetools_view_1.RenderType.Modal, id);
                    break;
                case 'user':
                    this.renderUserForm(idev_suitetools_view_1.RenderType.Normal, id);
                    break;
                case 'userLogins':
                    this.renderUserLoginsForm();
                    break;
                // case 'employees': // we are using the same form for employees and users
                case 'employeeModal':
                    this.renderEmployeeForm(idev_suitetools_view_1.RenderType.Modal, id);
                    break;
                case 'employee':
                    this.renderEmployeeForm(idev_suitetools_view_1.RenderType.Normal, id);
                    break;
                case 'scriptLogs':
                    this.renderScriptLogsForm();
                    break;
                case 'webServicesLogs':
                    this.stApp.stView.renderIframeSearch('customsearch_idev_web_services_logs');
                    break;
                default:
                    // if no action was specified then show the home page
                    this.stApp.stView.render(idev_suitetools_view_1.RenderType.Normal, this.getDashboardContent());
            }
        }
        /**
         * Handles the POST request event.
         */
        postRequestHandler() {
            log.debug({
                title: 'SuiteToolsController:processPostRequest() initiated with parameters',
                details: this.stApp.context.request.parameters,
            });
            // determine if it is a custom form or a NetSuite form
            if (this.stApp.context.request.parameters.action) {
                // it is a custom form
                const action = this.stApp.context.request.parameters.action;
                log.debug({ title: 'SuiteToolsController:processPostRequest() - action', details: action });
                switch (action) {
                    // handle posted data
                    case 'postData':
                        this.processPostedData();
                        break;
                    // handle pages
                    case 'files':
                        this.renderFilesForm();
                        break;
                    case 'scripts':
                        this.renderScriptsForm();
                        break;
                    case 'userLogins':
                        this.renderUserLoginsForm();
                        break;
                    case 'integrations':
                        this.renderIntegrationsForm();
                        break;
                    case 'tokens':
                        this.renderTokensForm();
                        break;
                    case 'roles':
                        this.renderRolesForm();
                        break;
                    case 'users':
                        this.renderUsersForm();
                        break;
                    case 'scriptLogs':
                        this.renderScriptLogsForm();
                        break;
                    default:
                        throw error.create({
                            name: 'SUITE_TOOLS_INVALID_FORM_ERROR',
                            message: `An unsupported action ("${action}") was posted.`,
                            notifyOff: true,
                        });
                }
            }
            else {
                // see if it is a NetSuite form
                const formSubmitted = this.stApp.context.request.parameters.submitter;
                log.debug({ title: 'SuiteToolsController:processPostRequest() - formSubmitted', details: formSubmitted });
                switch (formSubmitted) {
                    // case 'Get iFrame Sample':
                    //   // show the item transactions view
                    //   this.renderIframeSample(this.stApp.scriptUrl, this.stApp.context);
                    //   break;
                    default:
                        // if no form was specified then log and show error
                        log.error('SuiteToolsController:processPostRequest', 'Invalid request form given: ' + formSubmitted);
                        // write error to screen
                        this.stApp.context.response.setHeader({ name: 'Content-Type', value: 'application/json' });
                        this.stApp.context.response.write(`An unsupported NetSuite form ("${formSubmitted}") was posted.`);
                }
            }
        }
        /**
         * Gets posted fields from the main Suitelet's POST request.
         *
         * @param requestParameters - the request parameters from the main Suitelet's POST request
         * @returns the custom posted fields
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getPostedFields(requestParameters) {
            log.debug({
                title: 'SuiteToolsController:getPostedFields() initiated',
                details: { requestParameters: requestParameters },
            });
            // determine and get simple custom fields (e.g. all but custom multiselects)
            const customFields = [];
            for (const key in requestParameters) {
                if (key.startsWith('custom_')) {
                    // exclude NetSuite multiselects - they are handled separately below
                    if (!key.endsWith('[]') && key !== 'custom_multiselects') {
                        customFields.push(key);
                    }
                }
            }
            // log.debug({
            //   title: 'SuiteToolsController:getPostedFields() identified simple custom fields',
            //   details: { customFields },
            // });
            const postedFields = [];
            for (const field of customFields) {
                postedFields.push({ name: field, value: requestParameters[field] });
            }
            // get custom multiselects from #custom_multiselects which is workaround for NetSuite handling of multiselects
            if (requestParameters.custom_multiselects) {
                const multiselects = JSON.parse(requestParameters.custom_multiselects);
                // log.debug({
                //   title: 'SuiteToolsController:getPostedFields() identified identified multiselects',
                //   details: multiselects,
                // });
                for (const field of multiselects) {
                    const fieldName = field.field;
                    const fieldValues = [];
                    for (const value of field.values) {
                        if (value.value) {
                            fieldValues.push(value.value);
                        }
                    }
                    if (fieldValues.length > 0) {
                        postedFields.push({ name: fieldName, value: fieldValues });
                    }
                }
            }
            log.debug({ title: 'SuiteToolsController:getPostedFields() returning', details: postedFields });
            return postedFields;
        }
        /**
         * Gets a specific posted field.
         *
         * @param desiredField - the field name
         * @param postedFields - the custom posted fields
         * @returns posted field value for the desired field
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getPostedField(desiredField, postedFields) {
            // log.debug({
            //   title: 'SuiteToolsController:getPostedField() initiated',
            //   details: { desiredField: desiredField, postedFields: postedFields },
            // });
            let result = null;
            if (postedFields) {
                // lookup field from posted fields
                const field = postedFields.find((field) => field.name === desiredField);
                if (field) {
                    result = field.value;
                }
                else {
                    // log.debug({ title: 'SuiteToolsController:getPostedField() message', details: 'field not found' });
                }
            }
            else {
                // log.debug({ title: 'SuiteToolsController:getPostedField() message', details: 'postedFields is empty' });
            }
            // log.debug({ title: `getPostedField() for "${desiredField}" returning`, details: result });
            return result;
        }
        // ---------------------------------------------------------------------------------------------
        // Data
        // ---------------------------------------------------------------------------------------------
        processPostedData() {
            log.debug({ title: 'SuiteToolsController:processPostedData() initiated with', details: null });
            // get request body
            const requestBody = this.stApp.context.request.body;
            // log.debug({ title: 'SuiteToolsController:processPostedData() requestBody =', details: requestBody });
            const requestBodyObj = JSON.parse(requestBody);
            // eslint-disable-next-line no-prototype-builtins
            if (requestBodyObj.hasOwnProperty('name') && requestBodyObj.hasOwnProperty('value')) {
                // get the name from the request body
                const name = requestBodyObj.name;
                // get the value from the request body
                const value = requestBodyObj.value;
                // log.debug({ title: 'SuiteToolsController:processPostedData() data', details: { name: name, value: value } });
                // determine setting to update
                let updateSettings = null;
                switch (name) {
                    case 'devmode':
                        updateSettings = { custrecord_idev_st_setting_dev_mode: value };
                        break;
                    case 'integrations':
                        updateSettings = this.updateIntegrationsData(value);
                        break;
                    case 'integration':
                        // test this
                        this.updateIntegrationData(value);
                        break;
                    default:
                        log.debug({ title: 'SuiteToolsController:processPostedData() invalid name value', details: name });
                }
                if (updateSettings) {
                    // save to the settings record
                    if (!Array.isArray(updateSettings)) {
                        const success = this.stApp.stLib.stLibNs.stLibNsRecord.updateCustomRecord('customrecord_idev_suitetools_settings', this.stApp.stAppSettings.recordId, updateSettings);
                        log.debug({ title: `SuiteToolsController:processPostedData() saved successfully?`, details: success });
                    }
                    else {
                        log.debug({
                            title: `SuiteToolsController:processPostedData() updateSettings is an array of settings`,
                            details: updateSettings.length + ' settings',
                        });
                        for (const updateSetting of updateSettings) {
                            const success = this.stApp.stLib.stLibNs.stLibNsRecord.updateCustomRecord('customrecord_idev_suitetools_settings', this.stApp.stAppSettings.recordId, updateSetting);
                            log.debug({ title: `SuiteToolsController:processPostedData() saved successfully?`, details: success });
                        }
                    }
                    // log remaining usage
                    log.debug({
                        title: `SuiteToolsController:processPostedData() Remaining Usage`,
                        details: this.stApp.stAppNs.runtime.getCurrentScript().getRemainingUsage() +
                            ' units' +
                            ' (' +
                            this.stApp.stAppNs.runtime.getCurrentScript().getRemainingUsage() / 10 +
                            '%)',
                    });
                }
            }
            else {
                log.debug({ title: 'SuiteToolsController:processPostedData() message', details: 'name and/or value not found' });
            }
            // write response
            const content = { message: 'payload was processed' };
            this.stApp.context.response.setHeader({ name: 'Content-Type', value: 'application/json' });
            this.stApp.context.response.write(JSON.stringify(content));
        }
        // ---------------------------------------------------------------------------------------------
        // Views
        // ---------------------------------------------------------------------------------------------
        /**
         * Gets dashboard page content.
         */
        getDashboardContent() {
            // log.debug({ title: 'SuiteToolsController:getDashboardContent() initiated', details: '' });
            // build content
            const content = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/dashboard.html');
            return content;
        }
        /**
         * Renders the Application Issues form.
         *
         * @param issues - issues with the application that prevent it from running properly
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        renderAppIssuesForm(issues) {
            log.debug({ title: 'SuiteToolsController:renderAppIssuesForm() initiated', details: { issues: issues } });
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/appIssues.html');
            const bodyValues = {};
            bodyValues['issues'] = issues;
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.PageOnly, body, bodyValues);
        }
        /**
         * Renders the Application Error form.
         *
         * @param appError - issues with the application that prevent it from running properly
         */
        renderAppErrorForm(e, devMode) {
            log.debug({ title: 'SuiteToolsController:renderAppErrorForm() initiated', details: null });
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/appError.html');
            const bodyValues = {};
            bodyValues['id'] = e.id;
            bodyValues['name'] = e.name;
            bodyValues['message'] = e.message;
            if (devMode) {
                // only display stack if in dev mode
                const stackLines = e.stack[0];
                log.debug({ title: 'SuiteToolsController:renderAppErrorForm() stackLines', details: stackLines });
                const stackLinesArray = stackLines.split('at');
                log.debug({ title: 'SuiteToolsController:renderAppErrorForm() stackLinesArray', details: stackLinesArray });
                bodyValues['stack'] = stackLinesArray;
            }
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.PageOnly, body, bodyValues);
        }
        /**
         * Renders the Settings form.
         */
        renderSettingsForm() {
            log.debug({ title: 'SuiteToolsController:renderSettingsForm() initiated', details: '' });
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/settings.html');
            const bodyValues = {};
            bodyValues['scriptUrl'] = this.stApp.scriptUrl;
            bodyValues['recordid'] = this.stApp.stAppSettings.recordId;
            bodyValues['cssurl'] = this.stApp.stAppSettings.cssUrl;
            bodyValues['jsurl'] = this.stApp.stAppSettings.jsUrl;
            bodyValues['devmode'] = this.stApp.stAppSettings.devMode;
            bodyValues['urlIntegrations'] = this.stApp.scriptUrl + '&action=getIntegrations';
            bodyValues['integrations'] = this.stApp.stAppSettings.integrations;
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.Normal, body, bodyValues);
        }
        /**
         * Renders the System form.
         */
        renderSystemForm() {
            log.debug({ title: 'SuiteToolsController:renderSystemForm() initiated', details: '' });
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/system.html');
            const bodyValues = {};
            // system
            bodyValues['accountId'] = this.stApp.stAppNs.runtime.accountId;
            bodyValues['envType'] = this.stApp.stAppNs.runtime.envType;
            bodyValues['isProduction'] = this.stApp.stAppNs.isProduction;
            bodyValues['version'] = this.stApp.stAppNs.runtime.version;
            bodyValues['processorCount'] = this.stApp.stAppNs.runtime.processorCount;
            bodyValues['queueCount'] = this.stApp.stAppNs.runtime.queueCount;
            // user
            bodyValues['userId'] = this.stApp.stAppNs.runtime.getCurrentUser().id;
            bodyValues['userName'] = this.stApp.stAppNs.runtime.getCurrentUser().name;
            bodyValues['userEmail'] = this.stApp.stAppNs.runtime.getCurrentUser().email;
            bodyValues['userLocation'] = this.stApp.stAppNs.runtime.getCurrentUser().location;
            bodyValues['userDepartment'] = this.stApp.stAppNs.runtime.getCurrentUser().department;
            bodyValues['userRole'] = this.stApp.stAppNs.runtime.getCurrentUser().role;
            bodyValues['userRoleId'] = this.stApp.stAppNs.runtime.getCurrentUser().roleId;
            bodyValues['isAdmin'] = this.stApp.stAppNs.isAdmin;
            bodyValues['userSubsidiary'] = this.stApp.stAppNs.runtime.getCurrentUser().subsidiary;
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.Normal, body, bodyValues);
        }
        /**
         * Renders the Files form.
         */
        renderFilesForm() {
            log.debug({ title: 'SuiteToolsController:renderFilesForm() initiated', details: '' });
            this.stApp.setAlert('This feature is still under development.');
            // set form input option values dynamically
            // rows
            const rowOptions = this.stApp.stView.getRowOptions();
            // types
            const typesOptions = this.retrieveOptionValues('SELECT MediaType.key as id, MediaType.name FROM MediaType ORDER BY name');
            // versions
            const createdOptions = this.stApp.stView.getDateOptions();
            // versions
            const modifiedOptions = this.stApp.stView.getDateOptions();
            // option values
            const optionValuesObj = {
                options: [
                    {
                        field: 'custom_rows',
                        values: rowOptions,
                    },
                    {
                        field: 'custom_types',
                        values: typesOptions,
                    },
                    {
                        field: 'custom_created_dates',
                        values: createdOptions,
                    },
                    {
                        field: 'custom_modified_dates',
                        values: modifiedOptions,
                    },
                ],
            };
            // const formData = this.stApp.stLib.stLibNs.generateFormData();
            const optionValues = 'var optionValues = ' + JSON.stringify(optionValuesObj);
            // get the results
            let formFieldValues = {};
            if (this.stApp.context.request.method == 'GET') {
                // GET - default initial values
                formFieldValues = [{ name: 'custom_modified_dates', value: 'today' }];
            }
            else {
                // POST - get values from POSTed fields
                formFieldValues = this.getPostedFields(this.stApp.context.request.parameters);
            }
            const rows = this.getPostedField('custom_rows', formFieldValues);
            const types = this.getPostedField('custom_types', formFieldValues);
            const createdDates = this.getPostedField('custom_created_dates', formFieldValues);
            const modifiedDates = this.getPostedField('custom_modified_dates', formFieldValues);
            const results = this.stApp.stModel.getFiles(rows, types, createdDates, modifiedDates);
            const resultsTemplate = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/results/files.html');
            const resultsValues = {};
            resultsValues['scriptUrl'] = this.stApp.scriptUrl;
            resultsValues['tableData'] = this.stApp.stView.generateTableData(results);
            const resultsContent = this.stApp.stView.buildContent(resultsTemplate, resultsValues);
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/files.html');
            const bodyValues = {};
            bodyValues['fileModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/file.html');
            bodyValues['scriptUrl'] = this.stApp.scriptUrl;
            bodyValues['optionValues'] = optionValues;
            bodyValues['formSelections'] = this.stApp.stView.generateFormSelections(formFieldValues);
            bodyValues['results'] = resultsContent;
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.Normal, body, bodyValues);
        }
        /**
         * Renders the File form.
         *
         * @param renderType - the type of render
         * @param id - the internal ID of the record
         */
        renderFileForm(renderType, id) {
            log.debug({
                title: 'SuiteToolsController:renderFileForm() initiated',
                details: { renderType: renderType, id: id },
            });
            // get the record
            const record = this.stApp.stModel.getFile(id);
            // display the form
            const filename = 'views/partials/file.html';
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents(filename);
            const bodyValues = {};
            bodyValues['id'] = record.id;
            bodyValues['folder'] = record.folder;
            bodyValues['createddate'] = record.createddate;
            bodyValues['lastmodifieddate'] = record.lastmodifieddate;
            bodyValues['filetype'] = record.filetype;
            bodyValues['name'] = record.name;
            bodyValues['filesize'] = record.filesize;
            bodyValues['description'] = record.description;
            bodyValues['url'] = record.url;
            bodyValues['urlNs'] = '/app/common/media/mediaitem.nl?id=' + record.id;
            this.stApp.stView.render(renderType, body, bodyValues);
        }
        /**
         * Renders the Scripts form.
         */
        renderScriptsForm() {
            log.debug({ title: 'SuiteToolsController:renderScriptsForm() initiated', details: null });
            // set form input option values dynamically
            // active
            const activeOptions = this.stApp.stView.getActiveOptions();
            // versions
            const versionOptions = this.stApp.stView.getApiVersionOptions();
            // types
            const typeOptions = this.getOptionValues(this.stApp.stModel.getScriptTypeList());
            // scripts
            const scriptOptions = this.getOptionValues(this.stApp.stModel.getScriptList());
            // owners
            const ownerOptions = this.getOptionValues(this.stApp.stModel.getEmployeeList());
            // files
            const fileOptions = this.retrieveOptionValues('SELECT UNIQUE file.name, file.id FROM script INNER JOIN file ON script.scriptfile = file.id ORDER BY file.name');
            // option values
            const optionValuesObj = {
                options: [
                    {
                        field: 'custom_active',
                        values: activeOptions,
                    },
                    {
                        field: 'custom_versions',
                        values: versionOptions,
                    },
                    {
                        field: 'custom_types',
                        values: typeOptions,
                    },
                    {
                        field: 'custom_scripts',
                        values: scriptOptions,
                    },
                    {
                        field: 'custom_owners',
                        values: ownerOptions,
                    },
                    {
                        field: 'custom_files',
                        values: fileOptions,
                    },
                ],
            };
            // const formData = this.stApp.stLib.stLibNs.generateFormData();
            const optionValues = 'var optionValues = ' + JSON.stringify(optionValuesObj);
            // get the results
            let formFieldValues = [];
            if (this.stApp.context.request.method == 'GET') {
                // GET - default initial values
                formFieldValues.push({ name: 'custom_active', value: 'yes' });
            }
            else {
                // POST - get values from POSTed fields
                formFieldValues = this.getPostedFields(this.stApp.context.request.parameters);
            }
            const active = this.getPostedField('custom_active', formFieldValues);
            const versions = this.getPostedField('custom_versions', formFieldValues);
            const types = this.getPostedField('custom_types', formFieldValues);
            const scripts = this.getPostedField('custom_scripts', formFieldValues);
            const owners = this.getPostedField('custom_owners', formFieldValues);
            const files = this.getPostedField('custom_files', formFieldValues);
            const results = this.stApp.stModel.getScripts(active, versions, types, scripts, owners, files);
            const resultsTemplate = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/results/scripts.html');
            const resultsValues = {};
            resultsValues['scriptUrl'] = this.stApp.scriptUrl;
            resultsValues['tableData'] = this.stApp.stView.generateTableData(results);
            const resultsContent = this.stApp.stView.buildContent(resultsTemplate, resultsValues);
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/scripts.html');
            const bodyValues = {};
            bodyValues['scriptModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/script.html');
            bodyValues['userModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/user.html');
            bodyValues['fileModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/file.html');
            bodyValues['scriptUrl'] = this.stApp.scriptUrl;
            bodyValues['optionValues'] = optionValues;
            bodyValues['formSelections'] = this.stApp.stView.generateFormSelections(formFieldValues);
            bodyValues['results'] = resultsContent;
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.Normal, body, bodyValues);
        }
        /**
         * Renders the Script form.
         *
         * @param renderType - the type of render
         * @param id - the internal ID of the record
         */
        renderScriptForm(renderType, id) {
            log.debug({
                title: 'SuiteToolsController:renderScriptForm() initiated',
                details: { renderType: renderType, id: id },
            });
            // get the record
            const record = this.stApp.stModel.getScript(id);
            // display the form
            let filename = 'views/script.html';
            if (renderType === idev_suitetools_view_1.RenderType.Modal) {
                filename = 'views/partials/modals/content/script.html';
            }
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents(filename);
            const bodyValues = {};
            if (record) {
                bodyValues['id'] = record.id;
                bodyValues['apiversion'] = record.apiversion;
                bodyValues['isinactive'] = record.isinactive == 'T';
                bodyValues['scripttype'] = record.scripttype;
                bodyValues['name'] = record.name;
                bodyValues['scriptid'] = record.scriptid;
                bodyValues['owner'] = record.owner;
                bodyValues['scriptfile'] = record.scriptfile;
                bodyValues['notifyemails'] = record.notifyemails;
                bodyValues['description'] = record.description;
                bodyValues['urlNs'] = '/app/common/scripting/script.nl?id=' + record.id;
                bodyValues['urlScript'] = this.stApp.scriptUrl + '&action=script&id=' + record.id;
                bodyValues['urlScriptLogs'] = this.stApp.scriptUrl + '&action=scriptLogs&scriptId=' + record.id;
                if (renderType === idev_suitetools_view_1.RenderType.Normal) {
                    // bodyValues['code'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents( ???)
                }
            }
            this.stApp.stView.render(renderType, body, bodyValues);
        }
        /**
         * Renders the Integrations form
         */
        renderIntegrationsForm() {
            log.debug({ title: 'SuiteToolsController:renderIntegrationsForm() initiated', details: null });
            // set form input option values dynamically
            const optionValuesObj = {
                options: [],
            };
            const optionValues = 'var optionValues = ' + JSON.stringify(optionValuesObj);
            // get the results
            let formFieldValues = [];
            if (this.stApp.context.request.method == 'GET') {
                // Set the default initial values
                formFieldValues.push({ name: 'custom_status', value: 'T' });
            }
            else {
                // POST - get values from POSTed fields
                formFieldValues = this.getPostedFields(this.stApp.context.request.parameters);
            }
            const status = this.getPostedField('custom_status', formFieldValues);
            const results = this.stApp.stModel.getIntegrations(status);
            const resultsTemplate = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/results/integrations.html');
            const resultsValues = {};
            resultsValues['scriptUrl'] = this.stApp.scriptUrl;
            resultsValues['tableData'] = this.stApp.stView.generateTableData(results);
            const resultsContent = this.stApp.stView.buildContent(resultsTemplate, resultsValues);
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/integrations.html');
            const bodyValues = {};
            bodyValues['userModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/user.html');
            bodyValues['integrationModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/integration.html');
            bodyValues['scriptUrl'] = this.stApp.scriptUrl;
            bodyValues['optionValues'] = optionValues;
            bodyValues['formSelections'] = this.stApp.stView.generateFormSelections(formFieldValues);
            bodyValues['results'] = resultsContent;
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.Normal, body, bodyValues);
        }
        /**
         * Renders the Integration form.
         *
         * @param renderType - the type of render
         * @param id - the internal ID of the record
         */
        renderIntegrationForm(renderType, id) {
            log.debug({
                title: 'SuiteToolsController:renderIntegrationForm() initiated',
                details: { renderType: renderType, id: id },
            });
            // get the record
            const record = this.stApp.stModel.getIntegration(id);
            // display the form
            let filename = 'views/integration.html';
            if (renderType === idev_suitetools_view_1.RenderType.Modal) {
                filename = 'views/partials/modals/content/integration.html';
            }
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents(filename);
            const bodyValues = {};
            if (record) {
                bodyValues['scriptUrl'] = this.stApp.scriptUrl;
                bodyValues['id'] = record.id;
                bodyValues['active'] = record.active == 'T';
                bodyValues['name'] = record.name;
                bodyValues['integrationId'] = record.integrationId;
                bodyValues['createdOn'] = record.createdOn;
                bodyValues['tokenauthflag'] = record.tokenauthflag;
                bodyValues['authorizationcodegrant'] = record.authorizationcodegrant;
                bodyValues['rlcauthflag'] = record.rlcauthflag;
                bodyValues['url'] = this.stApp.scriptUrl + '&action=integration&id=' + record.id;
                bodyValues['urlNs'] = '/app/common/integration/integrapp.nl?id=' + record.id;
                bodyValues['urlTokens'] = this.stApp.scriptUrl + '&action=tokens&integrationId=' + record.id;
                if (renderType === idev_suitetools_view_1.RenderType.Normal) {
                    // display the tokens for this integration
                    const results = this.stApp.stModel.getTokens(null, record.id, null, null);
                    const resultsTemplate = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/results/tokens.html');
                    const resultsValues = {};
                    resultsValues['scriptUrl'] = this.stApp.scriptUrl;
                    resultsValues['tableData'] = this.stApp.stView.generateTableData(results);
                    const resultsContent = this.stApp.stView.buildContent(resultsTemplate, resultsValues);
                    bodyValues['results'] = resultsContent;
                }
            }
            this.stApp.stView.render(renderType, body, bodyValues);
        }
        /**
         * Renders the Tokens form
         */
        renderTokensForm() {
            log.debug({ title: 'SuiteToolsController:renderTokensForm() initiated', details: null });
            // set form input option values dynamically
            // active
            const activeOptions = this.stApp.stView.getActiveOptions();
            // integrations
            const integrationOptions = this.getOptionValues(this.stApp.stModel.getIntegrationList());
            // users
            const userOptions = this.getOptionValues(this.stApp.stModel.getEmployeeList(true));
            // roles
            const roleOptions = this.getOptionValues(this.stApp.stModel.getRoleList());
            // option values
            const optionValuesObj = {
                options: [
                    {
                        field: 'custom_active',
                        values: activeOptions,
                    },
                    {
                        field: 'custom_integration',
                        values: integrationOptions,
                    },
                    {
                        field: 'custom_user',
                        values: userOptions,
                    },
                    {
                        field: 'custom_role',
                        values: roleOptions,
                    },
                ],
            };
            // const optionValues = this.stApp.stLib.stLibNs.generateFormData();
            const optionValues = 'var optionValues = ' + JSON.stringify(optionValuesObj);
            // get the results
            let formFieldValues = [];
            if (this.stApp.context.request.method == 'GET') {
                // WERE SCRIPT PARAMS SET IN THE URL?
                const integrationId = this.stApp.context.request.parameters.integrationId;
                const userId = this.stApp.context.request.parameters.userId;
                const roleId = this.stApp.context.request.parameters.roleId;
                if (integrationId || userId || roleId) {
                    // set the initial values for when script params are set in the URL
                    if (integrationId) {
                        formFieldValues.push({ name: 'custom_integration', value: integrationId });
                    }
                    if (userId) {
                        formFieldValues.push({ name: 'custom_user', value: userId });
                    }
                    if (roleId) {
                        formFieldValues.push({ name: 'custom_role', value: roleId });
                    }
                }
                else {
                    // Set the default initial values for when no script params are set in the URL
                    formFieldValues.push({ name: 'custom_active', value: 'T' });
                }
            }
            else {
                // POST - get values from POSTed fields
                formFieldValues = this.getPostedFields(this.stApp.context.request.parameters);
            }
            const active = this.getPostedField('custom_active', formFieldValues);
            const integration = this.getPostedField('custom_integration', formFieldValues);
            const user = this.getPostedField('custom_user', formFieldValues);
            const role = this.getPostedField('custom_role', formFieldValues);
            const results = this.stApp.stModel.getTokens(active, integration, user, role);
            const resultsTemplate = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/results/tokens.html');
            const resultsValues = {};
            resultsValues['scriptUrl'] = this.stApp.scriptUrl;
            resultsValues['tableData'] = this.stApp.stView.generateTableData(results);
            const resultsContent = this.stApp.stView.buildContent(resultsTemplate, resultsValues);
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/tokens.html');
            const bodyValues = {};
            bodyValues['tokenModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/token.html');
            bodyValues['userModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/user.html');
            bodyValues['integrationModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/integration.html');
            bodyValues['scriptUrl'] = this.stApp.scriptUrl;
            bodyValues['optionValues'] = optionValues;
            bodyValues['formSelections'] = this.stApp.stView.generateFormSelections(formFieldValues);
            bodyValues['results'] = resultsContent;
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.Normal, body, bodyValues);
        }
        /**
         * Renders the Token form.
         *
         * @param renderType - the type of render
         * @param id - the internal ID of the record
         */
        renderTokenForm(renderType, id) {
            log.debug({
                title: 'SuiteToolsController:renderTokenForm() initiated',
                details: { renderType: renderType, id: id },
            });
            // get the record
            const record = this.stApp.stModel.getToken(id);
            // display the form
            let filename = 'views/token.html';
            if (renderType === idev_suitetools_view_1.RenderType.Modal) {
                filename = 'views/partials/modals/content/token.html';
            }
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents(filename);
            const bodyValues = {};
            if (record) {
                bodyValues['active'] = record.active == 'T';
                bodyValues['name'] = record.nameId;
                bodyValues['user'] = record.user;
                bodyValues['role'] = record.role;
                bodyValues['integration'] = record.integration;
                bodyValues['createdOn'] = record.createdOn;
                bodyValues['createdBy'] = record.createdBy;
                bodyValues['url'] = this.stApp.scriptUrl + '&action=token&id=' + record.id;
                bodyValues['urlNs'] = '/app/setup/accesstoken.nl?id=' + record.id;
                bodyValues['urlIntegration'] = this.stApp.scriptUrl + '&action=integration&id=' + record.integration;
            }
            this.stApp.stView.render(renderType, body, bodyValues);
        }
        /**
         * Renders the Roles form
         */
        renderRolesForm() {
            log.debug({ title: 'SuiteToolsController:renderRolesForm() initiated', details: null });
            // set form input option values dynamically
            // active
            const activeOptions = this.stApp.stView.getActiveOptions();
            // option values
            const optionValuesObj = {
                options: [
                    {
                        field: 'custom_active',
                        values: activeOptions,
                    },
                ],
            };
            // const optionValues = this.stApp.stLib.stLibNs.generateFormData();
            const optionValues = 'var optionValues = ' + JSON.stringify(optionValuesObj);
            // get the results
            let formFieldValues = [];
            if (this.stApp.context.request.method == 'GET') {
                // Set the default initial values for when no script params are set in the URL
                formFieldValues.push({ name: 'custom_active', value: 'T' });
            }
            else {
                // POST - get values from POSTed fields
                formFieldValues = this.getPostedFields(this.stApp.context.request.parameters);
            }
            const active = this.getPostedField('custom_active', formFieldValues);
            const results = this.stApp.stModel.getRoles(active);
            const resultsTemplate = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/results/roles.html');
            const resultsValues = {};
            resultsValues['scriptUrl'] = this.stApp.scriptUrl;
            resultsValues['tableData'] = this.stApp.stView.generateTableData(results);
            const resultsContent = this.stApp.stView.buildContent(resultsTemplate, resultsValues);
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/roles.html');
            const bodyValues = {};
            bodyValues['roleModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/role.html');
            bodyValues['integrationModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/integration.html');
            bodyValues['scriptUrl'] = this.stApp.scriptUrl;
            bodyValues['optionValues'] = optionValues;
            bodyValues['formSelections'] = this.stApp.stView.generateFormSelections(formFieldValues);
            bodyValues['results'] = resultsContent;
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.Normal, body, bodyValues);
        }
        /**
         * Renders the Role form
         *
         * @param renderType - the type of render
         * @param id - the internal ID of the record
         */
        renderRoleForm(renderType, id) {
            log.debug({
                title: 'SuiteToolsController:renderRoleForm()) initiated',
                details: { renderType: renderType, id: id },
            });
            // get the record
            const record = this.stApp.stModel.getRole(id);
            // display the form
            let filename = 'views/role.html';
            if (renderType == idev_suitetools_view_1.RenderType.Modal) {
                filename = 'views/partials/modals/content/role.html';
            }
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents(filename);
            const bodyValues = {};
            if (record) {
                bodyValues['id'] = record.id;
                bodyValues['isinactive'] = record.isinactive == 'T';
                bodyValues['name'] = record.name;
                bodyValues['centertype'] = record.centertype;
                bodyValues['issalesrole'] = record.issalesrole == 'T';
                bodyValues['issupportrole'] = record.issupportrole == 'T';
                bodyValues['iswebserviceonlyrole'] = record.iswebserviceonlyrole == 'T';
                bodyValues['url'] = this.stApp.scriptUrl + '&action=role&id=' + record.id;
                bodyValues['urlNs'] = '/app/setup/role.nl?id=' + record.id;
                bodyValues['urlUsers'] = this.stApp.scriptUrl + '&action=users&roleId=' + record.id;
            }
            this.stApp.stView.render(renderType, body, bodyValues);
        }
        /**
         * Renders the Users form.
         */
        renderUsersForm() {
            log.debug({ title: 'SuiteToolsController:renderUsersForm() initiated', details: '' });
            // set form input option values dynamically
            // roles
            const roleOptions = this.getOptionValues(this.stApp.stModel.getRoleList());
            // supervisors
            const supervisorOptions = this.getOptionValues(this.stApp.stModel.getEmployeeList());
            // option values
            const optionValuesObj = {
                options: [
                    {
                        field: 'custom_role',
                        values: roleOptions,
                    },
                    {
                        field: 'custom_supervisor',
                        values: supervisorOptions,
                    },
                ],
            };
            // const formData = this.stApp.stLib.stLibNs.generateFormData();
            const optionValues = 'var optionValues = ' + JSON.stringify(optionValuesObj);
            // get the results
            let formFieldValues = [];
            let results = null;
            if (this.stApp.context.request.method == 'GET') {
                // WERE SCRIPT PARAMS SET IN THE URL?
                const roleId = this.stApp.context.request.parameters.roleId;
                if (roleId) {
                    // set the initial values for when script params are set in the URL
                    formFieldValues.push({ name: 'custom_role', value: roleId });
                }
                else {
                    // Set the default initial values for when no script params are set in the URL
                    formFieldValues.push({ name: 'custom_active', value: 'U' });
                }
            }
            else {
                // POST - get values from POSTed fields
                formFieldValues = this.getPostedFields(this.stApp.context.request.parameters);
            }
            const active = this.getPostedField('custom_active', formFieldValues);
            const role = this.getPostedField('custom_role', formFieldValues);
            const supervisor = this.getPostedField('custom_supervisor', formFieldValues);
            let resultsTemplate = '';
            if (active == 'U') {
                results = this.stApp.stModel.getUsers(role, supervisor);
                resultsTemplate = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/results/users.html');
            }
            else {
                results = this.stApp.stModel.getEmployees(active, role, supervisor);
                resultsTemplate = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/results/employees.html');
            }
            const resultsValues = {};
            resultsValues['scriptUrl'] = this.stApp.scriptUrl;
            resultsValues['tableData'] = this.stApp.stView.generateTableData(results, true);
            const resultsContent = this.stApp.stView.buildContent(resultsTemplate, resultsValues);
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/users.html');
            const bodyValues = {};
            bodyValues['employeeModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/employee.html');
            bodyValues['roleModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/role.html');
            bodyValues['userModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/user.html');
            bodyValues['scriptUrl'] = this.stApp.scriptUrl;
            bodyValues['optionValues'] = optionValues;
            bodyValues['formSelections'] = this.stApp.stView.generateFormSelections(formFieldValues);
            bodyValues['results'] = resultsContent;
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.Normal, body, bodyValues);
        }
        /**
         * Renders the User form.
         *
         * @param renderType - the type of render
         * @param id - the internal ID of the record
         */
        renderUserForm(renderType, id) {
            log.debug({
                title: 'SuiteToolsController:renderUserForm() initiated',
                details: { renderType: renderType, id: id },
            });
            // get the record
            const record = this.stApp.stModel.getUser(id);
            log.debug({ title: 'SuiteToolsController:renderUserForm() record =', details: record });
            // display the form
            let filename = 'views/user.html';
            if (renderType === idev_suitetools_view_1.RenderType.Modal) {
                filename = 'views/partials/modals/content/user.html';
            }
            log.debug({ title: 'SuiteToolsController:renderUserForm() filename =', details: filename });
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents(filename);
            const bodyValues = {};
            bodyValues['id'] = record.id;
            bodyValues['entityid'] = record.entityid;
            bodyValues['firstname'] = record.firstname;
            bodyValues['lastname'] = record.lastname;
            bodyValues['email'] = record.email;
            bodyValues['supervisorname'] = record.supervisorname;
            bodyValues['supervisorurl'] = record.supervisorurl;
            bodyValues['title'] = record.title;
            bodyValues['urlNs'] = '/app/common/entity/employee.nl?id=' + record.id;
            bodyValues['url'] = this.stApp.scriptUrl + '&action=user&id=' + record.id;
            bodyValues['urlLogins'] = this.stApp.scriptUrl + '&action=userLogins&userId=' + record.id;
            // bodyValues['urlRoles'] = this.stApp.scriptUrl + '&action=users&roleId=' + ???; - not 1 to 1
            bodyValues['urlTokens'] = this.stApp.scriptUrl + '&action=tokens&userId=' + record.id;
            bodyValues['urlUserScriptLogs'] = this.stApp.scriptUrl + '&action=scriptLogs&userId=' + record.id;
            bodyValues['urlOwnerScriptLogs'] = this.stApp.scriptUrl + '&action=scriptLogs&ownerId=' + record.id;
            this.stApp.stView.render(renderType, body, bodyValues);
        }
        /**
         * Renders the User Logins form
         */
        renderUserLoginsForm() {
            log.debug({ title: 'SuiteToolsController:renderUserLoginsForm() initiated', details: null });
            // set form input option values dynamically
            // rows
            const rowOptions = this.stApp.stView.getRowOptions();
            // users
            const userOptions = this.getOptionValues(this.stApp.stModel.getEmployeeList(true));
            // dates
            const dateOptions = this.stApp.stView.getDateOptions();
            // option values
            const optionValuesObj = {
                options: [
                    {
                        field: 'custom_rows',
                        values: rowOptions,
                    },
                    {
                        field: 'custom_users',
                        values: userOptions,
                    },
                    {
                        field: 'custom_dates',
                        values: dateOptions,
                    },
                ],
            };
            // const optionValues = this.stApp.stLib.stLibNs.generateFormData();
            const optionValues = 'var optionValues = ' + JSON.stringify(optionValuesObj);
            // get the results
            let formFieldValues = [];
            if (this.stApp.context.request.method == 'GET') {
                // WERE SCRIPT PARAMS SET IN THE URL?
                const userId = this.stApp.context.request.parameters.userId;
                if (userId) {
                    // set the initial values for when script params are set in the URL
                    formFieldValues.push({ name: 'custom_users', value: [userId] });
                    formFieldValues.push({ name: 'custom_dates', value: 'today' });
                    // log.debug({
                    //   title: 'SuiteToolsController:renderUserLoginsForm() formFieldValues =',
                    //   details: formFieldValues,
                    // });
                }
                else {
                    // Set the default initial values for when no script params are set in the URL
                    formFieldValues.push({ name: 'custom_dates', value: '60' });
                }
            }
            else {
                // POST - get values from POSTed fields
                formFieldValues = this.getPostedFields(this.stApp.context.request.parameters);
            }
            const rows = this.getPostedField('custom_rows', formFieldValues);
            const status = this.getPostedField('custom_status', formFieldValues);
            const users = this.getPostedField('custom_users', formFieldValues);
            const dates = this.getPostedField('custom_dates', formFieldValues);
            // const title = this.getPostedField('custom_title', formFieldValues);
            // const detail = this.getPostedField('custom_detail', formFieldValues);
            const results = this.stApp.stModel.getUserLogins(rows, status, users, dates);
            const resultsTemplate = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/results/logins.html');
            const resultsValues = {};
            resultsValues['scriptUrl'] = this.stApp.scriptUrl;
            resultsValues['tableData'] = this.stApp.stView.generateTableData(results);
            const resultsContent = this.stApp.stView.buildContent(resultsTemplate, resultsValues);
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/logins.html');
            const bodyValues = {};
            bodyValues['userModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/user.html');
            bodyValues['scriptUrl'] = this.stApp.scriptUrl;
            bodyValues['optionValues'] = optionValues;
            bodyValues['formSelections'] = this.stApp.stView.generateFormSelections(formFieldValues);
            bodyValues['results'] = resultsContent;
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.Normal, body, bodyValues);
        }
        /**
         * Renders the Employee form.
         *
         * @param renderType - the type of render
         * @param id - the internal ID of the record
         */
        renderEmployeeForm(renderType, id) {
            log.debug({
                title: 'SuiteToolsController:renderEmployeeForm() initiated',
                details: { renderType: renderType, id: id },
            });
            // get the record
            const record = this.stApp.stModel.getEmployee(id);
            log.debug({ title: 'SuiteToolsController:renderEmployeeForm() record =', details: record });
            // display the form
            let filename = 'views/employee.html';
            if (renderType === idev_suitetools_view_1.RenderType.Modal) {
                filename = 'views/partials/modals/content/employee.html';
            }
            log.debug({ title: 'SuiteToolsController:renderEmployeeForm() filename =', details: filename });
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents(filename);
            const bodyValues = {};
            bodyValues['id'] = record.id;
            bodyValues['entityid'] = record.entityid;
            bodyValues['firstname'] = record.firstname;
            bodyValues['lastname'] = record.lastname;
            bodyValues['email'] = record.email;
            bodyValues['supervisorname'] = record.supervisorname;
            bodyValues['supervisorurl'] = record.supervisorurl;
            bodyValues['title'] = record.title;
            bodyValues['urlNs'] = '/app/common/entity/employee.nl?id=' + record.id;
            bodyValues['url'] = this.stApp.scriptUrl + '&action=employee&id=' + record.id;
            bodyValues['urlLogins'] = this.stApp.scriptUrl + '&action=userLogins&userId=' + record.id;
            // bodyValues['urlRoles'] = this.stApp.scriptUrl + '&action=employees&roleId=' + ???; - not 1 to 1
            this.stApp.stView.render(renderType, body, bodyValues);
        }
        /**
         * Renders the Script Log form
         */
        renderScriptLogsForm() {
            // log.debug({ title: 'SuiteToolsController:renderScriptLogsForm() initiated', details: null });
            // set form input option values dynamically
            // rows
            const rowOptions = this.stApp.stView.getRowOptions();
            // log levels
            const logLevelOptions = this.stApp.stView.getLogLevelOptions();
            // users
            const userOptions = this.getOptionValues(this.stApp.stModel.getEmployeeList(true));
            // types
            const typeOptions = this.getOptionValues(this.stApp.stModel.getScriptTypeList());
            // scripts
            const scriptOptions = this.getOptionValues(this.stApp.stModel.getScriptTypeList());
            // types
            // owners
            //   uses the same options as users
            // dates
            const dateOptions = this.stApp.stView.getDateOptions();
            // option values
            const optionValuesObj = {
                options: [
                    {
                        field: 'custom_rows',
                        values: rowOptions,
                    },
                    {
                        field: 'custom_levels',
                        values: logLevelOptions,
                    },
                    {
                        field: 'custom_users',
                        values: userOptions,
                    },
                    {
                        field: 'custom_types',
                        values: typeOptions,
                    },
                    {
                        field: 'custom_scripts',
                        values: scriptOptions,
                    },
                    {
                        field: 'custom_owners',
                        values: userOptions,
                    },
                    {
                        field: 'custom_dates',
                        values: dateOptions,
                    },
                ],
            };
            // const optionValues = this.stApp.stLib.stLibNs.generateFormData();
            const optionValues = 'var optionValues = ' + JSON.stringify(optionValuesObj);
            // get the results
            let formFieldValues = [];
            if (this.stApp.context.request.method == 'GET') {
                // WERE SCRIPT PARAMS SET IN THE URL?
                const userId = this.stApp.context.request.parameters.userId;
                const scriptId = this.stApp.context.request.parameters.scriptId;
                const ownerId = this.stApp.context.request.parameters.ownerId;
                if (userId || scriptId || ownerId) {
                    // set the initial values for when script params are set in the URL
                    formFieldValues.push({ name: 'custom_dates', value: 'today' });
                    // if user then set to filter to that user's name
                    const foundUser = userOptions.find((user) => user.value == userId);
                    if (foundUser) {
                        log.debug({
                            title: 'SuiteToolsController:renderScriptLogsForm() user filter',
                            details: foundUser.text,
                        });
                        formFieldValues.push({ name: 'custom_users', value: [foundUser.value] });
                    }
                    // if script then set to filter to that script
                    if (scriptId) {
                        log.debug({
                            title: 'SuiteToolsController:renderScriptLogsForm() script filter',
                            details: scriptId,
                        });
                        formFieldValues.push({ name: 'custom_scripts', value: [scriptId] });
                    }
                    // if owner then set to filter to that owner's name
                    const foundOwner = userOptions.find((user) => user.value == ownerId);
                    if (foundOwner) {
                        log.debug({
                            title: 'SuiteToolsController:renderScriptLogsForm() owner filter',
                            details: foundOwner.text,
                        });
                        formFieldValues.push({ name: 'custom_owners', value: [foundOwner.value] });
                    }
                    log.debug({
                        title: 'SuiteToolsController:renderScriptLogsForm() formFieldValues =',
                        details: formFieldValues,
                    });
                }
                else {
                    // Set the default initial values for when no script params are set in the URL
                    formFieldValues.push({ name: 'custom_levels', value: ['ERROR', 'EMERGENCY', 'SYSTEM'] });
                    formFieldValues.push({ name: 'custom_dates', value: '15' });
                }
            }
            else {
                // POST - get values from POSTed fields
                formFieldValues = this.getPostedFields(this.stApp.context.request.parameters);
            }
            const rows = this.getPostedField('custom_rows', formFieldValues);
            const levels = this.getPostedField('custom_levels', formFieldValues);
            const users = this.getPostedField('custom_users', formFieldValues);
            const types = this.getPostedField('custom_types', formFieldValues);
            const scripts = this.getPostedField('custom_scripts', formFieldValues);
            const owners = this.getPostedField('custom_owners', formFieldValues);
            let dates = this.getPostedField('custom_dates', formFieldValues);
            const title = this.getPostedField('custom_title', formFieldValues);
            const detail = this.getPostedField('custom_detail', formFieldValues);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let results;
            if (users) {
                // need to convert the user id to the user name
                // TODO: fix to handle multiple users
                const user = userOptions.find((user) => user.value == users);
                log.debug({ title: 'SuiteToolsController:renderScriptLogsForm() user = ', details: user });
                // use the search API since user(s) requested
                if (dates && Number(dates) > 0) {
                    // since less than a day force it to be today
                    this.stApp.setAlert('Setting "Date Options" to "Today" to retrieve user info with the Search API instead of the SuiteQL API.');
                    dates = 'today';
                    formFieldValues.find((field) => field.name == 'custom_dates').value = 'today';
                }
                results = this.stApp.stModel.getScriptLogsViaSearch(rows, levels, user.text, types, scripts, owners, dates, title, detail);
            }
            else {
                if (dates && Number(dates) > 0) {
                    // use SuiteQL API since no specific user requested and dates is less than a day
                    results = this.stApp.stModel.getScriptLogsViaSuiteQL(rows, levels, types, scripts, owners, dates, title, detail);
                }
                else {
                    // use the search API since dates is specified in days
                    results = this.stApp.stModel.getScriptLogsViaSearch(rows, levels, users, types, scripts, owners, dates, title, detail);
                }
            }
            // TODO - have this form also use the results template after fixing sporadic encoding issue
            // display the form
            const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/scriptLogs.html');
            const bodyValues = {};
            bodyValues['userModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/user.html');
            bodyValues['scriptModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/wrapper/script.html');
            bodyValues['scriptUrl'] = this.stApp.scriptUrl;
            bodyValues['optionValues'] = optionValues;
            bodyValues['formSelections'] = this.stApp.stView.generateFormSelections(formFieldValues);
            bodyValues['tableData'] = this.stApp.stView.generateTableData(results, true);
            this.stApp.stView.render(idev_suitetools_view_1.RenderType.Normal, body, bodyValues);
        }
        // ---------------------------------------------------------------------------
        // Supporting Functions
        // ---------------------------------------------------------------------------
        /**
         * Retrieve the option values
         *
         * @param sql - the sql to retrieve values
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        retrieveOptionValues(sql) {
            log.debug({ title: 'SuiteToolsController:retrieveOptionValues() initiated', details: { sql: sql } });
            const records = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
            const options = this.getOptionValues(records);
            return options;
        }
        /**
         * Get option values
         *
         * @param options - input values
         * @param valueIsNameId - if true then the value is the name
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        getOptionValues(values) {
            log.debug({ title: 'SuiteToolsController:getOptionValues() initiated', details: null });
            const optionsOut = [];
            optionsOut.push({ value: '', text: 'All' });
            values.forEach((option) => {
                optionsOut.push({
                    value: option.id,
                    text: option.name,
                });
            });
            log.debug({ title: 'SuiteToolsController:getOptionValues() returning', details: optionsOut });
            return optionsOut;
        }
        /**
         * Update integrations data
         *
         * @param value - the values to update
         *
         * @returns integrations data
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateIntegrationsData(value) {
            log.debug({ title: 'SuiteToolsController:updateIntegrationsData() initiated', details: '' });
            const updateSettings = [];
            // integrations details
            let integrationsDetails = [];
            let results = value.filter((result) => result.name == 'integrationsDetails');
            if (results.length > 0) {
                integrationsDetails = results[0].values;
            }
            else {
                log.error({ title: 'SuiteToolsController:updateIntegrationsData() integrationsDetails not found', details: '' });
            }
            // integrations
            let standardizedValues = [];
            results = value.filter((result) => result.name == 'integrations');
            if (results.length > 0) {
                // log.debug({ title: 'SuiteToolsController:updateIntegrationsData() integrations', details: results });
                for (const integration of results[0].values) {
                    // log.debug({ title: 'SuiteToolsController:updateIntegrationsData() integration', details: integration });
                    const id = integration['Internal ID'];
                    // add integration details to the integration
                    let details = integrationsDetails.filter((detail) => detail['name'] == id);
                    details = results.length > 0 ? details[0].values : [];
                    // tokenauthflag
                    const tokenauthflagFind = details.filter((detail) => detail['name'] == 'tokenauthflag');
                    const tokenauthflag = tokenauthflagFind.length > 0 ? tokenauthflagFind[0].values : [];
                    // authorizationcodegrant
                    const authorizationcodegrantFind = details.filter((detail) => detail['name'] == 'authorizationcodegrant');
                    const authorizationcodegrant = authorizationcodegrantFind.length > 0 ? authorizationcodegrantFind[0].values : [];
                    const rlcauthflagFind = details.filter((detail) => detail['name'] == 'rlcauthflag');
                    const rlcauthflag = rlcauthflagFind.length > 0 ? rlcauthflagFind[0].values : [];
                    // standardize the integration field names (e.g. camelCase and remove spaces)
                    standardizedValues.push({
                        id: id,
                        name: integration['Name'],
                        nameId: integration['Name'] + ' (' + integration['Internal ID'] + ')',
                        integrationId: integration['Application ID'],
                        active: integration['State'] == 'Enabled' ? 'T' : 'F',
                        createdOn: integration['Created On'],
                        tokenauthflag: tokenauthflag == 'Checked' ? 'T' : 'F',
                        authorizationcodegrant: authorizationcodegrant == 'Checked' ? 'T' : 'F',
                        rlcauthflag: rlcauthflag == 'Checked' ? 'T' : 'F',
                    });
                }
                if (standardizedValues.length > 0) {
                    // remove last record of standardizedValues since it contains the the header row
                    standardizedValues.pop();
                    // log.debug({
                    //   title: 'SuiteToolsController:updateIntegrationsData() integrations standardizedValues',
                    //   details: standardizedValues,
                    // });
                    // sort the array by name
                    standardizedValues.sort((a, b) => (a.name > b.name ? 1 : -1));
                    updateSettings.push({ custrecord_idev_st_config_integrations: JSON.stringify(standardizedValues) });
                }
            }
            // tokens
            const integrationList = standardizedValues;
            standardizedValues = [];
            const rolelist = this.stApp.stModel.getRoleList();
            const userList = this.stApp.stModel.getEmployeeList();
            results = value.filter((result) => result.name == 'tokens');
            if (results.length > 0) {
                // log.debug({ title: 'SuiteToolsController:updateIntegrationsData() tokens', details: results });
                // standardize the integration field names (e.g. camelCase and remove spaces)
                for (const token of results[0].values) {
                    // log.debug({ title: 'SuiteToolsController:updateIntegrationsData() token', details: token });
                    // add integrationId and integrationNameId
                    //   TODO: handle case where multiple integrations have the same name
                    const foundIntegration = integrationList.find((integration) => integration.name.trim() === token['Application']);
                    const integrationId = foundIntegration ? foundIntegration.id : null;
                    const integrationNameId = foundIntegration ? foundIntegration.nameId : null;
                    // add roleId
                    //   TODO: handle case where multiple roles have the same name
                    const foundRole = rolelist.find((role) => role.name.trim() === token['Role']);
                    const roleId = foundRole ? foundRole.id : null;
                    // add userId
                    //   TODO: handle case where multiple users have the same name
                    const foundUser = userList.find((user) => user.name.trim() === token['User']);
                    const userId = foundUser ? foundUser.id : null;
                    // add the standardized field and values including data cleansing to the array
                    standardizedValues.push({
                        id: token['Internal ID'],
                        active: token['Inactive'] == 'No' ? 'T' : 'F',
                        nameId: token['Token name'] + ' (' + token['Internal ID'] + ')',
                        integration: token['Application'],
                        integrationId: integrationId,
                        integrationNameId: integrationNameId,
                        role: token['Role'],
                        roleId: roleId,
                        user: token['User'],
                        userId: userId,
                        createdOn: token['Created'],
                        createdBy: token['Created By'],
                    });
                }
                if (standardizedValues.length > 0) {
                    // remove last record of standardizedValues since it contains the the header row
                    standardizedValues.pop();
                    // log.debug({
                    //   title: 'SuiteToolsController:updateIntegrationsData() tokens standardizedValues',
                    //   details: standardizedValues,
                    // });
                    // sort the array by name
                    standardizedValues.sort((a, b) => (a.name > b.name ? 1 : -1));
                    updateSettings.push({ custrecord_idev_st_config_tokens: JSON.stringify(standardizedValues) });
                }
            }
            // users
            // this is code to get the user list from NetSuite's Manage Users page (/app/setup/listusers.nl)
            // standardizedValues = [];
            // results = value.filter((result) => result.name == 'users');
            // if (results.length > 0) {
            //   // log.debug({ title: 'SuiteToolsController:updateIntegrationsData() users', details: results });
            //   const users = this.stApp.stModel.getUsers('T', null, null);
            //   log.debug({ title: 'SuiteToolsController:updateIntegrationsData() users', details: users });
            //   // standardize the integration field names (e.g. camelCase and remove spaces)
            //   for (const user of results[0].values) {
            //     log.debug({ title: 'SuiteToolsController:updateIntegrationsData() user', details: user });
            //     // add additional user info
            //     log.debug({ title: 'SuiteToolsController:updateIntegrationsData() user Email', details: user['Email'] });
            //     // get userRecord email
            //     const foundUser = users.find((record) => record['email'] == user['Email']);
            //     log.debug({ title: 'SuiteToolsController:updateIntegrationsData() foundUser', details: foundUser });
            //     const userId = foundUser ? foundUser.id : null;
            //     // add the standardized field and values including data cleansing to the array
            //     standardizedValues.push({
            //       id: userId,
            //       name: user['Name'],
            //       email: user['Email'],
            //       role: user['Role'],
            //     });
            //   }
            //   if (standardizedValues.length > 0) {
            //     // remove last record of standardizedValues since it contains the the header row
            //     standardizedValues.pop();
            //     // log.debug({
            //     //   title: 'SuiteToolsController:updateIntegrationsData() users standardizedValues',
            //     //   details: standardizedValues,
            //     // });
            //     // sort the array by name
            //     standardizedValues.sort((a, b) => (a.name > b.name ? 1 : -1));
            //     updateSettings.push({ custrecord_idev_st_config_users: JSON.stringify(standardizedValues) });
            //   }
            // }
            // find example to lookup user by email
            // const foundUser = users.find((record) => record['email'] == user['Email']);
            standardizedValues = [];
            const users = this.stApp.stModel.getEmployees('T', null, null);
            const usersRoles = this.stApp.stModel.getUsersRoles();
            // standardize the integration field names (e.g. camelCase and remove spaces)
            const lastLoginsSql = 'SELECT LoginAudit.User, MAX(LoginAudit.Date) AS lastLogin FROM LoginAudit GROUP BY LoginAudit.User';
            const lastLogins = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(lastLoginsSql);
            for (const user of users) {
                // log.debug({ title: 'SuiteToolsController:updateIntegrationsData() user', details: user });
                // add additional user info
                // last login
                const foundLogin = lastLogins.find((record) => record['user'] == user['id']);
                // log.debug({ title: 'SuiteToolsController:updateIntegrationsData() foundLogin', details: foundLogin });
                const lastlogin = foundLogin ? foundLogin.lastlogin : null;
                // roles
                const roleIds = [];
                const roles = [];
                const userRoles = usersRoles.filter((record) => record['id'] == user['id']);
                for (const userRole of userRoles) {
                    roleIds.push(userRole.roleid);
                    roles.push(userRole.rolename);
                }
                // add the standardized field and values including data cleansing to the array
                standardizedValues.push({
                    id: user.id,
                    name: user.name,
                    firstname: user.fistname,
                    lastname: user.lastname,
                    email: user.email,
                    supervisorid: user.supervisorid,
                    supervisor: user.supervisor == ' ()' ? '' : user.supervisor,
                    title: user.title ? user.title : '',
                    lastlogin: lastlogin ? lastlogin : '',
                    roleIds: JSON.stringify(roleIds),
                    roles: roles.join(', '),
                });
            }
            // sort the array by name
            standardizedValues.sort((a, b) => (a.name > b.name ? 1 : -1));
            updateSettings.push({ custrecord_idev_st_config_users: JSON.stringify(standardizedValues) });
            // log.debug({ title: 'SuiteToolsController:updateIntegrationsData() returning', details: updateSettings });
            return updateSettings;
        }
        /**
         * Update integration data
         *
         * @param value - the values to update
         *
         * @returns integration data
         */
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        updateIntegrationData(value) {
            log.debug({ title: 'SuiteToolsController:updateIntegrationData() initiated', details: '' });
            const results = value;
            log.debug({ title: 'SuiteToolsController:updateIntegrationData() results', details: results });
        }
    }
    exports.SuiteToolsController = SuiteToolsController;
});
