/**
 * SuiteTools API - GET Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from 'N/log';
import * as error from 'N/error';
import type { Response } from './types';
import { SuiteToolsApiGetOptions } from './SuiteToolsApiGetOptions';
import type { SuiteToolsCommon } from '../common/SuiteToolsCommon';
import type { SuiteToolsApiModel } from './SuiteToolsApiModel';
import { SuiteError } from '@suiteworks/suitetools-shared';

type RequestParams = { [key: string]: string };

/**
 * SuiteTools API GET Class
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsApiGet {
  private _stCommon: SuiteToolsCommon;
  private _stApiModel: SuiteToolsApiModel;
  private _stApiGetOptions: SuiteToolsApiGetOptions;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }
  get stApiModel(): SuiteToolsApiModel {
    return this._stApiModel;
  }
  get stApiGetOptions(): SuiteToolsApiGetOptions {
    return this._stApiGetOptions;
  }

  constructor(stCommon: SuiteToolsCommon, stApiModel: SuiteToolsApiModel) {
    this._stCommon = stCommon;
    this._stApiModel = stApiModel;
    this._stApiGetOptions = new SuiteToolsApiGetOptions(stCommon, stApiModel);
  }

  public process(requestParams: unknown): Response {
    log.debug({ title: 'SuiteToolsApiGet:process() initiated', details: requestParams });
    this.assertIsGetRequestParams(requestParams);

    try {
      let response: Response;

      const endpoint = requestParams.endpoint;
      switch (endpoint) {
        case 'file':
          response = this.getFile(requestParams);
          break;
        case 'files':
          response = this.getFiles(requestParams);
          break;
        case 'job':
          response = this.getJob(requestParams);
          response.data = this.cleanJobData(response.data);
          response.data = this.addJobLastRun(response.data);
          break;
        case 'jobs':
          response = this.getJobs(requestParams);
          response = this.cleanJobsData(response);
          break;
        case 'jobRun':
          response = this.getJobRun(requestParams);
          break;
        case 'jobRuns':
          response = this.getJobRuns(requestParams);
          break;
        case 'logins':
          response = this.getLogins(requestParams);
          response = this.cleanLoginsData(response);
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
          response = this.getSettings();
          break;
        case 'user':
          response = this.getUser(requestParams);
          response.data = this.cleanUserData(response.data);
          response.data = this.addUserLastLogin(response.data);
          break;
        case 'users':
          response = this.getUsers(requestParams);
          response = this.cleanUsersData(response);
          response = this.addUsersLastLogins(response);
          break;
        default:
          throw error.create({
            // TODO: handle with new error handling functionality
            name: 'SUITE_TOOLS_INVALID_PARAMETER',
            message: `Invalid parameter: endpoint=${endpoint}`,
            notifyOff: true,
          });
      }

      log.debug({ title: 'get() response', details: response });

      return response;
    } catch (err) {
      // Let SuiteError subclasses bubble up
      if (err instanceof SuiteError) {
        throw err;
      }

      // Wrap unexpected errors // TODO: create UnexpectedError subclass
      throw error.create({
        name: 'SUITE_TOOLS_UNEXPECTED',
        message: `Unexpected error in process(): ${String(err)}`,
        notifyOff: false,
      });
    }
  }

  private assertIsGetRequestParams(data: unknown): asserts data is RequestParams {
    // check if the data is an object
    if (typeof data !== 'object' || data === null) {
      throw new Error('Get request params data is not an object');
    }
    // endpoint
    if (!('endpoint' in data)) {
      throw new Error('Get request params data is missing the "endpoint" field');
    }
    if (typeof data.endpoint !== 'string') {
      throw new Error('Get request params data "endpoint" field is not a string');
    }
  }

  private convertMultiSelectToArray(field: string): string[] | null {
    return field ? (field.includes(',') ? field.split(',') : [field]) : null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private addUserLastLogin(data: any): object {
    if (data) {
      // get last logins data for users
      this.stCommon.stSettings.getSettings();
      const lastLoginsObj = this.stCommon.stSettings.lastLogins;
      const lastLogins = lastLoginsObj.data.filter((lastlogin: any) => lastlogin.name.type === 'user');
      // add the last login data to the user record
      const lastlogin = lastLogins.find((lastlogin: any) => lastlogin.name.name === data.email);
      if (lastlogin) {
        data.lastLogin = lastlogin.lastLogin;
      }
    }

    return data;
  }

  private addUsersLastLogins(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      // get last logins data for users
      this.stCommon.stSettings.getSettings();
      const lastLoginsObj = this.stCommon.stSettings.lastLogins;
      const lastLogins = lastLoginsObj.data.filter((lastlogin: any) => lastlogin.name.type === 'user');
      (response.data as any[]).forEach((record) => {
        // add the last login data to the user record
        const lastlogin = lastLogins.find((lastlogin: any) => lastlogin.name.name === record.email);
        if (lastlogin) {
          record.lastLogin = lastlogin.lastLogin;
        }
      });
    }

    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cleanJobData(data: any): object {
    // switch isinactive values to active values
    if (data.isinactive === 'F') {
      data.isinactive = false;
    } else {
      data.isinactive = true;
    }

    return data;
  }

  private cleanJobsData(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      (response.data as any[]).forEach((record) => {
        this.cleanJobData(record);
      });
    }

    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private addJobLastRun(data: any): object {
    log.debug({ title: 'SuiteToolsApiGet:addJobLastRun() initiated', details: { data } });

    // check if data exists and that data is an object
    if (typeof data === 'object' && data !== null && data.id) {
      data.lastRun = this.stCommon.stJobs.getJobLastRun(data.id);
    }

    return data;
  }

  private cleanLoginsData(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      (response.data as any[]).forEach((record, index) => {
        // auto-number the id field
        record.id = index + 1;
      });
    }

    return response;
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
      (response.data as any[]).forEach((record) => {
        this.cleanRoleData(record);
      });
    }

    return response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private cleanScriptData(data: any): object {
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
      (response.data as any[]).forEach((record) => {
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
    // set lastLogin field to "" if empty
    if (data.lastLogin === null) {
      data.lastLogin = '';
    }

    return data;
  }

  private cleanUsersData(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      (response.data as any[]).forEach((record) => {
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
    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }
    const result = this.stApiModel.getFile(id);

    return result;
  }

  /**
   * Get Files
   *
   * @param requestParams
   * @returns settings
   */
  private getFiles(requestParams: RequestParams): Response {
    const row = requestParams['rows'];
    const types = this.convertMultiSelectToArray(requestParams['filetypes']);
    const createdDate = requestParams['createddate'];
    const modifiedDate = requestParams['lastmodifieddate'];
    const result = this.stApiModel.getFiles(row, types, createdDate, modifiedDate);

    return result;
  }

  /**
   * Get Job
   *
   * @param requestParams
   * @returns settings
   */
  private getJob(requestParams: RequestParams): Response {
    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }
    const result = this.stApiModel.getJob(id);

    return result;
  }

  /**
   * Get Jobs
   *
   * @param requestParams
   * @returns settings
   */
  private getJobs(requestParams: RequestParams): Response {
    const active = requestParams['active'];
    const result = this.stApiModel.getJobs(active);

    return result;
  }

  /**
   * Get Run Job
   *
   * @param requestParams
   * @returns settings
   */
  private getJobRun(requestParams: RequestParams): Response {
    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }
    const result = this.stApiModel.getJobRun(id);

    return result;
  }

  /**
   * Get Job Runs
   *
   * @param requestParams
   * @returns settings
   */
  private getJobRuns(requestParams: RequestParams): Response {
    const job = requestParams['job'];
    const completed = requestParams['completed'];
    const result = this.stApiModel.getJobRuns(job, completed);

    return result;
  }

  /**
   * Get Logins
   *
   * @param requestParams
   * @returns settings
   */
  private getLogins(requestParams: RequestParams): Response {
    const rows = requestParams['rows'];
    const active = requestParams['active'];
    const integrationName = requestParams['integrationName'];
    const tokenName = requestParams['tokenName'];
    const users = this.convertMultiSelectToArray(requestParams['users']);
    const roles = this.convertMultiSelectToArray(requestParams['roles']);
    const dates = requestParams['dates'];
    const result = this.stApiModel.getLogins(rows, active, integrationName, tokenName, users, roles, dates);

    return result;
  }

  /**
   * Get Role
   *
   * @param requestParams
   * @returns settings
   */
  private getRole(requestParams: RequestParams): Response {
    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }
    const result = this.stApiModel.getRole(id);

    return result;
  }

  /**
   * Get Roles
   *
   * @param requestParams
   * @returns settings
   */
  private getRoles(requestParams: RequestParams): Response {
    const active = requestParams['active'];
    const result = this.stApiModel.getRoles(active);

    return result;
  }

  /**
   * Get Script
   *
   * @param requestParams
   * @returns settings
   */
  private getScript(requestParams: RequestParams): Response {
    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }
    const result = this.stApiModel.getScript(id);

    return result;
  }

  /**
   * Get Scripts
   *
   * @param requestParams
   * @returns settings
   */
  private getScripts(requestParams: RequestParams): Response {
    const active = requestParams['active'];
    const versions = this.convertMultiSelectToArray(requestParams['versions']);
    const scripttypes = this.convertMultiSelectToArray(requestParams['scripttypes']);
    const scripts = this.convertMultiSelectToArray(requestParams['scriptnames']);
    const owners = this.convertMultiSelectToArray(requestParams['owners']);
    const files = this.convertMultiSelectToArray(requestParams['files']);
    const result = this.stApiModel.getScripts(active, versions, scripttypes, scripts, owners, files);

    return result;
  }

  /**
   * Get Server Script Log
   *
   * @param requestParams
   * @returns settings
   */
  private getScriptLog(requestParams: RequestParams): Response {
    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }
    const result = this.stApiModel.getScriptLog(id);

    return result;
  }

  /**
   * Get Server Script Logs
   *
   * @param requestParams
   * @returns settings
   */
  private getScriptLogs(requestParams: RequestParams): Response {
    const row = requestParams['rows'] ? requestParams['rows'] : '50';
    const levels = this.convertMultiSelectToArray(requestParams['levels']);
    const types = this.convertMultiSelectToArray(requestParams['scripttypes']);
    const scripts = this.convertMultiSelectToArray(requestParams['scriptnames']);
    const owners = this.convertMultiSelectToArray(requestParams['owners']);
    const timemode = requestParams['timemode'] ? requestParams['timemode'] : 'now';
    let date = requestParams['createddate'] ? requestParams['createddate'] : '15';
    let customdatetime = requestParams['customdatetime'];
    let customduration = requestParams['customduration'];
    const title = requestParams['title'];
    const detail = requestParams['detail'];

    // verify required parameters
    if (timemode === 'now') {
      if (!date || date === '') {
        throw error.create({
          name: 'SUITE_TOOLS_MISSING_PARAMETER',
          message: `Missing required parameter for 'now' time mode: createddate`,
          notifyOff: true,
        });
      }
      if (customdatetime) {
        log.debug({
          title: 'SuiteToolsApiGet:getScriptLogs()',
          details: `Clearing 'customdatetime' since 'now' time mode`,
        });
        customdatetime = null;
      }
      if (customduration) {
        log.debug({
          title: 'SuiteToolsApiGet:getScriptLogs()',
          details: `Clearing 'customduration' for 'now' time mode`,
        });
        customduration = null;
      }
    }
    if (timemode === 'custom') {
      if (!customdatetime || !customduration) {
        throw error.create({
          name: 'SUITE_TOOLS_MISSING_PARAMETER',
          message: `Both 'customdatetime' and 'customduration' are required for 'custom' time mode`,
          notifyOff: true,
        });
      }
      if (date && date !== '') {
        log.debug({
          title: 'SuiteToolsApiGet:getScriptLogs()',
          details: `Clearing 'date' since 'custom' time mode`,
        });
        date = '';
      }
    }
    const result = this.stApiModel.getScriptLogsViaSuiteQL(
      row,
      levels,
      types,
      scripts,
      owners,
      timemode,
      date,
      customdatetime,
      customduration,
      title,
      detail,
    );

    return result;
  }

  /**
   * Get Settings.
   *
   * @returns settings
   */
  private getSettings(): Response {
    // load settings from the settings custom record
    this.stCommon.stSettings.getSettings();
    // build the settings object from this record and other sources
    const result = {
      // app settings
      appUrl: this.stCommon.appUrl,
      // core configurations
      cssUrl: this.stCommon.stSettings.cssUrl,
      jsUrl: this.stCommon.stSettings.jsUrl,
      // settings
      devMode: this.stCommon.stSettings.devMode,
      notifyEmail: this.stCommon.stSettings.notifyEmail,
      // storage settings
      lastLogins: this.stCommon.stSettings.lastLogins,
      // system (these are all from the runtime object)
      accountId: this.stCommon.runtime.accountId,
      envType: this.stCommon.runtime.envType,
      isProduction: this.stCommon.isProduction,
      version: this.stCommon.runtime.version,
      processorCount: this.stCommon.runtime.processorCount,
      queueCount: this.stCommon.runtime.queueCount,
      appBundle: this.stCommon.stSettings.appBundle,
      // user - these are all from the runtime object getCurrentUser() method
      userId: this.stCommon.runtime.getCurrentUser().id,
      userName: this.stCommon.runtime.getCurrentUser().name,
      userEmail: this.stCommon.runtime.getCurrentUser().email,
      userLocation: this.stCommon.runtime.getCurrentUser().location,
      userDepartment: this.stCommon.runtime.getCurrentUser().department,
      userRole: this.stCommon.runtime.getCurrentUser().roleId,
      userRoleId: this.stCommon.runtime.getCurrentUser().role,
      userSubsidiary: this.stCommon.runtime.getCurrentUser().subsidiary,
      isAdmin: this.stCommon.isAdmin,
    };

    return { status: 200, data: result };
  }

  /**
   * Get User
   *
   * @param requestParams
   * @returns user
   */
  private getUser(requestParams: RequestParams): Response {
    const id = requestParams.id;
    if (!id) {
      throw error.create({
        name: 'SUITE_TOOLS_MISSING_PARAMETER',
        message: `Missing required parameter: id`,
        notifyOff: true,
      });
    }
    const result = this.stApiModel.getUser(id);

    return result;
  }

  /**
   * Get Users
   *
   * @param requestParams
   * @returns users
   */
  private getUsers(requestParams: RequestParams): Response {
    const active = requestParams['active'];
    const roles = this.convertMultiSelectToArray(requestParams['roles']);
    const supervisors = this.convertMultiSelectToArray(requestParams['owners']);
    const result = this.stApiModel.getUsers(active, roles, supervisors);

    return result;
  }
}
