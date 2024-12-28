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

import { EntryPoints } from 'N/types';
import error = require('N/error');
import log = require('N/log');
import { SuiteToolsCommon } from './idev-suitetools-common';

/**
 * Handles the GET request event.
 *
 * @param requestParams The request parameters.
 * @returns The response.
 */
export function get(requestParams: EntryPoints.RESTlet.get): string {
  // log.debug({ title: 'get() initiated', details: requestParams });

  const stApi = new SuiteToolsApi();
  const response = JSON.stringify(stApi.stApiGet.process(requestParams));
  // log.debug({ title: 'get() returning', details: response });

  return response;
}

// TODO add POST method

/**
 * Handles the PUT request event.
 *
 * @param requestParams The request parameters.
 * @returns The response.
 */
export function put(requestBody: EntryPoints.RESTlet.put): string {
  // log.debug({ title: 'put() initiated', details: requestBody });

  const stApi = new SuiteToolsApi();
  const response = JSON.stringify(stApi.stApiPut.process(requestBody));
  // log.debug({ title: 'put() returning', details: response });

  return response;
}

/**
 * SuiteTools API
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsApi {
  private _stApiGet: SuiteToolsApiGet;
  private _stApiPut: SuiteToolsApiPut;
  private _stApiModel: SuiteToolsApiModel;
  private _stCommon: SuiteToolsCommon;

  get stApiGet(): SuiteToolsApiGet {
    return this._stApiGet;
  }
  get stApiPut(): SuiteToolsApiPut {
    return this._stApiPut;
  }
  get stApiModel(): SuiteToolsApiModel {
    return this._stApiModel;
  }
  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor() {
    log.debug({ title: 'SuiteToolsApi:constructor() initiated', details: null });
    this._stCommon = new SuiteToolsCommon();
    this._stApiModel = new SuiteToolsApiModel(this._stCommon);
    this._stApiGet = new SuiteToolsApiGet(this);
    this._stApiPut = new SuiteToolsApiPut(this);
  }
}

type RequestParams = { [key: string]: string };

type Response = {
  status?: number;
  data: object;
  message?: string;
};

export class SuiteToolsApiGet {
  private _stApi: SuiteToolsApi;
  private _stApiGetOptions: SuiteToolsApiGetOptions;

  get stApi(): SuiteToolsApi {
    return this._stApi;
  }
  get stApiGetOptions(): SuiteToolsApiGetOptions {
    return this._stApiGetOptions;
  }

  constructor(stApi: SuiteToolsApi) {
    // log.debug({ title: 'SuiteToolsApiGet:constructor() initiated', details: null });
    this._stApi = stApi;
    this._stApiGetOptions = new SuiteToolsApiGetOptions(stApi);
  }

  public process(requestParams: unknown): Response {
    log.debug({ title: 'SuiteToolsApiGet:process() initiated', details: requestParams });
    this.assertIsRequestParams(requestParams);

    let response: Response = { data: null };
    const endpoint = requestParams.endpoint;
    switch (endpoint) {
      case 'file':
        response = this.getFile(requestParams);
        break;
      case 'files':
        response = this.getFiles(requestParams);
        break;
      case 'optionValues':
        response = this.stApiGetOptions.process(requestParams);
        break;
      case 'role':
        response = this.getRole(requestParams);
        response.data = this.cleanRoleData(response.data);
        break;
      case 'roles':
        response = this.getRoles(requestParams);
        response = this.cleanRolesData(response);
        break;
      case 'script':
        response = this.getScript(requestParams);
        response.data = this.cleanScriptData(response.data);
        break;
      case 'scripts':
        response = this.getScripts(requestParams);
        response = this.cleanScriptsData(response);
        break;
      case 'scriptLog':
        response = this.getScriptLog(requestParams);
        break;
      case 'scriptLogs':
        response = this.getScriptLogs(requestParams);
        break;
      case 'settings':
        response = this.getSettings(requestParams);
        break;
      case 'user':
        response = this.getUser(requestParams);
        response.data = this.cleanUserData(response.data);
        break;
      case 'users':
        response = this.getUsers(requestParams);
        response = this.cleanUsersData(response);
        break;
      default:
        throw error.create({
          name: 'SUITE_TOOLS_INVALID_PARAMETER',
          message: `Invalid parameter: endpoint=${endpoint}`,
          notifyOff: true,
        });
    }
    log.debug({ title: 'SuiteToolsApiGet:process() returning', details: response });

    return response;
  }

  private assertIsRequestParams(data: unknown): asserts data is RequestParams {
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

  private convertMultiSelectToArray(field: string): string[] {
    return field ? (field.includes(',') ? field.split(',') : [field]) : null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cleanRoleData(data: any): object {
    // switch isinactive values to active values
    if (data.isinactive === 'F') {
      data.isinactive = 'Yes';
    } else {
      data.isinactive = 'No';
    }
    // clean other fields
    if (data.issalesrole === 'F') {
      data.issalesrole = 'No';
    } else {
      data.issalesrole = 'Yes';
    }
    if (data.issupportrole === 'F') {
      data.issupportrole = 'No';
    } else {
      data.issupportrole = 'Yes';
    }
    if (data.iswebserviceonlyrole === 'F') {
      data.iswebserviceonlyrole = 'No';
    } else {
      data.iswebserviceonlyrole = 'Yes';
    }
    return data;
  }

  private cleanRolesData(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      response.data.forEach((record) => {
        this.cleanRoleData(record);
      });
    }

    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cleanScriptData(data: any): object {
    log.debug({ title: 'SuiteToolsApiGet:cleanScriptData() initiated', details: data });
    // switch isinactive values to active values
    if (data.isinactive === 'F') {
      data.isinactive = 'Yes';
    } else {
      data.isinactive = 'No';
    }

    return data;
  }

  private cleanScriptsData(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      response.data.forEach((record) => {
        this.cleanScriptData(record);
      });
    }

    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cleanUserData(data: any): object {
    // switch isinactive values to active values
    if (data.isinactive === 'F') {
      data.isinactive = 'Yes';
    } else {
      data.isinactive = 'No';
    }
    // clear role field if empty
    if (data.role === ' ()') {
      data.role = '';
    }
    // clear supervisor field if empty
    if (data.supervisor === ' ()') {
      data.supervisor = '';
    }
    // set title field to "" if empty
    if (data.title === null) {
      data.title = '';
    }

    return data;
  }

  private cleanUsersData(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      response.data.forEach((record) => {
        this.cleanUserData(record);
      });
    }

    return response;
  }

  /**
   * Get File
   *
   * @param requestParams
   * @returns settings
   */
  private getFile(requestParams: RequestParams): Response {
    log.debug({ title: 'SuiteToolsApiGet:getFile() initiated', details: requestParams });

    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }

    const result = this.stApi.stApiModel.getFile(id);
    // log.debug({ title: 'SuiteToolsApiGet:getFile() returning', details: result });

    return result;
  }

  /**
   * Get Files
   *
   * @param requestParams
   * @returns settings
   */
  private getFiles(requestParams: RequestParams): Response {
    log.debug({ title: 'SuiteToolsApiGet:getFiles() initiated', details: requestParams });

    const row = requestParams['rows'];
    const types = this.convertMultiSelectToArray(requestParams['filetype']);
    const createdDate = requestParams['createddate'];
    const modifiedDate = requestParams['lastmodifieddate'];
    const result = this.stApi.stApiModel.getFiles(row, types, createdDate, modifiedDate);
    // log.debug({ title: 'SuiteToolsApiGet:getFiles() returning', details: result });

    return result;
  }

  /**
   * Get Role
   *
   * @param requestParams
   * @returns settings
   */
  private getRole(requestParams: RequestParams): Response {
    log.debug({ title: 'SuiteToolsApi:getRole() initiated', details: requestParams });

    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }

    const result: Response = this.stApi.stApiModel.getRole(id);

    return result;
  }

  /**
   * Get Roles
   *
   * @param requestParams
   * @returns settings
   */
  private getRoles(requestParams: RequestParams): Response {
    log.debug({ title: 'SuiteToolsApiGet:getRoles() initiated', details: requestParams });

    const active = requestParams['active'];
    const result = this.stApi.stApiModel.getRoles(active);

    return result;
  }

  /**
   * Get Script
   *
   * @param requestParams
   * @returns settings
   */
  private getScript(requestParams: RequestParams): Response {
    log.debug({ title: 'SuiteToolsApi:getScript() initiated', details: requestParams });

    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }

    const result = this.stApi.stApiModel.getScript(id);
    // log.debug({ title: 'SuiteToolsApi:getScript() returning', details: result });

    return result;
  }

  /**
   * Get Scripts
   *
   * @param requestParams
   * @returns settings
   */
  private getScripts(requestParams: RequestParams): Response {
    log.debug({ title: 'SuiteToolsApiGet:getScripts() initiated', details: requestParams });

    const active = requestParams['active'];
    const versions = this.convertMultiSelectToArray(requestParams['version']);
    const scripttypes = this.convertMultiSelectToArray(requestParams['scripttype']);
    const scripts = this.convertMultiSelectToArray(requestParams['scriptrecord']);
    const owners = this.convertMultiSelectToArray(requestParams['owner']);
    const files = this.convertMultiSelectToArray(requestParams['file']);
    const result = this.stApi.stApiModel.getScripts(active, versions, scripttypes, scripts, owners, files);

    return result;
  }

  /**
   * Get Server Script Log
   *
   * @param requestParams
   * @returns settings
   */
  private getScriptLog(requestParams: RequestParams): Response {
    log.debug({ title: 'SuiteToolsApiGet:getScriptLog() initiated', details: requestParams });

    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }

    const result = this.stApi.stApiModel.getScriptLog(id);

    return result;
  }

  /**
   * Get Server Script Logs
   *
   * @param requestParams
   * @returns settings
   */
  private getScriptLogs(requestParams: RequestParams): Response {
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
    const result = this.stApi.stApiModel.getScriptLogsViaSuiteQL(
      row,
      levels,
      types,
      scripts,
      owners,
      date,
      title,
      detail,
    );

    return result;
  }

  /**
   * Get Settings.
   *
   * @param requestParams
   * @returns settings
   */
  private getSettings(requestParams: RequestParams): Response {
    log.debug({ title: 'SuiteToolsApiGet:getSettings() initiated', details: requestParams });

    this.stApi.stCommon.stSettings.getSettings();
    const result = {
      devMode: this.stApi.stCommon.stSettings.devMode,
      appUrl: this.stApi.stCommon.appUrl,
      // system
      accountId: this.stApi.stCommon.runtime.accountId,
      envType: this.stApi.stCommon.runtime.envType,
      isProduction: this.stApi.stCommon.isProduction,
      version: this.stApi.stCommon.runtime.version,
      processorCount: this.stApi.stCommon.runtime.processorCount,
      queueCount: this.stApi.stCommon.runtime.queueCount,
      appBundle: this.stApi.stCommon.stSettings.appBundle,
      // user
      userId: this.stApi.stCommon.runtime.getCurrentUser().id,
      userName: this.stApi.stCommon.runtime.getCurrentUser().name,
      userEmail: this.stApi.stCommon.runtime.getCurrentUser().email,
      userLocation: this.stApi.stCommon.runtime.getCurrentUser().location,
      userDepartment: this.stApi.stCommon.runtime.getCurrentUser().department,
      userRole: this.stApi.stCommon.runtime.getCurrentUser().roleId, // flipped to have the roleId integer and
      userRoleId: this.stApi.stCommon.runtime.getCurrentUser().role, // the role string like accountId, userId
      userSubsidiary: this.stApi.stCommon.runtime.getCurrentUser().subsidiary,
      isAdmin: this.stApi.stCommon.isAdmin,
    };
    log.debug({ title: 'SuiteToolsApiGet:getSettings() returning', details: result });

    return { data: result };
  }

  /**
   * Get User
   *
   * @param requestParams
   * @returns settings
   */
  private getUser(requestParams: RequestParams): Response {
    log.debug({ title: 'SuiteToolsApi:getUser() initiated', details: requestParams });

    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }

    const result = this.stApi.stApiModel.getUser(id);

    return result;
  }

  /**
   * Get Users
   *
   * @param requestParams
   * @returns settings
   */
  private getUsers(requestParams: RequestParams): Response {
    log.debug({ title: 'SuiteToolsApiGet:getUsers() initiated', details: requestParams });
    const active = requestParams['active'];
    const role = requestParams['role'];
    const supervisors = this.convertMultiSelectToArray(requestParams['owner']);
    const result = this.stApi.stApiModel.getUsers(active, role, supervisors);

    return result;
  }
}

