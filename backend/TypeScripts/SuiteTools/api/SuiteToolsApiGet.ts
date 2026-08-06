/**
 * SuiteTools API - GET Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return --
 * SuiteQL / settings bags are loosely typed today; tighten under #28.
 */

import * as log from 'N/log';
import type { Response } from './types';
import { SuiteToolsApiGetOptions } from './SuiteToolsApiGetOptions';
import type { SuiteToolsCommon } from '../common/SuiteToolsCommon';
import type { SuiteToolsApiModel } from './SuiteToolsApiModel';
import { SuiteError, InvalidParameterError, UnexpectedError } from '@suiteworks/suitetools-shared/errors';
import { validateGetResponse } from './SuiteToolsApiGetValidate';
import { ensureEntityOrSoftNotFound, softNotFoundResponse } from './SuiteToolsApiGetNotFound';

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
          response.data = this.cleanFileData(response.data);
          break;
        case 'files':
          response = this.getFiles(requestParams);
          response = this.cleanFilesData(response);
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
          response.data = this.cleanJobRunData(response.data);
          break;
        case 'jobRuns':
          response = this.getJobRuns(requestParams);
          response = this.cleanJobRunsData(response);
          break;
        case 'integration':
          response = this.getIntegration(requestParams);
          break;
        case 'integrations':
          response = this.getIntegrations(requestParams);
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
          // Only clean successful payloads; leave NotFound / empty shapes alone.
          if (response.status === 200) {
            response.data = this.cleanScriptData(response.data);
          }
          break;
        case 'scripts':
          response = this.getScripts(requestParams);
          response = this.cleanScriptsData(response);
          break;
        case 'scriptLog':
          response = this.getScriptLog(requestParams);
          if (response.status === 200) {
            response.data = this.cleanScriptLogData(response.data);
          }
          break;
        case 'scriptLogs':
          response = this.getScriptLogs(requestParams);
          response = this.cleanScriptLogsData(response);
          break;
        case 'settings':
          response = this.getSettings();
          break;
        case 'token':
          response = this.getToken(requestParams);
          break;
        case 'tokens':
          response = this.getTokens(requestParams);
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
          throw new InvalidParameterError('endpoint', endpoint, 'Endpoint not recognized');
      }

      log.debug({ title: 'get() response', details: response });

      return validateGetResponse(endpoint, response);
    } catch (err) {
      // Let SuiteError subclasses bubble up
      if (err instanceof SuiteError) {
        throw err;
      }

      // Wrap unexpected errors in UnexpectedError
      throw new UnexpectedError('process()', err, { endpoint: requestParams.endpoint });
    }
  }

  private assertIsGetRequestParams(data: unknown): asserts data is RequestParams {
    // check if the data is an object
    if (typeof data !== 'object' || data === null) {
      throw new InvalidParameterError('requestParams', data, 'Request params must be an object');
    }
    // endpoint
    if (!('endpoint' in data)) {
      throw new InvalidParameterError('endpoint', undefined, 'Missing required field');
    }
    if (typeof data.endpoint !== 'string') {
      throw new InvalidParameterError('endpoint', data.endpoint, 'Must be a string');
    }
  }

  private convertMultiSelectToArray(field: string): string[] | null {
    return field ? (field.includes(',') ? field.split(',') : [field]) : null;
  }

  private addUserLastLogin(data: any): object {
    if (data) {
      // get last logins data for users
      this.stCommon.stSettings.getSettings();
      const lastLoginsObj = this.stCommon.stSettings.lastLogins;
      if (lastLoginsObj?.data && Array.isArray(lastLoginsObj.data)) {
        const lastLogins = lastLoginsObj.data.filter((lastlogin: any) => lastlogin.name.type === 'user');
        // add the last login data to the user record
        const lastlogin = lastLogins.find((lastlogin: any) => lastlogin.name.name === data.email);
        if (lastlogin) {
          data.lastLogin = lastlogin.lastLogin;
        }
      }
    }

    return data;
  }

  private addUsersLastLogins(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      // get last logins data for users
      this.stCommon.stSettings.getSettings();
      const lastLoginsObj = this.stCommon.stSettings.lastLogins;
      if (lastLoginsObj?.data && Array.isArray(lastLoginsObj.data)) {
        const lastLogins = lastLoginsObj.data.filter((lastlogin: any) => lastlogin.name.type === 'user');
        (response.data as any[]).forEach((record) => {
          // add the last login data to the user record
          const lastlogin = lastLogins.find((lastlogin: any) => lastlogin.name.name === record.email);
          if (lastlogin) {
            record.lastLogin = lastlogin.lastLogin;
          }
        });
      }
    }

    return response;
  }

  private cleanJobData(data: any): object {
    // Skip empty payloads (e.g. not-found responses still shaped as {}).
    if (!data || typeof data !== 'object') {
      return data;
    }
    if (!('isInactive' in data) && !('isinactive' in data)) {
      return data;
    }

    // SuiteQL may return `isinactive`; emit shared camelCase wire key.
    const inactive = data.isInactive ?? data.isinactive;
    if (inactive === 'F' || inactive === false) {
      data.isInactive = false;
    } else if (inactive === 'T' || inactive === true) {
      data.isInactive = true;
    } else {
      data.isInactive = Boolean(inactive);
    }
    delete data.isinactive;

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

  private addJobLastRun(data: any): object {
    log.debug({ title: 'SuiteToolsApiGet:addJobLastRun() initiated', details: { data } });

    // Only attach lastRun when a run exists.
    if (typeof data === 'object' && data !== null && data.id) {
      const lastRun = this.stCommon.stJobs.getJobLastRun(data.id);
      if (lastRun) {
        data.lastRun = lastRun;
      }
    }

    return data;
  }

  /**
   * SuiteQL `asMappedResults()` lowercases multi-word keys. Emit the shared
   * Login camelCase wire contract and drop flat leftovers.
   */
  private cleanLoginData(data: any): object {
    if (!data || typeof data !== 'object') {
      return data;
    }

    data.oauthAppName = data.oauthAppName ?? data.oauthappname ?? data.oAuthAppName ?? '';
    data.oauthAccessTokenName =
      data.oauthAccessTokenName ?? data.oauthaccesstokenname ?? data.oAuthAccessTokenName ?? '';
    data.userName = data.userName ?? data.username ?? '';
    data.roleName = data.roleName ?? data.rolename ?? '';
    data.emailAddress = data.emailAddress ?? data.emailaddress ?? '';
    data.ipAddress = data.ipAddress ?? data.ipaddress ?? '';
    data.requestUri = data.requestUri ?? data.requesturi ?? '';
    data.secChallenge = data.secChallenge ?? data.secchallenge ?? '';
    data.userAgent = data.userAgent ?? data.useragent ?? '';
    delete data.oauthappname;
    delete data.oauthaccesstokenname;
    delete data.username;
    delete data.rolename;
    delete data.emailaddress;
    delete data.ipaddress;
    delete data.requesturi;
    delete data.secchallenge;
    delete data.useragent;
    delete data.oAuthAppName;
    delete data.oAuthAccessTokenName;

    return data;
  }

  private cleanLoginsData(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      (response.data as any[]).forEach((record, index) => {
        // LoginAudit has no stable internal id in this query; synthesize for the UI modal.
        record.id = index + 1;
        this.cleanLoginData(record);
      });
    }

    return response;
  }

  /**
   * Remap SuiteQL-lowercased JobRun aliases to the shared camelCase wire contract.
   */
  private cleanJobRunData(data: any): object {
    if (!data || typeof data !== 'object') {
      return data;
    }

    data.jobId = data.jobId ?? data.jobid;
    data.jobName = data.jobName ?? data.jobname ?? '';
    delete data.jobid;
    delete data.jobname;

    return data;
  }

  private cleanJobRunsData(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      (response.data as any[]).forEach((record) => {
        this.cleanJobRunData(record);
      });
    }

    return response;
  }

  private cleanRoleData(data: any): object {
    // Soft-miss / empty payloads can be null or non-objects — bail before field access.
    if (!data || typeof data !== 'object') {
      return data;
    }

    // SuiteQL may lowercase multi-word keys; normalize to the shared Role wire contract.
    data.centerType = data.centerType ?? data.centertype ?? '';
    data.isInactive = data.isInactive ?? data.isinactive;
    data.isSalesRole = data.isSalesRole ?? data.issalesrole;
    data.isSupportRole = data.isSupportRole ?? data.issupportrole;
    data.isWebServiceOnlyRole = data.isWebServiceOnlyRole ?? data.iswebserviceonlyrole;
    delete data.centertype;
    delete data.isinactive;
    delete data.issalesrole;
    delete data.issupportrole;
    delete data.iswebserviceonlyrole;

    // Map T/F flags to Yes/No strings for zNetSuite.booleanFromTF.
    if (data.isInactive === 'F') {
      data.isInactive = 'Yes';
    } else {
      data.isInactive = 'No';
    }
    if (data.isSalesRole === 'F') {
      data.isSalesRole = 'No';
    } else {
      data.isSalesRole = 'Yes';
    }
    if (data.isSupportRole === 'F') {
      data.isSupportRole = 'No';
    } else {
      data.isSupportRole = 'Yes';
    }
    if (data.isWebServiceOnlyRole === 'F') {
      data.isWebServiceOnlyRole = 'No';
    } else {
      data.isWebServiceOnlyRole = 'Yes';
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

  private cleanScriptData(data: any): object {
    // Skip empty payloads (e.g. not-found responses still shaped as {}).
    if (!data || typeof data !== 'object') {
      return data;
    }
    if (!('isInactive' in data) && !('isinactive' in data)) {
      return data;
    }

    // SuiteQL lowercases aliases; normalize to shared Script wire keys.
    data.apiVersion = data.apiVersion ?? data.apiversion;
    data.isInactive = data.isInactive ?? data.isinactive;
    data.scriptType = data.scriptType ?? data.scripttype;
    data.scriptId = data.scriptId ?? data.scriptid;
    data.scriptFile = data.scriptFile ?? data.scriptfile;
    data.notifyEmails = data.notifyEmails ?? data.notifyemails;
    delete data.apiversion;
    delete data.isinactive;
    delete data.scripttype;
    delete data.scriptid;
    delete data.scriptfile;
    delete data.notifyemails;

    // Normalize NetSuite T/F to boolean for shared schema validation.
    if (data.isInactive === 'F') {
      data.isInactive = false;
    } else if (data.isInactive === 'T') {
      data.isInactive = true;
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

  /**
   * SuiteQL lowercases `AS scriptType` / `AS scriptName`. Remap to the shared
   * ScriptLog camelCase wire contract before SPA Zod parse.
   */
  private cleanScriptLogData(data: any): object {
    if (!data || typeof data !== 'object') {
      return data;
    }

    data.scriptType = data.scriptType ?? data.scripttype ?? '';
    data.scriptName = data.scriptName ?? data.scriptname ?? '';
    data.owner = data.owner ?? '';
    data.type = data.type ?? '';
    data.title = data.title ?? '';
    delete data.scripttype;
    delete data.scriptname;

    return data;
  }

  private cleanScriptLogsData(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      (response.data as any[]).forEach((record) => {
        this.cleanScriptLogData(record);
      });
    }

    return response;
  }

  /**
   * SuiteQL `asMappedResults()` lowercases aliases (`AS dateCreated` → `datecreated`).
   * Remap to the shared camelCase File wire contract before SPA Zod parse.
   */
  private cleanFileData(data: any): object {
    if (!data || typeof data !== 'object') {
      return data;
    }

    data.dateCreated = data.dateCreated ?? data.datecreated;
    data.lastModifiedDate = data.lastModifiedDate ?? data.lastmodifieddate;
    data.fileTypeName = data.fileTypeName ?? data.filetypename ?? '';
    data.fileSize = data.fileSize ?? data.filesize;
    delete data.datecreated;
    delete data.lastmodifieddate;
    delete data.filetypename;
    delete data.filesize;

    return data;
  }

  private cleanFilesData(response: Response): Response {
    if (response && Array.isArray(response.data) && response.data.length > 0) {
      (response.data as any[]).forEach((record) => {
        this.cleanFileData(record);
      });
    }

    return response;
  }

  private cleanUserData(data: any): object {
    // Soft-miss / empty payloads can be null or non-objects — bail before field access.
    if (!data || typeof data !== 'object') {
      return data;
    }

    // SuiteQL lowercases `AS isInactive` → `isinactive`; prefer camelCase wire key.
    const inactive = data.isInactive ?? data.isinactive;
    if (inactive === 'F') {
      data.isInactive = 'Yes';
    } else {
      data.isInactive = 'No';
    }
    delete data.isinactive;
    // clear supervisor field if empty DF()
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
      throw new InvalidParameterError('id', undefined, 'Missing required parameter');
    }
    const result = this.stApiModel.getFile(id);
    return ensureEntityOrSoftNotFound(result, `No file found with id of ${id}`);
  }

  /**
   * Get Files
   *
   * @param requestParams
   * @returns settings
   */
  private getFiles(requestParams: RequestParams): Response {
    const row = requestParams['rows'];
    const types = this.convertMultiSelectToArray(requestParams['fileTypes']);
    const createdDate = requestParams['dateCreated'];
    const modifiedDate = requestParams['lastModifiedDate'];
    const result = this.stApiModel.getFiles(row, types, createdDate, modifiedDate);

    // List endpoints must return an array (legacy code used `{}` for empty).
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

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
      throw new InvalidParameterError('id', undefined, 'Missing required parameter');
    }
    const result = this.stApiModel.getJob(id);
    return ensureEntityOrSoftNotFound(result, `No job found with id of ${id}`);
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

    // List endpoints must return an array (legacy model used `{}` for empty).
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

    return result;
  }

  /**
   * Get Integration
   *
   * @param requestParams
   * @returns integration
   */
  private getIntegration(requestParams: RequestParams): Response {
    const id = requestParams.id;
    if (!id) {
      throw new InvalidParameterError('id', undefined, 'Missing required parameter');
    }
    const result = this.stApiModel.getIntegration(id);
    return ensureEntityOrSoftNotFound(result, `No integration found with id of ${id}`);
  }

  /**
   * Get Integrations
   *
   * @param requestParams
   * @returns integrations
   */
  private getIntegrations(requestParams: RequestParams): Response {
    const active = requestParams['active'];
    const result = this.stApiModel.getIntegrations(active);

    if (!Array.isArray(result.data)) {
      result.data = [];
    }

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
      throw new InvalidParameterError('id', undefined, 'Missing required parameter');
    }
    const result = this.stApiModel.getJobRun(id);
    return ensureEntityOrSoftNotFound(result, `No job execution found with id of ${id}`);
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

    // Legacy model uses `{}` for empty lists; adapters expect an array or NotFound.
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

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

    // List endpoints must return an array (legacy model used `{}` for empty).
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

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
      throw new InvalidParameterError('id', undefined, 'Missing required parameter');
    }
    const result = this.stApiModel.getRole(id);
    return ensureEntityOrSoftNotFound(result, `No role found with id of ${id}`);
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

    // List endpoints must return an array (legacy model used `{}` for empty).
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

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
      throw new InvalidParameterError('id', undefined, 'Missing required parameter');
    }
    const result = this.stApiModel.getScript(id);
    return ensureEntityOrSoftNotFound(result, `No script found with id of ${id}`);
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
    const scripttypes = this.convertMultiSelectToArray(requestParams['scriptTypes']);
    const scripts = this.convertMultiSelectToArray(requestParams['scriptNames']);
    const owners = this.convertMultiSelectToArray(requestParams['owners']);
    const files = this.convertMultiSelectToArray(requestParams['files']);
    const result = this.stApiModel.getScripts(active, versions, scripttypes, scripts, owners, files);

    // List endpoints must return an array
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

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
      throw new InvalidParameterError('id', undefined, 'Missing required parameter');
    }
    const result = this.stApiModel.getScriptLog(id);
    if (!result || result.length === 0) {
      return softNotFoundResponse(`No script log found with id of ${id}`);
    }
    return { status: 200, data: result[0] };
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
    const types = this.convertMultiSelectToArray(requestParams['scriptTypes']);
    const scripts = this.convertMultiSelectToArray(requestParams['scriptNames']);
    const owners = this.convertMultiSelectToArray(requestParams['owners']);
    const timemode = requestParams['timeMode'] ? requestParams['timeMode'] : 'now';
    let date = requestParams['dateCreated'] ? requestParams['dateCreated'] : '15';
    let customdatetime = requestParams['customDateTime'];
    let customduration = requestParams['customDuration'];
    const title = requestParams['title'];
    const detail = requestParams['detail'];

    // verify required parameters
    if (timemode === 'now') {
      if (!date || date === '') {
        throw new InvalidParameterError('dateCreated', date, "Missing required parameter for 'now' time mode");
      }
      if (customdatetime) {
        log.debug({
          title: 'SuiteToolsApiGet:getScriptLogs()',
          details: `Clearing 'customDateTime' since 'now' time mode`,
        });
        customdatetime = null;
      }
      if (customduration) {
        log.debug({
          title: 'SuiteToolsApiGet:getScriptLogs()',
          details: `Clearing 'customDuration' for 'now' time mode`,
        });
        customduration = null;
      }
    }
    if (timemode === 'custom') {
      if (!customdatetime || !customduration) {
        throw new InvalidParameterError(
          'customDateTime/customDuration',
          { customdatetime, customduration },
          "Both parameters required for 'custom' time mode",
        );
      }
      if (date && date !== '') {
        log.debug({
          title: 'SuiteToolsApiGet:getScriptLogs()',
          details: `Clearing 'dateCreated' since 'custom' time mode`,
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

    // List endpoints must return an array (legacy model used `{}` for empty).
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

    return result;
  }

  /**
   * Get a single TBA access token.
   * @param requestParams - Must include id.
   */
  private getToken(requestParams: RequestParams): Response {
    const id = requestParams.id;
    if (!id) {
      throw new InvalidParameterError('id', undefined, 'Missing required parameter');
    }
    const result = this.stApiModel.getToken(id);
    return ensureEntityOrSoftNotFound(result, `No token found with id of ${id}`);
  }

  /**
   * Get TBA access tokens with optional filters.
   * @param requestParams - Optional active, integrationName, userName, roleName.
   */
  private getTokens(requestParams: RequestParams): Response {
    const active = requestParams.active ?? '';
    const integrationName = requestParams.integrationName ?? '';
    const userName = requestParams.userName ?? '';
    const roleName = requestParams.roleName ?? '';
    const result = this.stApiModel.getTokens(active, integrationName, userName, roleName);
    if (!Array.isArray(result.data)) {
      result.data = [];
    }
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
      throw new InvalidParameterError('id', undefined, 'Missing required parameter');
    }
    const result = this.stApiModel.getUser(id);
    return ensureEntityOrSoftNotFound(result, `No user found with id of ${id}`);
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

    // List endpoints must return an array (legacy model used `{}` for empty).
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

    return result;
  }
}
