/**
 * SuiteTools API - GET Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from "N/log";
import type { Response } from "./types";
import { SuiteToolsApiGetOptions } from "./SuiteToolsApiGetOptions";
import type { SuiteToolsCommon } from "../common/SuiteToolsCommon";
import type { SuiteToolsApiModel } from "./SuiteToolsApiModel";
import { isNotFound } from "@suiteworks/suitetools-shared";
import { SuiteError, InvalidParameterError, UnexpectedError } from "@suiteworks/suitetools-shared/errors";
import { validateGetResponse } from "./SuiteToolsApiGetValidate";
import { ensureEntityOrSoftNotFound } from "./SuiteToolsApiGetNotFound";

type RequestParams = { [key: string]: string };

/**
 * A raw payload row, as it reaches the cleaners.
 *
 * The cleaners run *before* schema validation -- their job is to reshape untyped SuiteQL
 * rows into the shape the domain schema then validates. So the domain schema types their
 * output, never their input; the honest input type is a string-keyed bag of `unknown`.
 */
type Row = Record<string, unknown>;

/** Narrow an untyped payload to an indexable row. Mirrors the guard the cleaners already ran. */
function isRow(value: unknown): value is Row {
  return typeof value === "object" && value !== null;
}

/**
 * A SuiteQL row the Get-layer cleaners may remap.
 *
 * Canonical soft NotFound is an object, so `isRow` is true for it. Cleaners that write
 * empty-string defaults would decorate `{ code: "NOT_FOUND", message }` if they only
 * checked `isRow`. Refuse here and leave the payload unchanged (#104).
 */
function isCleanableRow(value: unknown): value is Row {
  return isRow(value) && !isNotFound(value);
}

/** Rows of an untyped list payload. Non-arrays and non-object entries drop out. */
function rowsOf(value: unknown): Row[] {
  return Array.isArray(value) ? value.filter(isRow) : [];
}

/**
 * Apply a per-row cleaner to every object in a list payload.
 * The index is for callers that synthesize an id (LoginAudit has none in this query).
 */