interface OptionValuesResponse {
  id: number;
  name: string;
}

interface OptionValues {
  value: string;
  text: string;
}

export class SuiteToolsApiGetOptions {
  private _stApi: SuiteToolsApi;

  get stApi(): SuiteToolsApi {
    return this._stApi;
  }

  constructor(stApi: SuiteToolsApi) {
    log.debug({ title: 'SuiteToolsApiGetOptions:constructor() initiated', details: null });
    this._stApi = stApi;
  }

  public process(requestParams: RequestParams): Response {
    // log.debug({ title: 'SuiteToolsApiGetOptions:process() initiated', details: requestParams });

    let data: unknown;
    let result = {};
    const type = requestParams.type;
    switch (type) {
      case 'file':
        data = this.getFileList(true);
        break;
      case 'filetype':
        data = this.getFileTypeList();
        break;
      case 'owner':
        data = this.getEmployeeList(true);
        break;
      case 'role':
        data = this.getRoleList(true);
        break;
      case 'script':
        data = this.getScriptList();
        break;
      case 'scripttype':
        data = this.getScriptTypeList();
        break;
      case 'user':
        data = this.getEmployeeList(true);
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
    } else {
      result = optionValues;
    }

    return { data: result };
  }

  private assertIsOptionValuesResponse(data: unknown): asserts data is OptionValuesResponse[] {
    // log.debug({ title: 'SuiteToolsApiGetOptions:assertIsOptionValuesResponse() initiated', details: data });

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

  private convertOptionValuesResponse(values: OptionValuesResponse[]): OptionValues[] {
    const options: OptionValues[] = [];
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

  // ------------------------------
  // GET OPTION LISTS
  // ------------------------------

  /**
   * Get employee list
   *
   * @param [activeOnly]
   * @returns employees
   */
  private getEmployeeList(activeOnly?: boolean) {
    let sql = `SELECT
      employee.id,
      TRIM(employee.firstname || ' ' || employee.lastname) AS name
    FROM
      employee`;
    if (activeOnly) {
      sql += ` WHERE
        giveaccess = 'T'
        AND isinactive = 'F'`;
    }
    sql += ` ORDER BY name ASC`;
    return this.stApi.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
  }

  private getFileList(activeOnly?: boolean) {
    let sql = `SELECT
      File.id,
      File.name
    FROM
	    File
    INNER JOIN Script ON
		  ( Script.ScriptFile = File.ID )
    WHERE
      ( File.filetype = 'JAVASCRIPT' )`;
    if (activeOnly) {
      sql += ` AND ( Script.isinactive = 'F' )`;
    }
    sql += ` ORDER BY file.name ASC`;
    return this.stApi.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
  }

  private getFileTypeList() {
    const sql = `SELECT
      DISTINCT filetype as id,
      filetype as name
    FROM file
    ORDER BY filetype`;
    return this.stApi.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
  }

  private getRoleList(activeOnly = false) {
    let sql = `SELECT
      role.id,
      role.name
    FROM
      role`;
    if (activeOnly) {
      sql += ` WHERE isInactive = 'F'`;
    }
    sql += ` ORDER BY role.name`;
    return this.stApi.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
  }

  private getScriptList(activeOnly?: boolean) {
    let sql = `SELECT
      script.id,
      script.name
    FROM
      script`;
    if (activeOnly) {
      sql += ` WHERE isinactive = 'F'`;
    }
    sql += ` ORDER BY name ASC`;
    return this.stApi.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
  }

  private getScriptTypeList() {
    const sql = 'SELECT scriptType.id, scriptType.name FROM scriptType ORDER BY name';
    return this.stApi.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
  }
}

type RequestBodyData = { [key: string]: string };
type RequestBody = {
  endpoint: string;
  data: RequestBodyData;
};

export class SuiteToolsApiPut {
  private _stApi: SuiteToolsApi;

  get stApi(): SuiteToolsApi {
    return this._stApi;
  }

  constructor(stApi: SuiteToolsApi) {
    log.debug({ title: 'SuiteToolsApiPut:constructor() initiated', details: null });
    this._stApi = stApi;
  }

  public process(requestBody: unknown): Response {
    log.debug({ title: 'SuiteToolsApiPut:process() initiated', details: requestBody });
    this.assertIsRequestBody(requestBody);

    let response: Response;
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
    // log.debug({ title: 'SuiteToolsApiPut:process() returning', details: response });

    return response;
  }

  public assertIsRequestBody(data: unknown): asserts data is RequestBody {
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

  public assertIsRequestBodyData(data: unknown): asserts data is RequestBodyData {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Request body data is not an object');
    }
  }

  public putSettings(requestBodyData: object): Response {
    this.assertIsRequestBodyData(requestBodyData);

    const devMode = requestBodyData.devMode;
    const updateSettings = { custrecord_idev_st_setting_dev_mode: devMode };
    this.stApi.stCommon.stSettings.getSettings();
    const success = this.stApi.stCommon.stLib.stLibNs.stLibNsRecord.updateCustomRecord(
      this.stApi.stCommon.appSettingsRecord,
      this.stApi.stCommon.stSettings.recordId,
      updateSettings,
    );
    log.debug({ title: `SuiteToolsApiPut:putSettings() saved successfully?`, details: success });

    return {
      status: 200,
      data: {},
      message: 'Settings updated',
    };
  }
}

/**
 * SuiteTools Model
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsApiModel {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    // log.debug({ title: 'SuiteToolsApiModel:constructor() initiated', details: null });
    this._stCommon = stCommon;
  }

  /**
   * Get Jobs
   *
   * @param active - the active flag
   * @returns roles
   */
  // public getJobs(
  //   active: string
  // ) {
  //   log.debug({
  //     title: `SuiteToolsApiModel:getJobs() initiated`,
  //     details: {
  //       active: active,
  //     },
  //   });

  //   let sql = `SELECT
  //     id,
  //     custrecord_st_job_task_id as task_id,
  //   FROM
  //     customrecord_idev_suitetools_job`;

  //   // isinactive,
  //   // name || ' (' || id  || ')' AS name,
  //   // custrecord_st_job_run_type AS type,
  //   // custrecord_st_job_run_params AS params,

  //   // add where clause
  //   const where = [];
  //   // if (active) {
  //   //   if (active === 'T') {
  //   //     where.push(`isinactive = 'F'`);
  //   //   }
  //   //   if (active === 'F') {
  //   //     where.push(`isinactive = 'T'`);
  //   //   }
  //   // }
  //   if (where.length > 0) {
  //     sql += ` WHERE ${where.join(' AND ')}`;
  //   }
  //   // add order by
  //   // sql += ` ORDER BY name`;
  //   const results = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
  //   log.debug({ title: 'SuiteToolsApiModel:getJobs() returning', details: results });

  //   return results;
  // }

  /**
   * Get Job
   *
   * @param id - the record to return
   * @returns results
   */
  // public getJob(id: number) {
  //   log.debug({ title: `SuiteToolsApiModel:getJob() initiated`, details: { id: id } });

  //   const sql = `SELECT
  //     id,
  //   FROM
  //     customrecord_idev_suitetools_job
  //   WHERE
  //     id = ${id}`;
  //   const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
  //   let result = null;
  //   if (sqlResults.length === 0) {
  //     // this.stCommon.setAlert('No results found that matched criteria.');
  //   } else {
  //     result = sqlResults[0];
  //   }
  //   log.debug({ title: 'SuiteToolsApiModel:getJob() returning', details: result });

  //   return result;
  // }

  /*
   * Initiate Job
   *
   * @returns jobId
   */
  // public initiateJob(): number {
  //   log.debug({ title: `SuiteToolsApiModel:initiateJob() initiated`, details: null });

  //   // initiate the last logins map/reduce script
  //   const scriptTask = task.create({
  //     taskType: task.TaskType.MAP_REDUCE,
  //     scriptId: 'customscript_idev_st_mr_jobs_run',
  //     deploymentId: 'customdeploy_idev_st_mr_jobs_run',
  //     // params: {
  //     //   custscript_idev_st_mr_jobs_type: 'customer',
  //     //   custscript_idev_st_mr_jobs_action: 'activate',
  //     // },
  //   });
  //   const scriptTaskId = scriptTask.submit();
  //   log.debug({
  //     title: 'SuiteToolsController:runJob() submitted run job map/reduce script',
  //     details: 'scriptTaskId = ' + scriptTaskId,
  //   });

  //   const jobId = this.stCommon.stLib.stLibNs.stLibNsRecord.createCustomRecord('customrecord_idev_suitetools_job', {
  //     custrecord_st_job_task_id: scriptTaskId,
  //   });
  //   log.debug({ title: 'SuiteToolsController:renderJobRunForm() created job record', details: jobId });

  //   return jobId;
  // }

  // Get Folders SQL
  // let sql = `SELECT
  // 	MediaItemFolder.id,
  // 	BUILTIN.DF(MediaItemFolder.owner) AS owner,
  // 	MediaItemFolder.foldertype,
  // 	MediaItemFolder.appfolder,
  // 	MediaItemFolder.name,
  // 	MediaItemFolder.description,
  // 	MediaItemFolder.lastModifiedDate,
  // 	MediaItemFolder.numFolderFiles,
  // 	MediaItemFolder.folderSize,
  // 	MediaItemFolder.parent
  // FROM
  // 	MediaItemFolder
  // WHERE
  // 	isTopLevel = 'T'
  // ORDER BY
  // 	name`;

  /**
   * Get Files
   *
   * @param row - the number of rows to return
   * @param types - the file types
   * @param createdDate - the created date
   * @param modifiedDate - the last modified date
   * @returns results
   */
  public getFiles(row: string, types: string | string[], createdDate: string, modifiedDate: string): Response {
    log.debug({
      title: `SuiteToolsApiModel:getFiles() initiated`,
      details: {
        rows: row,
        types: types,
        createdDate: createdDate,
        modifiedDate: modifiedDate,
      },
    });

    const response: Response = { data: {} };
    let sql = `SELECT
      file.id,
      file.folder,
      file.createddate,
      file.lastmodifieddate,
      file.filetype,
      BUILTIN.DF(file.filetype) AS filetypename,
      file.name || ' (' || file.id  || ')' AS name,
      file.filesize,
      file.description,
      file.url
    FROM
      file`;
    // add where clause
    const where = [];
    if (row) {
      where.push(`RowNum <= ${row}`);
    }
    if (types) {
      if (Array.isArray(types)) {
        types = types.map((type) => {
          return `'${type.toUpperCase()}'`;
        });
        where.push(`filetype IN (${types.join(',')})`);
      }
    }
    this.addDateFilter(where, 'SuiteToolsApiModel:getFiles()', 'File', 'createddate', createdDate);
    this.addDateFilter(where, 'SuiteToolsApiModel:getFiles()', 'File', 'lastmodifieddate', modifiedDate);
    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    sql += ` ORDER BY name ASC`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No script records found`;
    } else {
      response.data = sqlResults;
    }
    log.debug({ title: 'SuiteToolsApiModel:getScripts() returning', details: response });

    return response;
  }

  /**
   * Get File
   *
   * @param id - the record to return
   * @returns results
   */
  public getFile(id: string): Response {
    log.debug({ title: `SuiteToolsApiModel:getFile() initiated`, details: { id: id } });

    const response: Response = { data: {} };
    const sql = `SELECT
      file.id,
      file.folder,
      file.createddate,
      file.lastmodifieddate,
      file.filetype,
      BUILTIN.DF(file.filetype) AS filetypename,
      file.name || ' (' || file.id  || ')' AS name,
      file.filesize,
      file.description,
      file.url
    FROM
      file
    WHERE
      file.id = ${id}`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No file found with id of ${id}`;
    } else {
      response.data = sqlResults[0];
    }
    log.debug({ title: 'SuiteToolsApiModel:getFile() returning', details: response });

    return response;
  }

