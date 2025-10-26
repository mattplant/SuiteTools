/**
 * SuiteTools API - Model Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from 'N/log';
import * as task from 'N/task';
import type { SuiteToolsCommon } from '../common/SuiteToolsCommon';
import type { Response } from './types';
import { NotFoundError } from '@suiteworks/suitetools-shared/errors';

/**
 * SuiteTools API Model Class
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsApiModel {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Get File
   *
   * @param id - the record to return
   * @returns results
   */
  public getFile(id: string): Response {
    log.debug({ title: `SuiteToolsApiModel:getFile() initiated`, details: { id: id } });

    const response: Response = { status: 200, data: {} };
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
   * Get Files
   *
   * @param row - the number of rows to return
   * @param types - the file types
   * @param createdDate - the created date
   * @param modifiedDate - the last modified date
   * @returns results
   */
  public getFiles(row: string, types: string | string[], createdDate: string, modifiedDate: string): Response {
    const response: Response = { status: 200, data: {} };
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
      response.message = `No file records found`;
    } else {
      response.data = sqlResults;
    }

    return response;
  }

  /*
   * Intiate Job
   *
   * @param id - the job to run
   * @param data - the data to pass to the job
   *
   * @returns jobId
   */
  public initiateJob(id: string, data?: object): void {
    log.debug({ title: `SuiteToolsApiModel:initiateJob() initiated`, details: { id: id, data: data } });
    const scriptTask = task.create({
      taskType: task.TaskType.MAP_REDUCE,
      scriptId: 'customscript_idev_suitetools_mr_jobs_run',
      deploymentId: 'customdeploy_idev_suitetools_mr_jobs_run',
      params: {
        custscript_idev_st_mr_jobs_id: id,
        custscript_idev_st_mr_jobs_data: data ? JSON.stringify(data) : null,
      },
    });
    const scriptTaskId = scriptTask.submit();
    log.debug({
      title: 'SuiteToolsApiModel:initiateJob() submitted run job map/reduce script',
      details: 'scriptTaskId = ' + scriptTaskId,
    });
  }

  /**
   * Get Job
   *
   * @param id - the record to return
   * @returns results
   */
  public getJob(id: string): Response {
    const response: Response = { status: 200, data: {} };
    const customRecord = 'customrecord_idev_suitetools_job';
    const sql = `SELECT
      ${customRecord}.id,
      ${customRecord}.name,
      ${customRecord}.isinactive,
      ${customRecord}.custrecord_idev_st_mr_job_config as config,
      ${customRecord}.custrecord_idev_st_mr_job_desc as description,
      ${customRecord}.custrecord_idev_st_mr_job_scheduled as scheduled,
      ${customRecord}.custrecord_idev_st_mr_job_notify as notify,
    FROM
      ${customRecord}
    WHERE
      ${customRecord}.id = ${id}`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No job found with id of ${id}`;
    } else {
      response.data = sqlResults[0];
    }

    return response;
  }

  /**
   * Get Jobs
   *
   * @param active - the active flag
   * @returns results
   */
  public getJobs(active: string): Response {
    const response: Response = { status: 200, data: {} };
    const customRecord = 'customrecord_idev_suitetools_job';
    let sql = `SELECT
      ${customRecord}.id,
      ${customRecord}.name,
      ${customRecord}.isinactive,
      ${customRecord}.custrecord_idev_st_mr_job_config as config,
      ${customRecord}.custrecord_idev_st_mr_job_desc as description,
    FROM
      ${customRecord}`;

    // add where clause
    const where = [];
    if (active) {
      if (active === 'T') {
        where.push(`isinactive = 'F'`);
      } else {
        where.push(`isinactive = 'T'`);
      }
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    sql += ` ORDER BY ${customRecord}.id ASC`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No job records found`;
    } else {
      response.data = sqlResults;
    }

    return response;
  }

  /**
   * Get Role
   *
   * @param id - the id of the record
   * @returns Role
   */
  public getRole(id: string): Response {
    const response: Response = { status: 200, data: {} };
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
      throw new NotFoundError('Role', id);
    } else {
      response.data = sqlResults[0];
    }

    return response;
  }

  /**
   * Get Roles
   *
   * @param status - the status of the record
   * @returns roles
   */
  public getRoles(active: string): Response {
    const response: Response = { status: 200, data: {} };
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
      } else {
        where.push(`role.isinactive = 'T'`);
      }
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    sql += ` ORDER BY role.name`;

    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No role records found`;
    } else {
      response.data = sqlResults;
    }

    return response;
  }

  /**
   * Get Script
   *
   * @param id - the record to return
   * @returns results
   */
  public getScript(id: string): Response {
    const response: Response = { status: 200, data: {} };
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
    const response: Response = { status: 200, data: {} };
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
      } else {
        where.push(`script.isinactive = 'T'`);
      }
    }
    if (versions && Array.isArray(versions)) {
      where.push(`apiversion IN (${versions.join(',')})`);
    }
    if (types && Array.isArray(types)) {
      const typeList = types.map((type) => `'${type.toUpperCase()}'`);
      where.push(`scripttype IN (${typeList.join(',')})`);
    }
    if (scripts && Array.isArray(scripts)) {
      const scriptList = scripts.map((script) => `'${script.toUpperCase()}'`);
      where.push(`script.id IN (${scriptList.join(',')})`);
    }
    if (owners && Array.isArray(owners)) {
      const ownerList = owners.map((owner) => `'${owner.toUpperCase()}'`);
      where.push(`owner IN (${ownerList.join(',')})`);
    }
    if (files && Array.isArray(files)) {
      const fileList = files.map((file) => `'${file.toUpperCase()}'`);
      where.push(`file.id IN (${fileList.join(',')})`);
    }
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

    return response;
  }

  /**
   * Get User
   *
   * @param id - the record id to return
   * @returns user
   */
  public getUser(id: string): Response {
    const response: Response = { status: 200, data: {} };
    let sql = `SELECT
      employee.id,
      employee.isinactive,
      employee.email,
      employee.entityid AS name,
      BUILTIN.DF( employee.supervisor ) AS supervisor,
      employee.title
    FROM employee
      INNER JOIN employeerolesforsearch ON ( employeerolesforsearch.entity = employee.id )
      INNER JOIN role ON ( role.id = employeerolesforsearch.role )
    WHERE
      employee.id = ${id}
    GROUP BY
      employee.id,
      employee.isinactive,
      employee.email,
      employee.entityid,
      BUILTIN.DF( employee.supervisor ),
      employee.title`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.status = 404;
      response.message = `No user found with id of ${id}`;
    } else {
      response.data = sqlResults[0];
    }

    return response;
  }

  /**
   * Get Users
   *
   * @returns results
   */
  public getUsers(active: string, roles?: string[], supervisors?: string[]): Response {
    const response: Response = { status: 200, data: {} };
    let sql = `SELECT
      employee.id,
      employee.isinactive,
      employee.email,
      employee.entityid AS name,
      employee.title,
      MAX(BUILTIN.DF( employee.supervisor )) AS supervisor
      FROM employee
      INNER JOIN employeerolesforsearch ON ( employeerolesforsearch.entity = employee.id )
      INNER JOIN role ON ( role.id = employeerolesforsearch.role )`;

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
    if (roles && Array.isArray(roles)) {
      const roleList = roles.map((role) => role);
      where.push(`role.id IN (${roleList.join(',')})`);
    }
    if (supervisors && Array.isArray(supervisors)) {
      const supervisorList = supervisors.map((supervisor) => supervisor);
      where.push(`employee.supervisor IN (${supervisorList.join(',')})`);
    }

    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }

    sql += ` GROUP BY
      employee.id,
      employee.isinactive,
      employee.email,
      employee.entityid,
      employee.title
    ORDER BY employee.entityid`;

    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No user records found`;
    } else {
      response.data = sqlResults;
    }

    return response;
  }

  /**
   * Get Script Log
   *
   * @param id - the record id to return
   * @returns script log
   */
  public getScriptLog(id: string): Response {
    const response: Response = { status: 200, data: {} };
    const sql = `SELECT
      ScriptNote.internalid AS id,
      TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD HH24:MI:SS' ) AS timestamp,
      ScriptNote.type,
      script.scripttype,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      BUILTIN.DF( script.name ) || ' (' || script.id  || ')' AS scriptname,
      ScriptNote.title, REPLACE( ScriptNote.detail, '"', '""' ) AS detail
    FROM ScriptNote
    INNER JOIN script
      ON ScriptNote.scripttype = script.id
    WHERE ScriptNote.internalid = ${id}`;
    log.debug({ title: `SuiteToolsApiModel:getScriptLog() generated this sql`, details: sql });
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
   * @param row - the number of rows to return
   * @param levels - type of log (e.g. debug, error, ...)
   * @param types - types of script
   * @param scripts - the scripts to return records for
   * @param owners - the script owners to return records for
   * @param timemode - the time mode (now or custom)
   * @param date - the dates to return records for
   * @param customdatetime - the custom date and time to return records for
   * @param customduration - the custom duration to return records for
   * @param title - the title contains this string
   * @param detail - the detail contains this string
   * @returns script logs
   */
  public getScriptLogsViaSuiteQL(
    row: string,
    levels: string[],
    types: string[],
    scripts: string[],
    owners: string[],
    timemode: string,
    date: string,
    customdatetime: string,
    customduration: string,
    title: string,
    detail: string,
  ): Response {
    const response: Response = { status: 200, data: {} };
    let sql = `SELECT
      ScriptNote.internalid AS id,
      TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD HH24:MI:SS' ) AS timestamp,
      ScriptNote.type,
      script.scripttype,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      BUILTIN.DF( script.name ) || ' (' || script.id  || ')' AS scriptname,
      ScriptNote.title, REPLACE( ScriptNote.detail, '"', '""' ) AS detail
    FROM ScriptNote
    INNER JOIN script
      ON ScriptNote.scripttype = script.id`;

    const where: string[] = [];
    if (row && row !== '0') {
      where.push(`RowNum <= ${row}`);
    }
    if (levels && Array.isArray(levels)) {
      const levelList = levels.map((type) => `'${type.toUpperCase()}'`);
      where.push(`ScriptNote.type IN (${levelList.join(',')})`);
    }
    if (types && Array.isArray(types)) {
      const typeList = types.map((type) => `'${type.toUpperCase()}'`);
      where.push(`script.scripttype IN (${typeList.join(',')})`);
    }
    if (scripts && Array.isArray(scripts)) {
      where.push(`ScriptNote.scriptType IN (${scripts.join(',')})`);
    }
    if (owners && Array.isArray(owners)) {
      const ownerList = owners.map((owner) => `'${owner.toUpperCase()}'`);
      where.push(`owner IN (${ownerList.join(',')})`);
    }
    if (title) {
      where.push(`ScriptNote.title LIKE '%${title}%'`);
    }
    if (detail) {
      where.push(`ScriptNote.detail LIKE '%${detail}%'`);
    }

    // Add date/time filtering
    if (timemode === 'now' && date) {
      // Filter by relative time from now (e.g., last 15 minutes)
      // NetSuite uses fractional days: minutes / 1440 (minutes in a day)
      const minutes = parseInt(date, 10);
      if (!isNaN(minutes) && minutes > 0) {
        where.push(`ScriptNote.date >= (SYSDATE - ${minutes} / 1440)`);
      }
    } else if (timemode === 'custom' && customdatetime && customduration) {
      // Filter by custom datetime and duration
      // NetSuite uses fractional days: minutes / 1440 (minutes in a day)
      const duration = parseInt(customduration, 10);
      if (!isNaN(duration) && duration > 0) {
        where.push(`ScriptNote.date >= (TO_DATE('${customdatetime}', 'YYYY-MM-DD HH24:MI:SS') - ${duration} / 1440)`);
        where.push(`ScriptNote.date <= TO_DATE('${customdatetime}', 'YYYY-MM-DD HH24:MI:SS')`);
      }
    }

    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    sql += ` ORDER BY ScriptNote.date DESC`;

    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No script log records found`;
    } else {
      response.data = sqlResults;
    }

    return response;
  }

  // Additional methods exist in the original implementation:
  // - getJobRun, getJobRuns
  // - getLogins, getRoles, getScripts
  // - getScriptLog
  // These would be added in the complete implementation

  /**
   * Add Date Filter
   *
   * @param where - the where clause
   * @param functionName - the function name
   * @param table - the table name
   * @param field - the field name
   * @param dates - the dates
   */
  private addDateFilter(
    where: string[],
    functionName: string,
    table: string,
    field: string,
    dates: string | string[],
  ): void {
    // Simplified date filter implementation
    // Full implementation would handle various date formats and ranges
    if (dates && dates !== '') {
      if (typeof dates === 'string') {
        switch (dates) {
          case 'today':
            where.push(`TO_CHAR ( ${field}, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE, 'YYYY-MM-DD')`);
            break;
          case 'yesterday':
            where.push(`TO_CHAR ( ${field}, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE - 1, 'YYYY-MM-DD')`);
            break;
          default:
            // Handle other date formats as needed
            break;
        }
      }
    }
  }

  /**
   * Get Job Run
   *
   * @param id - the record id to return
   * @returns results
   */
  public getJobRun(id: string): Response {
    const response: Response = { status: 200, data: {} };
    const customRecord = 'customrecord_idev_suitetools_job_run';
    const sql = `SELECT
      ${customRecord}.id,
      TO_CHAR ( ${customRecord}.created, 'YYYY-MM-DD HH24:MI:SS' ) AS created,
      ${customRecord}.custrecord_idev_st_mr_job_run_job_id as jobId,
      customrecord_idev_suitetools_job.name as jobName,
      ${customRecord}.custrecord_idev_st_mr_job_run_completed AS completed,
      ${customRecord}.custrecord_idev_st_mr_job_run_results AS results
    FROM
      ${customRecord}
    INNER JOIN customrecord_idev_suitetools_job
      ON customrecord_idev_suitetools_job_run.custrecord_idev_st_mr_job_run_job_id = customrecord_idev_suitetools_job.id
    WHERE
      ${customRecord}.id = ${id}`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No job execution found with id of ${id}`;
    } else {
      response.data = sqlResults[0];
    }

    return response;
  }

  /**
   * Get Job Runs
   *
   * @param job - the specific job to see the executions of
   * @param completed - the completed status
   * @returns results
   */
  public getJobRuns(job: string, completed: string): Response {
    const response: Response = { status: 200, data: {} };
    const customRecord = 'customrecord_idev_suitetools_job_run';
    let sql = `SELECT
      ${customRecord}.id,
      TO_CHAR ( ${customRecord}.created, 'YYYY-MM-DD HH24:MI:SS' ) AS created,
      ${customRecord}.custrecord_idev_st_mr_job_run_job_id as jobId,
      customrecord_idev_suitetools_job.name as jobName,
      ${customRecord}.custrecord_idev_st_mr_job_run_completed AS completed,
      ${customRecord}.custrecord_idev_st_mr_job_run_results AS results
    FROM
      ${customRecord}
    INNER JOIN customrecord_idev_suitetools_job
      ON customrecord_idev_suitetools_job_run.custrecord_idev_st_mr_job_run_job_id = customrecord_idev_suitetools_job.id`;
    // add where clause
    const where = [];
    if (job) {
      where.push(`${customRecord}.custrecord_idev_st_mr_job_run_job_id = ${job}`);
    }
    if (completed) {
      where.push(`${customRecord}.custrecord_idev_st_mr_job_run_completed = '${completed}'`);
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    sql += ` ORDER BY ${customRecord}.id DESC`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No job execution records found`;
    } else {
      response.data = sqlResults;
    }

    return response;
  }

  /**
   * Get Logins
   *
   * @param rows - the number of rows to return
   * @param active - the active flag
   * @param integrationName - the integration name
   * @param tokenName - the token name
   * @param users - the users
   * @param roles - the roles
   * @param dates - the date range
   * @returns results
   */
  public getLogins(
    rows: string,
    active: string,
    integrationName: string,
    tokenName: string,
    users: string[],
    roles: string[],
    dates: string,
  ): Response {
    log.debug({
      title: `SuiteToolsApiModel:getLogins() initiated`,
      details: {
        rows: rows,
        active: active,
        integrationName: integrationName,
        tokenName: tokenName,
        users: users,
        roles: roles,
        dates: dates,
      },
    });

    const response: Response = { status: 200, data: {} };
    let sql = `SELECT
      TO_CHAR ( loginAudit.date, 'YYYY-MM-DD HH24:MI:SS' ) AS date,
      loginAudit.status,
      loginAudit.oAuthAppName,
      loginAudit.oAuthAccessTokenName,
      loginAudit.user,
      BUILTIN.DF( loginAudit.user ) AS userName,
      loginAudit.role,
      BUILTIN.DF( loginAudit.role ) AS roleName,
      loginAudit.emailAddress,
      loginAudit.ipAddress,
      loginAudit.requestUri,
      loginAudit.detail,
      loginAudit.secChallenge,
      loginAudit.userAgent
    FROM
      loginAudit`;
    // add where clause
    const where = [];
    if (rows) {
      // limit to specified number of rows
      where.push(`RowNum <= ${rows}`);
    }
    if (active) {
      if (active === 'T') {
        where.push(`loginAudit.status = 'Success'`);
      } else {
        where.push(`loginAudit.status = 'Failure'`);
      }
    }
    if (integrationName) {
      where.push(`loginAudit.oAuthAppName = '${integrationName}'`);
    }
    if (tokenName) {
      where.push(`loginAudit.oAuthAccessTokenName = '${tokenName}'`);
    }
    if (users) {
      if (Array.isArray(users)) {
        users = users.map((user) => {
          return user;
        });
        where.push(`loginAudit.user IN (${users.join(',')})`);
      }
    }
    if (roles) {
      if (Array.isArray(roles)) {
        roles = roles.map((role) => {
          return role;
        });
        where.push(`loginAudit.role IN (${roles.join(',')})`);
      }
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    // add order by
    sql += ` ORDER BY loginAudit.date DESC`;

    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length === 0) {
      response.message = `No login audit records found`;
    } else {
      response.data = sqlResults;
    }

    return response;
  }
}