function cleanAll(response: Response, clean: (record: Row, index: number) => void): Response {
  for (const [index, record] of rowsOf(response.data).entries()) {
    clean(record, index);
  }
  return response;
}

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
    log.debug({ title: "SuiteToolsApiGet:process() initiated", details: requestParams });
    this.assertIsGetRequestParams(requestParams);

    try {
      let response: Response;

      const endpoint = requestParams.endpoint;
      switch (endpoint) {
        case "file":
          response = this.getFile(requestParams);
          response.data = this.cleanFileData(response.data);
          break;
        case "files":
          response = this.getFiles(requestParams);
          response = this.cleanFilesData(response);
          break;
        case "job":
          response = this.getJob(requestParams);
          response.data = this.cleanJobData(response.data);
          response.data = this.addJobLastRun(response.data);
          break;
        case "jobs":
          response = this.getJobs(requestParams);
          response = this.cleanJobsData(response);
          break;
        case "jobRun":
          response = this.getJobRun(requestParams);
          response.data = this.cleanJobRunData(response.data);
          break;
        case "jobRuns":
          response = this.getJobRuns(requestParams);
          response = this.cleanJobRunsData(response);
          break;
        case "integration":
          // Model-normalized (`normalizeIntegrationRow`); no Get-layer cleaner (#104).
          response = this.getIntegration(requestParams);
          break;
        case "integrations":
          response = this.getIntegrations(requestParams);
          break;
        case "logins":
          response = this.getLogins(requestParams);
          response = this.cleanLoginsData(response);
          break;
        case "optionValues":
          response = this.stApiGetOptions.process(requestParams);
          break;
        case "role":
          response = this.getRole(requestParams);
          response.data = this.cleanRoleData(response.data);
          break;
        case "roles":
          response = this.getRoles(requestParams);
          response = this.cleanRolesData(response);
          break;
        case "script":
          response = this.getScript(requestParams);
          response.data = this.cleanScriptData(response.data);
          break;
        case "scripts":
          response = this.getScripts(requestParams);
          response = this.cleanScriptsData(response);
          break;
        case "scriptLog":
          response = this.getScriptLog(requestParams);
          response.data = this.cleanScriptLogData(response.data);
          break;
        case "scriptLogs":
          response = this.getScriptLogs(requestParams);
          response = this.cleanScriptLogsData(response);
          break;
        case "settings":
          response = this.getSettings();
          break;
        case "token":
          // Model-normalized (`normalizeTokenRow`); no Get-layer cleaner (#104).
          response = this.getToken(requestParams);
          break;
        case "tokens":
          response = this.getTokens(requestParams);
          break;
        case "user":
          response = this.getUser(requestParams);
          response.data = this.cleanUserData(response.data);
          response.data = this.addUserLastLogin(response.data);
          break;
        case "users":
          response = this.getUsers(requestParams);
          response = this.cleanUsersData(response);
          response = this.addUsersLastLogins(response);
          break;
        default:
          throw new InvalidParameterError("endpoint", endpoint, "Endpoint not recognized");
      }

      log.debug({ title: "get() response", details: response });

      return validateGetResponse(endpoint, response);
    } catch (err) {
      // Let SuiteError subclasses bubble up
      if (err instanceof SuiteError) {
        throw err;
      }

      // Wrap unexpected errors in UnexpectedError
      throw new UnexpectedError("process()", err, { endpoint: requestParams.endpoint });
    }
  }

  private assertIsGetRequestParams(data: unknown): asserts data is RequestParams {
    // check if the data is an object
    if (typeof data !== "object" || data === null) {
      throw new InvalidParameterError("requestParams", data, "Request params must be an object");
    }
    // endpoint
    if (!("endpoint" in data)) {
      throw new InvalidParameterError("endpoint", undefined, "Missing required field");
    }
    if (typeof data.endpoint !== "string") {
      throw new InvalidParameterError("endpoint", data.endpoint, "Must be a string");
    }
  }

  private convertMultiSelectToArray(field: string): string[] | null {
    return field ? (field.includes(",") ? field.split(",") : [field]) : null;
  }

  private addUserLastLogin(data: unknown): unknown {
    if (isRow(data)) {
      // get last logins data for users
      const lastLoginsObj = this.stCommon.stSettings.getSettings()?.lastLogins;
      if (lastLoginsObj?.data && Array.isArray(lastLoginsObj.data)) {
        const lastLogins = lastLoginsObj.data.filter((lastlogin) => lastlogin.name.type === "user");
        // add the last login data to the user record
        const lastlogin = lastLogins.find((lastlogin) => lastlogin.name.name === data.email);
        if (lastlogin) {
          data.lastLogin = lastlogin.lastLogin;
        }
      }
    }

    return data;
  }

  private addUsersLastLogins(response: Response): Response {
    const records = rowsOf(response.data);
    if (records.length > 0) {
      // get last logins data for users
      const lastLoginsObj = this.stCommon.stSettings.getSettings()?.lastLogins;
      if (lastLoginsObj?.data && Array.isArray(lastLoginsObj.data)) {
        const lastLogins = lastLoginsObj.data.filter((lastlogin) => lastlogin.name.type === "user");
        for (const record of records) {
          // add the last login data to the user record
          const lastlogin = lastLogins.find((lastlogin) => lastlogin.name.name === record.email);
          if (lastlogin) {
            record.lastLogin = lastlogin.lastLogin;
          }
        }
      }
    }

    return response;
  }

  private cleanJobData(data: unknown): unknown {
    if (!isCleanableRow(data)) {
      return data;
    }
    if (!("isInactive" in data) && !("isinactive" in data)) {
      return data;
    }

    // SuiteQL may return `isinactive`; emit shared camelCase wire key. The T/F value itself is
    // left alone -- JobSchema declares `isInactive` as booleanFromTF, which coerces it.
    data.isInactive = data.isInactive ?? data.isinactive;
    delete data.isinactive;

    return data;
  }

  private cleanJobsData(response: Response): Response {
    return cleanAll(response, (record) => this.cleanJobData(record));
  }

  private addJobLastRun(data: unknown): unknown {
    log.debug({ title: "SuiteToolsApiGet:addJobLastRun() initiated", details: { data } });

    // Only attach lastRun when a run exists.
    if (isRow(data) && data.id) {
      const lastRun = this.stCommon.stJobs.getJobLastRun(String(data.id));
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
  private cleanLoginData(data: unknown): unknown {
    if (!isRow(data)) {
      return data;
    }

    data.oauthAppName = data.oauthAppName ?? data.oauthappname ?? data.oAuthAppName ?? "";
    data.oauthAccessTokenName =
      data.oauthAccessTokenName ?? data.oauthaccesstokenname ?? data.oAuthAccessTokenName ?? "";
    data.userName = data.userName ?? data.username ?? "";
    data.roleName = data.roleName ?? data.rolename ?? "";
    data.emailAddress = data.emailAddress ?? data.emailaddress ?? "";
    data.ipAddress = data.ipAddress ?? data.ipaddress ?? "";
    data.requestUri = data.requestUri ?? data.requesturi ?? "";
    data.secChallenge = data.secChallenge ?? data.secchallenge ?? "";
    data.userAgent = data.userAgent ?? data.useragent ?? "";
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
    return cleanAll(response, (record, index) => {
      // LoginAudit has no stable internal id in this query; synthesize for the UI modal.
      record.id = index + 1;
      this.cleanLoginData(record);
    });
  }

  /**
   * Remap SuiteQL-lowercased JobRun aliases to the shared camelCase wire contract.
   */
  private cleanJobRunData(data: unknown): unknown {
    if (!isCleanableRow(data)) {
      return data;
    }

    data.jobId = data.jobId ?? data.jobid;
    data.jobName = data.jobName ?? data.jobname ?? "";
    delete data.jobid;
    delete data.jobname;

    return data;
  }

  private cleanJobRunsData(response: Response): Response {
    return cleanAll(response, (record) => this.cleanJobRunData(record));
  }

  private cleanRoleData(data: unknown): unknown {
    if (!isCleanableRow(data)) {
      return data;
    }

    // SuiteQL may lowercase multi-word keys; normalize to the shared Role wire contract.
    data.centerType = data.centerType ?? data.centertype ?? "";
    data.isInactive = data.isInactive ?? data.isinactive;
    data.isSalesRole = data.isSalesRole ?? data.issalesrole;
    data.isSupportRole = data.isSupportRole ?? data.issupportrole;
    data.isWebServiceOnlyRole = data.isWebServiceOnlyRole ?? data.iswebserviceonlyrole;
    delete data.centertype;
    delete data.isinactive;
    delete data.issalesrole;
    delete data.issupportrole;
    delete data.iswebserviceonlyrole;

    // Flag values are left as SuiteQL returns them. RoleSchema declares all four as
    // booleanFromTF, which coerces "T"/"F" directly -- the Yes/No remap that used to sit here
    // duplicated that coercion, and inverted `isInactive` while doing it ("F", meaning active,
    // became "Yes", which booleanFromTF reads as true).

    return data;
  }

  private cleanRolesData(response: Response): Response {
    return cleanAll(response, (record) => this.cleanRoleData(record));
  }

  private cleanScriptData(data: unknown): unknown {
    if (!isCleanableRow(data)) {
      return data;
    }
    if (!("isInactive" in data) && !("isinactive" in data)) {
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

    // T/F is left as-is; ScriptSchema declares `isInactive` as booleanFromTF.

    return data;
  }

  private cleanScriptsData(response: Response): Response {
    return cleanAll(response, (record) => this.cleanScriptData(record));
  }

  /**
   * SuiteQL lowercases `AS scriptType` / `AS scriptName`. Remap to the shared
   * ScriptLog camelCase wire contract before SPA Zod parse.
   */
  private cleanScriptLogData(data: unknown): unknown {
    if (!isCleanableRow(data)) {
      return data;
    }

    data.scriptType = data.scriptType ?? data.scripttype ?? "";
    data.scriptName = data.scriptName ?? data.scriptname ?? "";
    data.owner = data.owner ?? "";
    data.type = data.type ?? "";
    data.title = data.title ?? "";
    delete data.scripttype;
    delete data.scriptname;

    return data;
  }

  private cleanScriptLogsData(response: Response): Response {
    return cleanAll(response, (record) => this.cleanScriptLogData(record));
  }

  /**
   * SuiteQL `asMappedResults()` lowercases aliases (`AS dateCreated` → `datecreated`).
   * Remap to the shared camelCase File wire contract before SPA Zod parse.
   */
  private cleanFileData(data: unknown): unknown {
    if (!isCleanableRow(data)) {
      return data;
    }

    data.dateCreated = data.dateCreated ?? data.datecreated;
    data.lastModifiedDate = data.lastModifiedDate ?? data.lastmodifieddate;
    data.fileTypeName = data.fileTypeName ?? data.filetypename ?? "";
    data.fileSize = data.fileSize ?? data.filesize;
    delete data.datecreated;
    delete data.lastmodifieddate;
    delete data.filetypename;
    delete data.filesize;

    return data;
  }

  private cleanFilesData(response: Response): Response {
    return cleanAll(response, (record) => this.cleanFileData(record));
  }

  private cleanUserData(data: unknown): unknown {
    if (!isCleanableRow(data)) {
      return data;
    }

    // SuiteQL lowercases `AS isInactive` → `isinactive`; prefer camelCase wire key. The value is
    // left as SuiteQL returns it -- UserSchema declares `isInactive` as booleanFromTF. The Yes/No
    // remap that used to sit here inverted it: "F", meaning active, became "Yes" → true.
    data.isInactive = data.isInactive ?? data.isinactive;
    delete data.isinactive;
    // clear supervisor field if empty DF()
    if (data.supervisor === " ()") {
      data.supervisor = "";
    }
    // set title field to "" if empty
    if (data.title === null) {
      data.title = "";
    }
    // set lastLogin field to "" if empty
    if (data.lastLogin === null) {
      data.lastLogin = "";
    }

    return data;
  }

  private cleanUsersData(response: Response): Response {
    return cleanAll(response, (record) => this.cleanUserData(record));
  }

  /**
   * Fetch a single entity by `requestParams.id`.
   *
   * Shared by the singular endpoints whose model method returns a `Response`.
   */
  private getById(requestParams: RequestParams, noun: string, modelFn: (id: string) => Response): Response {
    const id = requestParams.id;
    if (!id) {
      throw new InvalidParameterError("id", undefined, "Missing required parameter");
    }
    const result = modelFn(id);
    return ensureEntityOrSoftNotFound(result, `No ${noun} found with id of ${id}`);
  }

  /**
   * Get File
   *
   * @param requestParams
   * @returns file
   */
  private getFile(requestParams: RequestParams): Response {
    return this.getById(requestParams, "file", (id) => this.stApiModel.getFile(id));
  }

  /**
   * Get Files
   *
   * @param requestParams - Optional rows, fileTypes, dateCreated, lastModifiedDate.
   * @returns files
   */
  private getFiles(requestParams: RequestParams): Response {
    const row = requestParams.rows;
    const types = this.convertMultiSelectToArray(requestParams.fileTypes);
    const createdDate = requestParams.dateCreated;
    const modifiedDate = requestParams.lastModifiedDate;
    const result = this.stApiModel.getFiles(row, types, createdDate, modifiedDate);

    // List endpoints must return an array (legacy code used `{}` for empty).
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

    return result;
  }

  private getJob(requestParams: RequestParams): Response {
    return this.getById(requestParams, "job", (id) => this.stApiModel.getJob(id));
  }

  /**
   * Get Jobs
   *
   * @param requestParams - Optional active filter.
   * @returns jobs
   */
  private getJobs(requestParams: RequestParams): Response {
    const active = requestParams.active;
    const result = this.stApiModel.getJobs(active);

    // List endpoints must return an array (legacy model used `{}` for empty).
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

    return result;
  }

  private getIntegration(requestParams: RequestParams): Response {
    return this.getById(requestParams, "integration", (id) => this.stApiModel.getIntegration(id));
  }

  /**
   * Get Integrations
   *
   * @param requestParams - Optional active filter.
   * @returns integrations
   */
  private getIntegrations(requestParams: RequestParams): Response {
    const active = requestParams.active;
    const result = this.stApiModel.getIntegrations(active);

    if (!Array.isArray(result.data)) {
      result.data = [];
    }

    return result;
  }

  private getJobRun(requestParams: RequestParams): Response {
    return this.getById(requestParams, "job execution", (id) => this.stApiModel.getJobRun(id));
  }

  /**
   * Get Job Runs
   *
   * @param requestParams - Optional job and completed filters.
   * @returns job runs
   */
  private getJobRuns(requestParams: RequestParams): Response {
    const job = requestParams.job;
    const completed = requestParams.completed;
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
   * @param requestParams - Optional rows, active, integrationName, tokenName, users, roles, dates.
   * @returns logins
   */
  private getLogins(requestParams: RequestParams): Response {
    const rows = requestParams.rows;
    const active = requestParams.active;
    const integrationName = requestParams.integrationName;
    const tokenName = requestParams.tokenName;
    const users = this.convertMultiSelectToArray(requestParams.users);
    const roles = this.convertMultiSelectToArray(requestParams.roles);
    const dates = requestParams.dates;
    const result = this.stApiModel.getLogins(rows, active, integrationName, tokenName, users, roles, dates);

    // List endpoints must return an array (legacy model used `{}` for empty).
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

    return result;
  }

  private getRole(requestParams: RequestParams): Response {
    return this.getById(requestParams, "role", (id) => this.stApiModel.getRole(id));
  }

  /**
   * Get Roles
   *
   * @param requestParams - Optional active filter.
   * @returns roles
   */
  private getRoles(requestParams: RequestParams): Response {
    const active = requestParams.active;
    const result = this.stApiModel.getRoles(active);

    // List endpoints must return an array (legacy model used `{}` for empty).
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

    return result;
  }

  private getScript(requestParams: RequestParams): Response {
    return this.getById(requestParams, "script", (id) => this.stApiModel.getScript(id));
  }

  /**
   * Get Scripts
   *
   * @param requestParams - Optional active, versions, scriptTypes, scriptNames, owners, files.
   * @returns scripts
   */
  private getScripts(requestParams: RequestParams): Response {
    const active = requestParams.active;
    const versions = this.convertMultiSelectToArray(requestParams.versions);
    const scripttypes = this.convertMultiSelectToArray(requestParams.scriptTypes);
    const scripts = this.convertMultiSelectToArray(requestParams.scriptNames);
    const owners = this.convertMultiSelectToArray(requestParams.owners);
    const files = this.convertMultiSelectToArray(requestParams.files);
    const result = this.stApiModel.getScripts(active, versions, scripttypes, scripts, owners, files);

    // List endpoints must return an array
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

    return result;
  }

  /**
   * Get a single script log.
   *
   * @param requestParams - Must include id.
   * @returns script log
   */
  private getScriptLog(requestParams: RequestParams): Response {
    return this.getById(requestParams, "script log", (id) => this.stApiModel.getScriptLog(id));
  }

  /**
   * Get Server Script Logs
   *
   * @param requestParams - Optional rows, levels, scriptTypes, scriptNames, owners, time mode, dates, title, detail.
   * @returns script logs
   */
  private getScriptLogs(requestParams: RequestParams): Response {
    const row = requestParams.rows ? requestParams.rows : "50";
    const levels = this.convertMultiSelectToArray(requestParams.levels);
    const types = this.convertMultiSelectToArray(requestParams.scriptTypes);
    const scripts = this.convertMultiSelectToArray(requestParams.scriptNames);
    const owners = this.convertMultiSelectToArray(requestParams.owners);
    const timemode = requestParams.timeMode ? requestParams.timeMode : "now";
    let date = requestParams.dateCreated ? requestParams.dateCreated : "15";
    let customdatetime: string | null = requestParams.customDateTime;
    let customduration: string | null = requestParams.customDuration;
    const title = requestParams.title;
    const detail = requestParams.detail;

    // verify required parameters
    if (timemode === "now") {
      if (!date || date === "") {
        throw new InvalidParameterError("dateCreated", date, "Missing required parameter for 'now' time mode");
      }
      if (customdatetime) {
        log.debug({
          title: "SuiteToolsApiGet:getScriptLogs()",
          details: `Clearing 'customDateTime' since 'now' time mode`,
        });
        customdatetime = null;
      }
      if (customduration) {
        log.debug({
          title: "SuiteToolsApiGet:getScriptLogs()",
          details: `Clearing 'customDuration' for 'now' time mode`,
        });
        customduration = null;
      }
    }
    if (timemode === "custom") {
      if (!customdatetime || !customduration) {
        throw new InvalidParameterError(
          "customDateTime/customDuration",
          { customdatetime, customduration },
          "Both parameters required for 'custom' time mode",
        );
      }
      if (date && date !== "") {
        log.debug({
          title: "SuiteToolsApiGet:getScriptLogs()",
          details: `Clearing 'dateCreated' since 'custom' time mode`,
        });
        date = "";
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
    return this.getById(requestParams, "token", (id) => this.stApiModel.getToken(id));
  }

  /**
   * Get TBA access tokens with optional filters.
   * @param requestParams - Optional active, integrationName, userName, roleName.
   */
  private getTokens(requestParams: RequestParams): Response {
    const active = requestParams.active ?? "";
    const integrationName = requestParams.integrationName ?? "";
    const userName = requestParams.userName ?? "";
    const roleName = requestParams.roleName ?? "";
    const result = this.stApiModel.getTokens(active, integrationName, userName, roleName);
    if (!Array.isArray(result.data)) {
      result.data = [];
    }
    return result;
  }

  /**
   * Media URL for a file the SPA build emits, or `undefined` when it is not deployed.
   *
   * `file.load()` throws when the path does not exist, and this runs inside the settings endpoint
   * the SPA bootstraps from -- so an unguarded lookup would turn a missing asset into a dead app
   * rather than one missing link.
   *
   * @param path - app-relative file path, e.g. `dist/third-party-notices.json`
   * @returns the file's URL, or undefined if it could not be resolved
   */
  private getAppFileUrl(path: string): string | undefined {
    try {
      return this.stCommon.stLib.stLibNs.stLibNsFile.getFileUrl(path);
    } catch (err) {
      log.error({ title: `SuiteToolsApiGet:getAppFileUrl() could not resolve ${path}`, details: err });
      return undefined;
    }
  }

  /**
   * Get Settings.
   *
   * @returns settings
   */
  private getSettings(): Response {
    // load settings from the settings custom record
    //
    // A null snapshot flows through as undefined fields and is then rejected by SettingsSchema,
    // which requires `devMode: z.boolean()`. That is the intended behaviour -- the SPA bootstrap
    // should fail loudly on an uninitialised install rather than render against blanks -- but it
    // was previously incidental, a by-product of the fields being optional. Keeping the optional
    // chaining below makes the reliance on schema validation visible at the call site.
    const settings = this.stCommon.stSettings.getSettings();
    // build the settings object from this record and other sources
    const result = {
      // core configurations
      cssUrl: settings?.cssUrl,
      jsUrl: settings?.jsUrl,
      // settings
      devMode: settings?.devMode,
      notifyEmail: settings?.notifyEmail,
      // storage settings
      lastLogins: settings?.lastLogins,
      // The SPA fetches the third-party notices rather than bundling them, so it needs the file's
      // media URL. Resolved here rather than stored on the settings record like cssUrl/jsUrl:
      // those are written once by initializeApp(), which only runs when no settings record exists,
      // so a new stored field would stay empty forever on every existing install.
      noticesUrl: this.getAppFileUrl(this.stCommon.appNoticesFile),
      // system (these are all from the runtime object)
      accountId: this.stCommon.runtime.accountId,
      envType: this.stCommon.runtime.envType,
      isProduction: this.stCommon.isProduction,
      version: this.stCommon.runtime.version,
      processorCount: this.stCommon.runtime.processorCount,
      queueCount: this.stCommon.runtime.queueCount,
      appBundle: settings?.appBundle,
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

  private getUser(requestParams: RequestParams): Response {
    return this.getById(requestParams, "user", (id) => this.stApiModel.getUser(id));
  }

  /**
   * Get Users
   *
   * @param requestParams - Optional active, roles, owners.
   * @returns users
   */
  private getUsers(requestParams: RequestParams): Response {
    const active = requestParams.active;
    const roles = this.convertMultiSelectToArray(requestParams.roles);
    const supervisors = this.convertMultiSelectToArray(requestParams.owners);
    const result = this.stApiModel.getUsers(active, roles, supervisors);

    // List endpoints must return an array (legacy model used `{}` for empty).
    if (!Array.isArray(result.data)) {
      result.data = [];
    }

    return result;
  }
}