  /**
   * Get Roles
   *
   * @param status - the status of the login
   * @returns roles
   */
  public getRoles(active: string): Response {
    log.debug({
      title: `SuiteToolsApiModel:getRoles() initiated`,
      details: {
        active: active,
      },
    });

    const response: Response = { data: {} };
    let sql = `SELECT
      role.id,
      role.scriptId,
      role.name,
      role.centerType,
      role.isInactive,
      role.isSalesRole,
      role.isSupportRole,
      role.isWebServiceOnlyRole
    FROM
      role`;
    // add where clause
    const where = [];
    if (active) {
      if (active === 'T') {
        where.push(`role.isinactive = 'F'`);
      }
      if (active === 'F') {
        where.push(`role.isinactive = 'T'`);
      }
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    // add order by
    sql += ` ORDER BY role.name`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No script records found`;
    } else {
      response.data = sqlResults;
    }
    log.debug({ title: 'SuiteToolsApiModel:getRoles() returning', details: response });

    return response;
  }

  /**
   * Get Role
   *
   * @param id - the id of the record
   * @returns Role
   */
  public getRole(id: string): Response {
    log.debug({ title: `SuiteToolsApiModel:getRole() initiated`, details: { id: id } });

    const response: Response = { data: {} };
    const sql = `SELECT
      role.id,
      role.scriptId,
      role.name,
      role.name || ' (' || role.id  || ')' AS nameId,
      role.centerType,
      role.isInactive,
      role.isSalesRole,
      role.isSupportRole,
      role.isWebServiceOnlyRole
    FROM
      role
    WHERE
      role.id = ${id}`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No role found with id of ${id}`;
    } else {
      response.data = sqlResults[0];
    }
    log.debug({ title: 'SuiteToolsApiModel:getRole() returning', details: response });

    return response;
  }

