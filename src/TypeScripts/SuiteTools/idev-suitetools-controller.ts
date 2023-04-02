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

import error = require('N/error');
import log = require('N/log');

import { SuiteToolsApp } from './idev-suitetools-app';

/**
 * SuiteTools Controller
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsController {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsController:constructor() initiated', details: null });
    this._stApp = stApp;
  }

  /**
   * Handles the GET request event.
   */
  public getRequestHandler(): void {
    // log.debug({ title: 'SuiteToolsController:getRequestHandler() initiated', details: null });

    // render the desired page
    const { action, id } = this.stApp.context.request.parameters;
    log.debug('SuiteToolsController:getRequestHandle() routing request', { action: action, id: id });
    switch (action) {
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
      case 'file':
        this.renderFileModal(id);
        break;
      case 'scripts':
        this.renderScriptsForm();
        break;
      case 'script':
        this.renderScriptModal(id);
        break;
      case 'scriptFile':
        this.renderScriptFileForm(id);
        break;
      // reports
      case 'users':
        this.renderUsersForm();
        break;
      case 'userModal':
        this.renderUserModal(id);
        break;
      case 'user':
        this.renderUserForm(id);
        break;
      case 'scriptLogs':
        this.renderScriptLogsForm();
        break;
      // case 'iframeSample':
      //   this.stApp.stView.renderPage(
      //     this.stApp.scriptUrl,
      //     this.stApp.context,
      //     this.stApp.stView.createIframeElement('{{scriptUrl}}&action=iframeSampleFrame')
      //   );
      //   break;
      // case 'iframeSampleFrame':
      //   break;
      default:
        // if no action was specified then show the home page
        this.stApp.stView.render(this.getDashboardContent());
    }
  }

  /**
   * Handles the POST request event.
   */
  public postRequestHandler(): void {
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
        case 'data':
          this.processPostedData();
          break;
        case 'files':
          this.renderFilesForm();
          break;
        case 'scripts':
          this.renderScriptsForm();
          break;
        case 'scriptLogs':
          this.renderScriptLogsForm();
          break;
        default:
          throw error.create({
            name: 'SUITE_TOOLS_INVALID_FORM_ERROR',
            message: `An unsupported form ("${action}") was posted.`,
            notifyOff: true,
          });
      }
    } else {
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
  private getPostedFields(requestParameters: any): any[] {
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
    log.debug({
      title: 'SuiteToolsController:getPostedFields() identified simple custom fields',
      details: { customFields },
    });
    const postedFields = [];
    for (const field of customFields) {
      postedFields.push({ name: field, value: requestParameters[field] });
    }

    // get custom multiselects from #custom_multiselects which is workaround for NetSuite handling of multiselects
    if (requestParameters.custom_multiselects) {
      const multiselects = JSON.parse(requestParameters.custom_multiselects);
      log.debug({
        title: 'SuiteToolsController:getPostedFields() identified identified multiselects',
        details: multiselects,
      });
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
  private getPostedField(desiredField: string, postedFields: any): any {
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
      } else {
        // log.debug({ title: 'SuiteToolsController:getPostedField() message', details: 'field not found' });
      }
    } else {
      // log.debug({ title: 'SuiteToolsController:getPostedField() message', details: 'postedFields is empty' });
    }
    // log.debug({ title: `getPostedField() for "${desiredField}" returning`, details: result });

    return result;
  }

  // ---------------------------------------------------------------------------------------------
  // Data
  // ---------------------------------------------------------------------------------------------

  public processPostedData(): void {
    log.debug({ title: 'SuiteToolsController:processPostedData() initiated', details: '' });

    // get request body
    const requestBody = this.stApp.context.request.body;
    log.debug({ title: 'SuiteToolsController:processPostedData() requestBody', details: requestBody });
    const requestBodyObj = JSON.parse(requestBody);

    // TODO: expand out to handle other posted data

    // get the value of devmode from the request body
    const devMode = requestBodyObj.devmode;
    log.debug({ title: 'SuiteToolsController:processPostedData() devmode', details: requestBodyObj.devmode });

    const updatedSettings = {
      custrecord_idev_st_setting_dev_mode: devMode,
    };
    log.debug({ title: `SuiteToolsAppSettings:processPostedData() updatedSettings = `, details: updatedSettings });

    // save the value of devmode to the settings record
    const success = this.stApp.stLib.stLibNs.stLibNsRecord.updateCustomRecord(
      'customrecord_idev_suitetools_settings',
      this.stApp.stAppSettings.recordId,
      updatedSettings
    );
    log.debug({ title: `SuiteToolsAppSettings:processPostedData() saved successfully?`, details: success });

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
  public getDashboardContent(): string {
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
  public renderAppIssuesForm(issues: any[]): void {
    log.debug({ title: 'SuiteToolsController:renderAppIssuesForm() initiated', details: { issues: issues } });

    // display the form
    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/appIssues.html');
    const bodyValues = {};
    bodyValues['issues'] = issues;
    this.stApp.stView.renderPage(body, bodyValues);
  }

  /**
   * Renders the Application Error form.
   *
   * @param appError - issues with the application that prevent it from running properly
   */
  public renderAppErrorForm(e: error.SuiteScriptError, devMode: boolean): void {
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
    this.stApp.stView.renderPage(body, bodyValues);
  }

  /**
   * Renders the custom Settings form.
   */
  public renderSettingsForm(): void {
    log.debug({ title: 'SuiteToolsController:renderSettingsForm() initiated', details: '' });

    // display the form
    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/settings.html');
    const bodyValues = {};
    bodyValues['scriptUrl'] = this.stApp.scriptUrl;
    bodyValues['recordid'] = this.stApp.stAppSettings.recordId;
    bodyValues['cssurl'] = this.stApp.stAppSettings.cssUrl;
    bodyValues['jsurl'] = this.stApp.stAppSettings.jsUrl;
    bodyValues['devmode'] = this.stApp.stAppSettings.devMode;
    this.stApp.stView.render(body, bodyValues);
  }

  /**
   * Renders the custom System form.
   */
  public renderSystemForm(): void {
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

    this.stApp.stView.render(body, bodyValues);
  }

  /**
   * Renders the custom Files form.
   */
  public renderFilesForm(): void {
    log.debug({ title: 'SuiteToolsController:renderFilesForm() initiated', details: '' });

    this.stApp.setAlert('This feature is still under development.');

    // set form input option values dynamically
    const typesOptions = this.retrieveOptionValues(
      'SELECT MediaType.key as id, MediaType.name FROM MediaType ORDER BY name'
    );
    const optionValuesObj = {
      options: [
        {
          field: 'custom_types',
          values: typesOptions,
        },
      ],
    };
    // const formData = this.stApp.stLib.stLibNs.generateFormData();
    const optionValues = 'var optionValues = ' + JSON.stringify(optionValuesObj);

    // get the results
    let formFieldValues = {};
    if (this.stApp.context.request.method == 'GET') {
      // GET - default initial values
      formFieldValues = [{ name: 'custom_rows', value: '50' }];
    } else {
      // POST - get values from POSTed fields
      formFieldValues = this.getPostedFields(this.stApp.context.request.parameters);
    }
    const rows = this.getPostedField('custom_rows', formFieldValues);
    const types = this.getPostedField('custom_types', formFieldValues);
    const createdDateOptions = this.getPostedField('custom_created_date_options', formFieldValues);
    const modifiedDateOptions = this.getPostedField('custom_modified_date_options', formFieldValues);

    // get the results
    const sqlResults = this.stApp.stModel.getFiles(rows, types, createdDateOptions, modifiedDateOptions);

    // display the form
    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/files.html');
    const bodyValues = {};
    bodyValues['scriptUrl'] = this.stApp.scriptUrl;
    bodyValues['optionValues'] = optionValues;
    bodyValues['formSelections'] = this.stApp.stView.generateFormSelections(formFieldValues);
    bodyValues['fileModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/file.html');
    bodyValues['tableData'] = this.stApp.stView.generateTableData(sqlResults, true);
    this.stApp.stView.render(body, bodyValues);
  }

  /**
   * Renders the custom File modal.
   *
   * @param id - the internal ID of the file
   */
  public renderFileModal(id: string): void {
    log.debug({ title: 'SuiteToolsController:renderFileModal() initiated', details: { id: id } });

    // get the results
    const sqlResult = this.stApp.stModel.getFile(id);
    // log.debug({ title: 'SuiteToolsController:renderFileModal() sqlResult = ', details: sqlResult });

    // display the form
    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/file.html');
    const bodyValues = {};
    bodyValues['id'] = sqlResult.id;
    bodyValues['folder'] = sqlResult.folder;
    bodyValues['createddate'] = sqlResult.createddate;
    bodyValues['lastmodifieddate'] = sqlResult.lastmodifieddate;
    bodyValues['filetype'] = sqlResult.filetype;
    bodyValues['name'] = sqlResult.name;
    bodyValues['filesize'] = sqlResult.filesize;
    bodyValues['description'] = sqlResult.description;
    bodyValues['url'] = sqlResult.url;
    bodyValues['urlNs'] = '/app/common/media/mediaitem.nl?id=' + sqlResult.id;
    this.stApp.stView.renderPage(body, bodyValues);
  }

  /**
   * Renders the custom Scripts form.
   */
  public renderUsersForm(): void {
    log.debug({ title: 'SuiteToolsController:renderUsersForm() initiated', details: '' });

    // get the results
    const sqlResults = this.stApp.stModel.getUsers();

    // display the form
    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/users.html');
    const bodyValues = {};
    bodyValues['scriptUrl'] = this.stApp.scriptUrl;
    bodyValues['userModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/user.html');
    bodyValues['tableData'] = this.stApp.stView.generateTableData(sqlResults, true);
    this.stApp.stView.render(body, bodyValues);
  }

  /**
   * Renders the custom User modal.
   *
   * @param id - the internal ID of the user
   */
  public renderUserModal(id: string): void {
    log.debug({ title: 'SuiteToolsController:renderUserForm() initiated', details: { id: id } });

    // get the results
    const sqlResult = this.stApp.stModel.getUser(id);
    log.debug({ title: 'SuiteToolsController:renderUserForm() sqlResult =', details: sqlResult });

    // display the form
    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/user.html');
    const bodyValues = {};
    if (sqlResult) {
      bodyValues['id'] = sqlResult.id;
      bodyValues['isinactive'] = sqlResult.isinactive == 'T';
      bodyValues['entityid'] = sqlResult.entityid;
      bodyValues['firstname'] = sqlResult.firstname;
      bodyValues['lastname'] = sqlResult.lastname;
      bodyValues['email'] = sqlResult.email;
      bodyValues['supervisorname'] = sqlResult.supervisorname;
      bodyValues['supervisorurl'] = sqlResult.supervisorurl;
      bodyValues['title'] = sqlResult.title;
      bodyValues['url'] = this.stApp.scriptUrl + '&action=user&id=' + sqlResult.id;
      bodyValues['urlNs'] = '/app/common/entity/employee.nl?id=' + sqlResult.id;
      bodyValues['urlUserScriptLogs'] = this.stApp.scriptUrl + '&action=scriptLogs&userId=' + sqlResult.id;
      bodyValues['urlOwnerScriptLogs'] = this.stApp.scriptUrl + '&action=scriptLogs&ownerId=' + sqlResult.id;
    }
    this.stApp.stView.renderPage(body, bodyValues);
  }

  /**
   * Renders the custom User form.
   *
   * @param id - the internal ID of the user
   */
  public renderUserForm(id: string): void {
    log.debug({ title: 'SuiteToolsController:renderUserForm() initiated', details: { id: id } });

    // get the results
    const sqlResult = this.stApp.stModel.getUser(id);
    log.debug({ title: 'SuiteToolsController:renderUserForm() sqlResult =', details: sqlResult });

    // display the form
    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/user.html');
    const bodyValues = {};
    bodyValues['id'] = sqlResult.id;
    bodyValues['entityid'] = sqlResult.entityid;
    bodyValues['firstname'] = sqlResult.firstname;
    bodyValues['lastname'] = sqlResult.lastname;
    bodyValues['email'] = sqlResult.email;
    bodyValues['supervisorname'] = sqlResult.supervisorname;
    bodyValues['supervisorurl'] = sqlResult.supervisorurl;
    bodyValues['title'] = sqlResult.title;
    bodyValues['urlNs'] = '/app/common/entity/employee.nl?id=' + sqlResult.id;
    bodyValues['urlUserScriptLogs'] = this.stApp.scriptUrl + '&action=scriptLogs&userId=' + sqlResult.id;
    bodyValues['urlOwnerScriptLogs'] = this.stApp.scriptUrl + '&action=scriptLogs&ownerId=' + sqlResult.id;
    this.stApp.stView.render(body, bodyValues);
  }

  /**
   * Renders the custom Scripts form.
   */
  public renderScriptsForm(): void {
    log.debug({ title: 'SuiteToolsController:renderScriptsForm() initiated', details: null });

    // set form input option values dynamically
    const versionOptions = this.retrieveOptionValues(
      'SELECT scriptVersion.id, scriptVersion.name FROM scriptVersion ORDER BY name'
    );
    const typeOptions = this.retrieveOptionValues(
      'SELECT scriptType.id, scriptType.name FROM scriptType ORDER BY name'
    );
    const scriptOptions = this.retrieveOptionValues('SELECT id, name FROM script ORDER BY name');
    const ownerOptions = this.retrieveOptionValues(
      "SELECT employee.id, employee.firstname || ' ' || employee.lastname AS name FROM employee WHERE giveaccess = 'T' AND isinactive = 'F' ORDER BY name"
    );
    const fileOptions = this.retrieveOptionValues(
      'SELECT UNIQUE file.name, file.id FROM script INNER JOIN file ON script.scriptfile = file.id ORDER BY file.name'
    );
    const optionValuesObj = {
      options: [
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
    let formFieldValues = {};
    if (this.stApp.context.request.method == 'GET') {
      // GET - default initial values
      formFieldValues = [{ name: 'custom_active', value: 'yes' }];
    } else {
      // POST - get values from POSTed fields
      formFieldValues = this.getPostedFields(this.stApp.context.request.parameters);
    }
    const active = this.getPostedField('custom_active', formFieldValues);
    const versions = this.getPostedField('custom_versions', formFieldValues);
    const types = this.getPostedField('custom_types', formFieldValues);
    const scripts = this.getPostedField('custom_scripts', formFieldValues);
    const owners = this.getPostedField('custom_owners', formFieldValues);
    const files = this.getPostedField('custom_files', formFieldValues);

    // get the results
    const sqlResults = this.stApp.stModel.getScripts(active, versions, types, scripts, owners, files);

    // display the form
    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/scripts.html');
    const bodyValues = {};
    bodyValues['scriptUrl'] = this.stApp.scriptUrl;
    bodyValues['optionValues'] = optionValues;
    bodyValues['fileModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/file.html');
    bodyValues['scriptModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents(
      'views/partials/modals/script.html'
    );
    bodyValues['userModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/user.html');
    bodyValues['formSelections'] = this.stApp.stView.generateFormSelections(formFieldValues);
    bodyValues['tableData'] = this.stApp.stView.generateTableData(sqlResults, true);
    this.stApp.stView.render(body, bodyValues);
  }

  /**
   * Renders the custom Script modal.
   *
   * @param id - the internal ID of the script
   */
  public renderScriptModal(id: string): void {
    log.debug({ title: 'SuiteToolsController:renderScriptModal() initiated', details: { id: id } });

    // get the results
    const sqlResult = this.stApp.stModel.getScript(id);
    // log.debug({ title: 'SuiteToolsController:renderScriptModal() sqlResult =', details: sqlResult });

    // display the form
    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/script.html');
    const bodyValues = {};
    if (sqlResult) {
      bodyValues['id'] = sqlResult.id;
      bodyValues['apiversion'] = sqlResult.apiversion;
      bodyValues['isinactive'] = sqlResult.isinactive == 'T';
      bodyValues['scripttype'] = sqlResult.scripttype;
      bodyValues['name'] = sqlResult.name;
      bodyValues['scriptid'] = sqlResult.scriptid;
      bodyValues['owner'] = sqlResult.owner;
      bodyValues['scriptfile'] = sqlResult.scriptfile;
      bodyValues['notifyemails'] = sqlResult.notifyemails;
      bodyValues['description'] = sqlResult.description;
      bodyValues['urlNs'] = '/app/common/scripting/script.nl?id=' + sqlResult.id;
      bodyValues['urlScriptFile'] = this.stApp.scriptUrl + '&action=scriptFile&id=' + sqlResult.id;
      bodyValues['urlScriptLogs'] = this.stApp.scriptUrl + '&action=scriptLogs&scriptId=' + sqlResult.id;
    }
    this.stApp.stView.renderPage(body, bodyValues);
  }

  /**
   * Renders the custom Script File form.
   *
   * @param id - the internal ID of the script
   */
  public renderScriptFileForm(id: string): void {
    log.debug({ title: 'SuiteToolsController:renderScriptFileForm() initiated', details: { id: id } });

    // get the results
    const sqlResult = this.stApp.stModel.getScript(id);
    log.debug({ title: 'SuiteToolsController:renderScriptFileForm() sqlResult =', details: sqlResult });

    // display the form
    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/scriptFile.html');
    const bodyValues = {};
    if (sqlResult) {
      bodyValues['id'] = sqlResult.id;
      bodyValues['apiversion'] = sqlResult.apiversion;
      bodyValues['isinactive'] = sqlResult.isinactive;
      bodyValues['scripttype'] = sqlResult.scripttype;
      bodyValues['name'] = sqlResult.name;
      bodyValues['scriptid'] = sqlResult.scriptid;
      bodyValues['owner'] = sqlResult.owner;
      bodyValues['scriptfile'] = sqlResult.scriptfile;
      bodyValues['notifyemails'] = sqlResult.notifyemails;
      bodyValues['description'] = sqlResult.description;
      bodyValues['urlScriptLogs'] = this.stApp.scriptUrl + '&action=scriptLogs&scriptId=' + sqlResult.id;
      bodyValues['code'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents(sqlResult.scriptfile);
      sqlResult.scriptfile;
    }
    this.stApp.stView.render(body, bodyValues);
  }

  /**
   * Renders the custom Script Log form
   */
  public renderScriptLogsForm(): void {
    // log.debug({ title: 'SuiteToolsController:renderScriptLogsSearchForm() initiated', details: null });

    // set form input option values dynamically
    // const userListSql = "SELECT employee.id, employee.firstname || ' ' || employee.lastname AS name FROM employee WHERE giveaccess = 'T' AND isinactive = 'F' ORDER BY name";
    const userListSql =
      "SELECT employee.id, employee.firstname || ' ' || employee.lastname AS name FROM employee ORDER BY name";

    const userOptions = this.retrieveOptionValues(userListSql);
    const typeOptions = this.retrieveOptionValues(
      'SELECT scriptType.id, scriptType.name FROM scriptType ORDER BY name'
    );
    // const ownerOptions = this.retrieveOptionValues(
    //   "SELECT employee.id, employee.firstname || ' ' || employee.lastname AS name FROM employee WHERE giveaccess = 'T' AND isinactive = 'F' ORDER BY name"
    // );
    const scriptOptions = this.retrieveOptionValues('SELECT id, name FROM script ORDER BY name');
    const optionValuesObj = {
      options: [
        {
          field: 'custom_users',
          values: userOptions,
        },
        {
          field: 'custom_types',
          values: typeOptions,
        },
        {
          field: 'custom_owners',
          values: userOptions,
        },
        {
          field: 'custom_scripts',
          values: scriptOptions,
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
        formFieldValues = [
          // { name: 'custom_rows', value: '250' },
          { name: 'custom_date_options', value: 'today' },
        ];
        // if user then set to filter to that user's name
        const foundUser = userOptions.find((user) => user.value == userId);
        if (foundUser) {
          log.debug({
            title: 'SuiteToolsController:renderScriptLogsSearchForm() user filter',
            details: foundUser.text,
          });
          formFieldValues.push({ name: 'custom_users', value: [foundUser.value] });
        }
        // if script then set to filter to that script
        if (scriptId) {
          log.debug({
            title: 'SuiteToolsController:renderScriptLogsSearchForm() script filter',
            details: scriptId,
          });
          formFieldValues.push({ name: 'custom_scripts', value: [scriptId] });
        }
        // if owner then set to filter to that owner's name
        const foundOwner = userOptions.find((user) => user.value == ownerId);
        if (foundOwner) {
          log.debug({
            title: 'SuiteToolsController:renderScriptLogsSearchForm() owner filter',
            details: foundOwner.text,
          });
          formFieldValues.push({ name: 'custom_owners', value: [foundOwner.value] });
        }
        log.debug({
          title: 'SuiteToolsController:renderScriptLogsSearchForm() formFieldValues =',
          details: formFieldValues,
        });
      } else {
        // Set the default initial values for when no script params are set in the URL
        formFieldValues = [
          // { name: 'custom_rows', value: '250' },
          { name: 'custom_levels', value: ['ERROR', 'EMERGENCY', 'SYSTEM'] },
          { name: 'custom_date_options', value: '15' },
        ];
      }
    } else {
      // POST - get values from POSTed fields
      formFieldValues = this.getPostedFields(this.stApp.context.request.parameters);
    }
    const rows = this.getPostedField('custom_rows', formFieldValues);
    const levels = this.getPostedField('custom_levels', formFieldValues);
    const users = this.getPostedField('custom_users', formFieldValues);
    const types = this.getPostedField('custom_types', formFieldValues);
    const scripts = this.getPostedField('custom_scripts', formFieldValues);
    const owners = this.getPostedField('custom_owners', formFieldValues);
    let dateOptions = this.getPostedField('custom_date_options', formFieldValues);
    const title = this.getPostedField('custom_title', formFieldValues);
    const detail = this.getPostedField('custom_detail', formFieldValues);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let results: any[];

    if (users) {
      // need to convert the user id to the user name
      // TODO: fix to handle multiple users
      const user = userOptions.find((user) => user.value == users);
      log.debug({ title: 'SuiteToolsController:renderScriptLogsSearchForm() user = ', details: user });
      // use the search API since user(s) requested
      if (dateOptions && Number(dateOptions) > 0) {
        // since less than a day force it to be today
        this.stApp.setAlert(
          'Setting "Date Options" to "Today" to retrieve user info with the Search API instead of the SuiteQL API.'
        );
        dateOptions = 'today';
        formFieldValues.find((field) => field.name == 'custom_date_options').value = 'today';
      }
      results = this.stApp.stModel.getScriptLogsViaSearch(
        rows,
        levels,
        user.text,
        types,
        scripts,
        owners,
        dateOptions,
        title,
        detail
      );
    } else {
      if (dateOptions && Number(dateOptions) > 0) {
        // use SuiteQL API since no specific user requested and dateOptions is less than a day
        results = this.stApp.stModel.getScriptLogsViaSuiteQL(
          rows,
          levels,
          types,
          scripts,
          owners,
          dateOptions,
          title,
          detail
        );
      } else {
        // use the search API since dateOptions is specified in days
        results = this.stApp.stModel.getScriptLogsViaSearch(
          rows,
          levels,
          users,
          types,
          scripts,
          owners,
          dateOptions,
          title,
          detail
        );
      }
    }

    // display the form
    const body = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/script-logs.html');
    const bodyValues = {};
    bodyValues['scriptUrl'] = this.stApp.scriptUrl;
    bodyValues['optionValues'] = optionValues;
    bodyValues['formSelections'] = this.stApp.stView.generateFormSelections(formFieldValues);
    bodyValues['scriptModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents(
      'views/partials/modals/script.html'
    );
    bodyValues['userModal'] = this.stApp.stLib.stLibNs.stLibNsFile.getFileContents('views/partials/modals/user.html');
    bodyValues['tableData'] = this.stApp.stView.generateTableData(results, true);
    this.stApp.stView.render(body, bodyValues);
  }

  // ---------------------------------------------------------------------------
  // Supporting Functions
  // ---------------------------------------------------------------------------

  /**
   * Renders the custom Script form.
   *
   * @param sql - the sql to retrieve values
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private retrieveOptionValues(sql: string, valueIsName = false): any[] {
    // log.debug({ title: 'SuiteToolsController:retrieveOptionValues() initiated', details: { sql: sql } });

    const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    // log.debug({ title: 'SuiteToolsController:retrieveOptionValues() - sqlResults =', details: sqlResults });
    const options = [];
    if (valueIsName) {
      sqlResults.forEach((sqlResult) => {
        options.push({
          value: sqlResult.name,
          text: sqlResult.name,
        });
      });
    } else {
      sqlResults.forEach((sqlResult) => {
        options.push({
          value: sqlResult.id,
          text: sqlResult.name,
        });
      });
    }

    return options;
  }
}