  /**
   * Get Scripts
   *
   * @param active - the active flag
   * @param versions - the API versions
   * @param types - the script types
   * @param scripts - the scripts
   * @param owners - the script owners
   * @param files - the script files
   * @returns results
   */
  public getScripts(
    active: string,
    versions: string[],
    types: string[],
    scripts: string[],
    owners: string[],
    files: string[],
  ): Response {
    log.debug({
      title: `SuiteToolsApiModel:getScripts() initiated`,
      details: { active: active, versions: versions, types: types, scripts: scripts, owners: owners, files: files },
    });

    const response: Response = { data: {} };
    let sql = `SELECT
      script.id,
      script.apiversion,
      script.isinactive,
      script.scripttype,
      script.name || ' (' || script.id  || ')' AS name,
      script.scriptid,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      file.name || ' (' || file.id  || ')' AS scriptfile,
      script.notifyemails,
      script.description
    FROM
      script
    INNER JOIN file
      ON script.scriptfile = file.id`;
    // add where clause
    const where = [];
    if (active) {
      if (active === 'T') {
        where.push(`script.isinactive = 'F'`);
      }
      if (active === 'F') {
        where.push(`script.isinactive = 'T'`);
      }
    }
    if (versions) {
      if (Array.isArray(versions)) {
        where.push(`apiversion IN (${versions.join(',')})`);
      }
    }
    if (types) {
      if (Array.isArray(types)) {
        types = types.map((type) => {
          return `'${type.toUpperCase()}'`;
        });
        where.push(`scripttype IN (${types.join(',')})`);
      }
    }
    if (scripts) {
      if (Array.isArray(scripts)) {
        scripts = scripts.map((script) => {
          return `'${script.toUpperCase()}'`;
        });
        where.push(`script.id IN (${scripts.join(',')})`);
      }
    }
    if (owners) {
      if (Array.isArray(owners)) {
        owners = owners.map((owner) => {
          return `'${owner.toUpperCase()}'`;
        });
        where.push(`owner IN (${owners.join(',')})`);
      }
    }
    if (files) {
      if (Array.isArray(files)) {
        files = files.map((file) => {
          return `'${file.toUpperCase()}'`;
        });
        where.push(`file.id IN (${files.join(',')})`);
      }
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    // add order by
    sql += ` ORDER BY name ASC`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No script records found`;
    } else {
      response.data = sqlResults;
    }
    log.debug({ title: 'SuiteToolsApiModel:getScripts() returning', details: response });

    return response;
  }

  /**
   * Get Script
   *
   * @param id - the record to return
   * @returns results
   */
  public getScript(id: string): Response {
    log.debug({ title: `SuiteToolsApiModel:getScript() initiated`, details: { id: id } });

    const response: Response = { data: {} };
    const sql = `SELECT
      script.id,
      script.apiversion,
      script.isinactive,
      script.scripttype,
      script.name,
      script.scriptid,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      file.name || ' (' || file.id  || ')' AS scriptfile,
      script.notifyemails,
      script.description
    FROM
      script
    INNER JOIN file
      ON script.scriptfile = file.id
    WHERE
      script.id = ${id}`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No script found with id of ${id}`;
    } else {
      response.data = sqlResults[0];
    }
    log.debug({ title: 'SuiteToolsApiModel:getScript() returning', details: response });

    return response;
  }

  /**
   * Get User Logins
   *
   * @param rows - the number of rows to return
   * @param status - the status of the login
   * @param users - the users to return logins for
   * @param dates - the dates to return logins for
   * @returns user logins
   */
  // public getUserLogins(
  //   rows: string,
  //   status: string,
  //   integration: string,
  //   token: string,
  //   users: string[],
  //   dates: string
  // ): {
  //   log.debug({
  //     title: `SuiteToolsApiModel:getUserLogins() initiated`,
  //     details: {
  //       rows: rows,
  //       status: status,
  //       integration: integration,
  //       token: token,
  //       users: users,
  //       dates: dates,
  //     },
  //   });

  //   let sql = `SELECT
  //     TO_CHAR ( LoginAudit.date, 'YYYY-MM-DD HH24:MI:SS' ) AS date,
  //     LoginAudit.status,
  //     LoginAudit.oAuthAppName,
  //     LoginAudit.oAuthAccessTokenName,
  //     BUILTIN.DF( LoginAudit.role ) as role,
  //     BUILTIN.DF( LoginAudit.user ) || ' (' || LoginAudit.user  || ')' AS userName,
  //     LoginAudit.emailAddress,
  //     LoginAudit.ipAddress,
  //     LoginAudit.requestUri,
  //     LoginAudit.detail,
  //     LoginAudit.secChallenge,
  //     LoginAudit.userAgent
  //   FROM
  //     LoginAudit`;
  //   // add where clause
  //   const where = [];
  //   if (rows) {
  //     // limit to specified number of rows
  //     where.push(`RowNum <= ${rows}`);
  //   }
  //   if (status) {
  //     if (status === 'success') {
  //       where.push(`LoginAudit.status = 'Success'`);
  //     }
  //     if (status === 'failure') {
  //       where.push(`LoginAudit.status = 'Failure'`);
  //     }
  //   }
  //   if (integration) {
  //     // lookup integration name from id
  //     const integrations = this.stCommon.stModel.getIntegrationList();
  //     const foundIntegration = integrations.find((record) => record['id'] == integration);
  //     let integrationName: string = foundIntegration ? foundIntegration.name : 'INTEGRATION_NOT_FOUND';
  //     // switch integration name to match what is on the login audit record
  //     if (integrationName === 'SuiteCloud IDE & CLI') {
  //       this.stCommon.setAlert(
  //         'Note that "SuiteCloud IDE & CLI" Integration is listed as "SuiteCloud Development Integration" in the login audit table.'
  //       );
  //       integrationName = 'SuiteCloud Development Integration';
  //     }
  //     // add integration name to where clause
  //     where.push(`LoginAudit.oAuthAppName = '${integrationName}'`);
  //   }
  //   if (token) {
  //     // lookup token name from id
  //     const tokens = this.stCommon.stModel.getTokenList();
  //     const foundToken = tokens.find((record) => record['id'] == token);
  //     const tokenName: string = foundToken ? foundToken.name : 'TOKEN_NOT_FOUND';
  //     // // switch token name to match what is on the login audit record
  //     // if (tokenName === 'SuiteCloud IDE & CLI') {
  //     //   this.stCommon.setAlert(
  //     //     'Note that "SuiteCloud IDE & CLI" Integration is listed as "SuiteCloud Development Integration" in the login audit table.'
  //     //   );
  //     //   tokenName = 'SuiteCloud Development Integration';
  //     // }
  //     // add token name to where clause
  //     where.push(`LoginAudit.oAuthAccessTokenName = '${tokenName}'`);
  //   }
  //   if (users) {
  //     if (Array.isArray(users)) {
  //       users = users.map((user) => {
  //         return `'${user.toUpperCase()}'`;
  //       });
  //       where.push(`LoginAudit.user IN (${users.join(',')})`);
  //     }
  //   }
  //   if (dates) {
  //     switch (dates) {
  //       case '15':
  //         where.push('date > SYSDATE - ( 15 / 1440 )');
  //         break;
  //       case '60':
  //         where.push('date > SYSDATE - ( 1 / 24 )');
  //         break;
  //       case '240':
  //         where.push('date > SYSDATE - ( 4 / 24 )');
  //         break;
  //       case 'today':
  //         where.push("TO_CHAR ( date, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE, 'YYYY-MM-DD')");
  //         break;
  //       case 'yesterday':
  //         where.push("TO_CHAR ( date, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE - 1, 'YYYY-MM-DD')");
  //         break;
  //       default:
  //         log.error({ title: `SuiteToolsApiModel:getUserLogins() invalid date option`, details: dates });
  //         break;
  //     }
  //   }
  //   if (where.length > 0) {
  //     sql += ` WHERE ${where.join(' AND ')}`;
  //   }
  //   // add order by
  //   sql += ` ORDER BY LoginAudit.date DESC`;
  //   const results = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);

  //   log.debug({ title: 'SuiteToolsApiModel:getUserLogins() returning', details: results });

  //   return results;
  // }

  /**
   * Get Script Logs results (Search version)
   *
   * The search version can return the user that triggered the log message, but it can only be filtered by days.
   *
   * @param rows - the number of rows to return
   * @param levels - levels of log (e.g. debug, error, ...)
   * @param users - users to return log records for
   * @param types - types of script
   * @param scripts - the scripts to return log records for
   * @param owners - the script owners to return log records for
   * @param dates - the dates to return log records for
   * @param title - the title contains this string
   * @param detail - the detail contains this string
   * @returns script logs
   */
  // public getScriptLogsViaSearch(
  //   rows: string,
  //   levels: string,
  //   users: string,
  //   types: string,
  //   scripts: string,
  //   owners: string,
  //   dates: string,
  //   title: string,
  //   detail: string
  // ) {
  //   log.debug({
  //     title: `SuiteToolsApiModel:getScriptLogsViaSearch() initiated`,
  //     details: {
  //       rows: rows,
  //       levels: levels,
  //       users: users,
  //       types: types,
  //       scripts: scripts,
  //       owners: owners,
  //       dates: dates,
  //       title: title,
  //       detail: detail,
  //     },
  //   });

  //   const columns = [
  //     search.createColumn({
  //       name: 'internalid',
  //       sort: search.Sort.DESC,
  //       label: 'id',
  //     }),
  //     search.createColumn({
  //       name: 'date',
  //     }),
  //     search.createColumn({
  //       name: 'time',
  //     }),
  //     search.createColumn({ name: 'type' }),
  //     search.createColumn({ name: 'user' }),
  //     search.createColumn({
  //       name: 'internalid',
  //       join: 'user',
  //       label: 'userid',
  //     }),
  //     search.createColumn({ name: 'scripttype' }),
  //     search.createColumn({
  //       name: 'owner',
  //       join: 'script',
  //     }),
  //     search.createColumn({
  //       name: 'name',
  //       join: 'script',
  //     }),
  //     search.createColumn({
  //       name: 'internalid',
  //       join: 'script',
  //       label: 'scriptid',
  //     }),
  //     search.createColumn({ name: 'title' }),
  //     search.createColumn({ name: 'detail' }),
  //   ];
  //   const filters = [];
  //   if (levels) {
  //     filters.push(search.createFilter({ name: 'type', operator: search.Operator.ANYOF, values: levels }));
  //   }
  //   if (users) {
  //     // TODO - handle multiple users
  //     filters.push(search.createFilter({ name: 'user', operator: search.Operator.IS, values: users }));
  //   }
  //   if (types) {
  //     filters.push(
  //       search.createFilter({ name: 'scripttype', join: 'script', operator: search.Operator.ANYOF, values: types })
  //     );
  //   }
  //   if (scripts) {
  //     filters.push(
  //       search.createFilter({
  //         name: 'internalid',
  //         join: 'script',
  //         operator: search.Operator.ANYOF,
  //         values: scripts,
  //       })
  //     );
  //   }
  //   if (owners) {
  //     filters.push(
  //       search.createFilter({
  //         name: 'owner',
  //         join: 'script',
  //         operator: search.Operator.ANYOF,
  //         values: owners,
  //       })
  //     );
  //   }
  //   if (dates) {
  //     filters.push(search.createFilter({ name: 'date', operator: search.Operator.ON, values: dates }));
  //   }
  //   if (title) {
  //     filters.push(search.createFilter({ name: 'title', operator: search.Operator.CONTAINS, values: title }));
  //   }
  //   if (detail) {
  //     filters.push(search.createFilter({ name: 'detail', operator: search.Operator.CONTAINS, values: detail }));
  //   }
  //   // run the search
  //   const searchResults = this.stCommon.stLib.stLibNs.stLibNsSearch.search(
  //     'scriptexecutionlog',
  //     columns,
  //     filters,
  //     rows,
  //     true
  //   );

  //   // get list of active users so that we can determine user ids
  //   const userList = this.stCommon.stModel.getEmployeeList(true);

  //   // only return the results
  //   const results = searchResults.map((result) => {
  //     // log.debug({ title: 'SuiteToolsLibraryNetSuiteSearch:search() - columns', details: result.columns });
  //     // log.debug({ title: 'SuiteToolsLibraryNetSuiteSearch:search() - allValues', details: result.getAllValues() });

  //     // add user id to user if we can determine it
  //     //   TODO: handle case where multiple users have the same name
  //     let userName = result.getValue({ name: 'user' });
  //     const foundUser = userList.find((user) => user.name.trim() === userName);
  //     if (foundUser) {
  //       userName = userName + ' (' + foundUser.id + ')';
  //     }

  //     // add owner name to owner field if we can determine it
  //     let owner = result.getValue({ name: 'owner', join: 'script' });
  //     const foundName = userList.find((user) => user.id == owner);
  //     if (foundName) {
  //       owner = foundName.name.trim() + ' (' + owner + ')';
  //     }

  //     return {
  //       id: result.getValue({ name: 'internalid' }),
  //       timestamp: result.getValue({ name: 'date' }) + ' ' + result.getValue({ name: 'time' }),
  //       type: result.getValue({ name: 'type' }),
  //       user: userName,
  //       scripttype: result.getValue({ name: 'scripttype' }),
  //       owner: owner,
  //       scriptname:
  //         result.getValue({ name: 'name', join: 'script' }) +
  //         ' (' +
  //         result.getValue({ name: 'internalid', join: 'script' }) +
  //         ')',
  //       title: result.getValue({ name: 'title' }),
  //       detail: result.getValue({ name: 'detail' }),
  //     };
  //   });

  //   log.debug({ title: 'SuiteToolsApiModel:getScriptLogsViaSearch() returning', details: results });

  //   return results;
  // }

  /**
   * Get Script Log
   *
   * @param id - the record id to return
   * @returns script log
   */
  public getScriptLog(id: string): Response {
    log.debug({
      title: `SuiteToolsApiModel:SuiteToolsApi:getScriptLog() initiated`,
      details: {
        id: id,
      },
    });

    const response: Response = { data: {} };
    const sql = `SELECT
      ScriptNote.internalid AS id,
      TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD HH24:MI:SS' ) AS timestamp,
      ScriptNote.type,
      script.scripttype,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      BUILTIN.DF( script.name ) || ' (' || script.id  || ')' AS scriptname,
      ScriptNote.title, REPLACE( detail, '"', '""' ) AS detail
    FROM ScriptNote
    INNER JOIN script
      ON ScriptNote.scripttype = script.id
    WHERE ScriptNote.internalid = ${id}`;
    log.debug({ title: `SuiteToolsApiModel:SuiteToolsApi:getScriptLog() generated this sql`, details: sql });
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No script log found with id of ${id}`;
    } else {
      response.data = sqlResults[0];
    }

    return response;
  }

  /**
   * Get Script Logs results (SuiteQL version)
   *
   * The SuiteQL version can not return the user that triggered the log message, but it can only be filtered by minutes.
   *
   * @param row - the number of rows to return
   * @param levels - type of log (e.g. debug, error, ...)
   * @param types - types of script
   * @param scripts - the scripts to return log records for
   * @param owners - the script owners to return log records for
   * @param date - the dates to return log records for
   * @param title - the title contains this string
   * @param detail - the detail contains this string
   * @returns script logs
   */
  public getScriptLogsViaSuiteQL(
    row: string,
    levels: string[],
    // users: string[], // SuiteQL does not support user filtering. Need to use search instead.
    types: string[],
    scripts: string[],
    owners: string[],
    date: string,
    title: string,
    detail: string,
  ): Response {
    log.debug({
      title: `SuiteToolsApiModel:getScriptLogsViaSuiteQL() initiated`,
      details: {
        rows: row,
        levels: levels,
        types: types,
        scripts: scripts,
        owners: owners,
        dates: date,
        title: title,
        detail: detail,
      },
    });

    const response: Response = { data: {} };
    let sql = `SELECT
      ScriptNote.internalid AS id,
      TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD HH24:MI:SS' ) AS timestamp,
      ScriptNote.type,
      script.scripttype,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      BUILTIN.DF( script.name ) || ' (' || script.id  || ')' AS scriptname,
      ScriptNote.title, REPLACE( detail, '"', '""' ) AS detail
    FROM ScriptNote
    INNER JOIN script
      ON ScriptNote.scripttype = script.id`;
    // add where clause
    const where: string[] = [];
    if (row && row !== '0') {
      // limit to specified number of rows
      where.push(`RowNum <= ${row}`);
    }
    if (levels) {
      if (Array.isArray(levels)) {
        levels = levels.map((type) => {
          return `'${type.toUpperCase()}'`;
        });
        where.push(`ScriptNote.type IN (${levels.join(',')})`);
      }
    }
    if (types) {
      if (Array.isArray(types)) {
        types = types.map((type) => {
          return `'${type.toUpperCase()}'`;
        });
        where.push(`script.scripttype IN (${types.join(',')})`);
      }
    }
    if (scripts) {
      if (Array.isArray(scripts)) {
        where.push(`ScriptNote.scriptType IN (${scripts.join(',')})`);
      }
    }
    if (owners) {
      if (Array.isArray(owners)) {
        owners = owners.map((owner) => {
          return `'${owner.toUpperCase()}'`;
        });
        where.push(`owner IN (${owners.join(',')})`);
      }
    }
    this.addDateFilter(where, 'SuiteToolsApiModel:getScriptLogsViaSuiteQL()', 'ScriptNote', 'date', date);
    if (title) {
      where.push(`ScriptNote.title LIKE '%${title}%'`);
    }
    if (detail) {
      where.push(`ScriptNote.detail LIKE '%${detail}%'`);
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    // add order by
    sql += ` ORDER BY ScriptNote.internalId DESC`;
    // log.debug({ title: `SuiteToolsApiModel:getScriptLogsViaSuiteQL() generated this sql`, details: sql });
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No script log records found`;
    } else {
      response.data = sqlResults;
    }

    return response;
  }

  /**
   * Get User
   *
   * @param id - the record id to return
   * @returns user
   */
  public getUser(id: string): Response {
    log.debug({ title: `SuiteToolsApiModel:getUser() initiated`, details: { id: id } });

    const response: Response = { data: {} };
    const sql = `SELECT
      employee.id,
      employee.isinactive,
      employee.email,
      employee.entityid || ' (' || employee.id || ')' AS name,
      BUILTIN.DF( employee.supervisor ) || ' (' || employee.supervisor  || ')' AS supervisor,
      employee.title,
    FROM
      employee
    WHERE
      employee.id = ${id}`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No user found with id of ${id}`;
    } else {
      response.data = sqlResults[0];
    }
    log.debug({ title: 'SuiteToolsApiModel:getUser() returning', details: response });

    return response;
  }

  /**
   * Get Users
   *
   * @returns results
   */
  public getUsers(active: string, role: string, supervisors: string[]): Response {
    log.debug({
      title: `SuiteToolsApiModel:getUsers() initiated`,
      details: { active: active, role: role, supervisors: supervisors },
    });

    const response: Response = { data: {} };
    let sql = `SELECT
      employee.id,
      employee.isinactive,
      employee.email,
      employee.entityid || ' (' || employee.id || ')' AS name,
      BUILTIN.DF( role.id ) || ' (' || role.id || ')' AS role,
      BUILTIN.DF( employee.supervisor ) || ' (' || employee.supervisor  || ')' AS supervisor,
      employee.title,
    FROM employee
      INNER JOIN employeerolesforsearch ON ( employeerolesforsearch.entity = employee.id )
      INNER JOIN role ON ( role.id = employeerolesforsearch.role )`;
    // add where clause
    const where = [];
    switch (active) {
      case 'U':
        where.push(`employee.giveaccess = 'T'`);
        where.push(`employee.isinactive = 'F'`);
        break;
      case 'T':
        where.push(`employee.isinactive = 'F'`);
        break;
      case 'F':
        where.push(`employee.isinactive = 'T'`);
        break;
      default:
        // do not add a filter
        break;
    }
    if (role) {
      where.push(`role.id = ${role}`);
    }
    if (supervisors) {
      if (Array.isArray(supervisors)) {
        supervisors = supervisors.map((employee) => {
          return `'${employee.toUpperCase()}'`;
        });
        where.push(`employee.supervisor IN (${supervisors.join(',')})`);
      }
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    // add order by
    sql += ` ORDER BY employee.firstname ASC`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No script log records found`;
    } else {
      response.data = sqlResults;
    }
    log.debug({ title: 'SuiteToolsApiModel:getUsers() returning', details: response });

    return response;
  }

  // ---------------------------------------------------------------------------
  // Supporting Functions
  // ---------------------------------------------------------------------------

  /**
   * Adds date filter to where clause.
   *
   * @param where - the where clause
   * @param functionName - the function
   * @param table - the SuiteQL table
   * @param field - the table date field
   * @param dates - date field values
   */
  private addDateFilter(where: string[], functionName: string, table: string, field: string, dates: string | string[]) {
    log.debug({
      title: `SuiteToolsApiModel:dateFilter() initiated`,
      details: { where: where, functionName: functionName, table: table, field: field, dates: dates },
    });
    if (dates) {
      // check if dates is an object
      if (typeof dates === 'object') {
        // check if dates is an array
        if (Array.isArray(dates) && typeof dates[0] === 'string' && typeof dates[1] === 'string') {
          where.push(
            `date BETWEEN TO_DATE( '${dates[0]}', 'YYYY-MM-DD hh24:mi:ss' ) AND TO_DATE( '${dates[1]}', 'YYYY-MM-DD hh24:mi:ss' )`,
          );
        } else {
          log.error({
            title: `${functionName} invalid object date values for ${table}.${field}`,
            details: dates,
          });
        }
      } else {
        switch (dates) {
          case '0':
            // no filter
            break;
          case '15':
            where.push(`${field} > SYSDATE - ( 15 / 1440 )`);
            break;
          case '60':
            where.push(`${field} > SYSDATE - ( 1 / 24 )`);
            break;
          case '240':
            where.push(`${field} > SYSDATE - ( 4 / 24 )`);
            break;
          case 'today':
            where.push(`TO_CHAR ( ${table}.${field}, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE, 'YYYY-MM-DD')`);
            break;
          case 'yesterday':
            where.push(`TO_CHAR ( ${table}.${field}, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE - 1, 'YYYY-MM-DD')`);
            break;
          case 'lastweek':
            where.push(`TO_CHAR ( ${table}.${field}, 'YYYY-MM-DD') > TO_CHAR ( SYSDATE - 7, 'YYYY-MM-DD')`);
            break;
          case 'lastmonth':
            where.push(`TO_CHAR ( ${table}.${field}, 'YYYY-MM-DD') > TO_CHAR ( SYSDATE - 31, 'YYYY-MM-DD')`);
            break;
          default:
            log.error({
              title: `${functionName} invalid object date values for ${table}.${field}`,
              details: dates,
            });
            break;
        }
      }
    }
  }
}
