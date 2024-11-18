/**
 * SuiteTools Model
 *
 * This script that handles the data logic.
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

import log = require('N/log');
// import search = require('N/search');
// import task = require('N/task');

import { SuiteToolsApp } from './idev-suitetools-app';

/**
 * SuiteTools Model
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsModel {
  private _stApp: SuiteToolsApp;

  get stApp(): SuiteToolsApp {
    return this._stApp;
  }

  constructor(stApp: SuiteToolsApp) {
    // log.debug({ title: 'SuiteToolsModel:constructor() initiated', details: null });
    this._stApp = stApp;
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
  //     title: `SuiteToolsModel:getJobs() initiated`,
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
  //   const results = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
  //   log.debug({ title: 'SuiteToolsModel:getJobs() returning', details: results });

  //   return results;
  // }

  /**
   * Get Job
   *
   * @param id - the record to return
   * @returns results
   */
  // public getJob(id: number) {
  //   log.debug({ title: `SuiteToolsModel:getJob() initiated`, details: { id: id } });

  //   const sql = `SELECT
  //     id,
  //   FROM
  //     customrecord_idev_suitetools_job
  //   WHERE
  //     id = ${id}`;
  //   const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
  //   let result = null;
  //   if (sqlResults.length === 0) {
  //     this.stApp.setAlert('No results found that matched criteria.');
  //   } else {
  //     result = sqlResults[0];
  //   }
  //   log.debug({ title: 'SuiteToolsModel:getJob() returning', details: result });

  //   return result;
  // }

  /*
   * Initiate Job
   *
   * @returns jobId
   */
  // public initiateJob(): number {
  //   log.debug({ title: `SuiteToolsModel:initiateJob() initiated`, details: null });

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

  //   const jobId = this.stApp.stLib.stLibNs.stLibNsRecord.createCustomRecord('customrecord_idev_suitetools_job', {
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
   * @param rows - the number of rows to return
   * @param types - the file types
   * @param versions - the API versions
   * @returns results
   */
  // public getFiles(
  //   rows: string,
  //   types: string | string[],
  //   createdDates: string,
  //   modifiedDates: string
  // ) {
  //   log.debug({
  //     title: `SuiteToolsModel:getFiles() initiated`,
  //     details: {
  //       rows: rows,
  //       types: types,
  //       createdDates: createdDates,
  //       modifiedDates: modifiedDates,
  //     },
  //   });
  //   let sql = `SELECT
  //     file.id,
  //     file.folder,
  //     file.createddate,
  //     file.lastmodifieddate,
  //     file.filetype,
  //     BUILTIN.DF(file.filetype) AS filetypename,
  //     file.name || ' (' || file.id  || ')' AS name,
  //     file.filesize,
  //     file.description,
  //     file.url
  //   FROM
  //     file`;
  //   // add where clause
  //   const where = [];
  //   if (rows) {
  //     // limit to specified number of rows
  //     where.push(`RowNum <= ${rows}`);
  //   }
  //   if (types) {
  //     if (Array.isArray(types)) {
  //       types = types.map((type) => {
  //         return `'${type.toUpperCase()}'`;
  //       });
  //       where.push(`filetype IN (${types.join(',')})`);
  //     }
  //   }
  //   if (createdDates) {
  //     switch (createdDates) {
  //       case '15':
  //         where.push('createddate > SYSDATE - ( 15 / 1440 )');
  //         break;
  //       case '60':
  //         where.push('createddate > SYSDATE - ( 1 / 24 )');
  //         break;
  //       case 'today':
  //         where.push("TO_CHAR ( createddate, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE, 'YYYY-MM-DD')");
  //         break;
  //       case 'yesterday':
  //         where.push("TO_CHAR ( createddate, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE - 1, 'YYYY-MM-DD')");
  //         break;
  //       default:
  //         log.error({ title: `SuiteToolsModel:getFiles() invalid date option`, details: createdDates });
  //         break;
  //     }
  //   }
  //   if (modifiedDates) {
  //     switch (modifiedDates) {
  //       case '15':
  //         where.push('lastmodifieddate > SYSDATE - ( 15 / 1440 )');
  //         break;
  //       case '60':
  //         where.push('lastmodifieddate > SYSDATE - ( 1 / 24 )');
  //         break;
  //       case 'today':
  //         where.push("TO_CHAR ( lastmodifieddate, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE, 'YYYY-MM-DD')");
  //         break;
  //       case 'yesterday':
  //         where.push("TO_CHAR ( lastmodifieddate, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE - 1, 'YYYY-MM-DD')");
  //         break;
  //       default:
  //         log.error({ title: `SuiteToolsModel:getFiles() invalid date option`, details: modifiedDates });
  //         break;
  //     }
  //   }
  //   if (where.length > 0) {
  //     sql += ` WHERE ${where.join(' AND ')}`;
  //   }
  //   // add order by
  //   sql += ` ORDER BY name ASC`;
  //   const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);

  //   return sqlResults;
  // }

  /**
   * Get File
   *
   * @param id - the record to return
   * @returns results
   */
  // public getFile(id: string) {
  //   log.debug({ title: `SuiteToolsModel:getFile() initiated`, details: { id: id } });

  //   const sql = `SELECT
  //     file.id,
  //     file.isinactive,
  //     file.folder,
  //     file.createddate,
  //     file.lastmodifieddate,
  //     file.filetype,
  //     file.name || ' (' || file.id  || ')' AS name,
  //     file.filesize,
  //     file.description,
  //     file.url
  //   FROM
  //     file
  //   WHERE
  //     file.id = ${id}`;
  //   const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
  //   let result = null;
  //   if (sqlResults.length === 0) {
  //     this.stApp.setAlert('No results found that matched criteria.');
  //   } else {
  //     result = sqlResults[0];
  //   }
  //   log.debug({ title: 'SuiteToolsModel:getFile() returning', details: result });

  //   return result;
  // }

  /**
   * Get script type list
   *
   * @returns script types
   */
  public getScriptTypeList() {
    // log.debug({ title: `SuiteToolsModel:getScriptTypeList() initiated`, details: { activeOnly: activeOnly } });

    const sql = 'SELECT scriptType.id, scriptType.name FROM scriptType ORDER BY name';
    const results = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);

    return results;
  }

  /**
   * Get script list
   *
   * @param [activeOnly]
   * @returns scripts
   */
  public getScriptList(activeOnly?: boolean) {
    log.debug({ title: `SuiteToolsModel:getScriptList() initiated`, details: { activeOnly: activeOnly } });
    let sql = `SELECT
      script.id,
      script.name
    FROM
      script`;
    if (activeOnly) {
      sql += ` WHERE isinactive = 'F'`;
    }
    sql += ` ORDER BY name ASC`;
    const results = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);

    return results;
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
  ) {
    log.debug({
      title: `SuiteToolsModel:getScripts() initiated`,
      details: { active: active, versions: versions, types: types, scripts: scripts, owners: owners, files: files },
    });

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
    const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);

    return sqlResults;
  }

  /**
   * Get Script
   *
   * @param id - the record to return
   * @returns results
   */
  public getScript(id: string) {
    log.debug({ title: `SuiteToolsModel:getScript() initiated`, details: { id: id } });

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
    const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
    let result = null;
    // if (sqlResults.length === 0) {
    //   this.stApp.setAlert('No results found that matched criteria.');
    // } else {
    result = sqlResults[0];
    // }
    log.debug({ title: 'SuiteToolsModel:getScript() returning', details: result });

    return result;
  }

  /**
   * Get integration list
   *
   * @returns integrations
   */
  // public getIntegrationList() {
  //   // log.debug({ title: `SuiteToolsModel:getIntegrationList() initiated`, details: null });

  //   const results = this.stApp.stAppSettings.integrations;
  //   // log.debug({ title: 'SuiteToolsModel:getIntegrationList returning', details: results });

  //   return results;
  // }

  /**
   * Get Integrations
   *
   * @param [status] - the status of the records
   * @returns integrations
   */
  // public getIntegrations(
  //   status: string = null
  // ) {
  //   log.debug({
  //     title: `SuiteToolsModel:getIntegrations() initiated`,
  //     details: {
  //       status: status,
  //     },
  //   });

  //   let results = this.stApp.stAppSettings.integrations;

  //   if (results && status) {
  //     // filter results for status
  //     results = results.filter((result) => result.active == status);
  //   }

  //   log.debug({ title: 'SuiteToolsModel:getIntegrations() returning', details: results });

  //   return results;
  // }

  /**
   * Get Integration
   *
   * @param id - the id of the record
   * @returns integration
   */
  // public getIntegration(id: string) {
  //   log.debug({ title: `SuiteToolsModel:getIntegration() initiated`, details: { id: id } });

  //   const results = this.stApp.stAppSettings.integrations;
  //   const resultsFiltered = results.filter((result) => result.id == id);
  //   let result = null;
  //   if (resultsFiltered.length === 0) {
  //     this.stApp.setAlert('No results found that matched criteria.');
  //   } else {
  //     result = resultsFiltered[0];
  //   }
  //   log.debug({ title: 'SuiteToolsModel:getIntegration() returning', details: result });

  //   return result;
  // }

  /**
   * Get token list
   *
   * @param [activeOnly]
   * @returns users
   */
  // public getTokenList(activeOnly = false) {
  //   // log.debug({ title: `SuiteToolsModel:getTokenList() initiated`, details: { activeOnly: activeOnly } });

  //   let results = this.stApp.stAppSettings.tokens;
  //   if (results && activeOnly) {
  //     results = results.filter((result) => result.active == 'T');
  //   }
  //   // log.debug({ title: 'SuiteToolsModel:getIntegrationList returning', details: results });

  //   return results;
  // }

  /**
   * Get Tokens
   *
   * @param status
   * @returns tokens
   */
  // public getTokens(
  //   active: string,
  //   integration: string,
  //   user: string,
  //   role: string
  // ) {
  //   log.debug({
  //     title: `SuiteToolsModel:getTokens() initiated`,
  //     details: {
  //       active: active,
  //       integration: integration,
  //       user: user,
  //       role: role,
  //     },
  //   });

  //   let tokens = this.stApp.stModel.getTokenList();
  //   // log.debug({ title: `SuiteToolsModel:getTokens() unfiltered tokens =`, details: tokens });
  //   if (tokens) {
  //     if (active) {
  //       tokens = tokens.filter((result) => result.active == active);
  //     }
  //     if (integration) {
  //       tokens = tokens.filter((result) => result.integrationId == integration);
  //     }
  //     if (user) {
  //       // // do we have a numeric id or a string name
  //       // if (!isNaN(parseInt(user))) {
  //       //   // build the name string
  //       //   // TODO optimize this
  //       //   const userObj = this.getUser(user);
  //       //   if (userObj) {
  //       //     log.debug({ title: `SuiteToolsModel:getTokens() userObj =`, details: userObj });
  //       //     // need to handle the case where the user has no first or last name
  //       //     const firstName = userObj.firstname ? userObj.firstname : '';
  //       //     const lastName = userObj.lastname ? userObj.lastname : '';
  //       //     user = `${firstName} ${lastName}`.trim();
  //       //     user += ` (${userObj.id})`;
  //       //   }
  //       // }
  //       log.debug({ title: `SuiteToolsModel:getTokens() filtering for user`, details: user });
  //       tokens = tokens.filter((result) => result.userId == user);
  //     }
  //     if (role) {
  //       tokens = tokens.filter((result) => result.roleId == role);
  //     }
  //     log.debug({ title: 'SuiteToolsModel:getTokens() returning', details: tokens });
  //   }
  //   return tokens;
  // }

  /**
   * Get Token
   *
   * @param id - the id of the record
   * @returns Token
   */
  // public getToken(id: string) {
  //   // log.debug({ title: `SuiteToolsModel:getToken() initiated`, details: { id: id } });

  //   const resultsFiltered = this.stApp.stModel.getTokenList().filter((result) => result.id == id);
  //   const result = resultsFiltered ? resultsFiltered[0] : null;
  //   if (!result) {
  //     this.stApp.setAlert('No results found that matched criteria.');
  //   }
  //   log.debug({ title: 'SuiteToolsModel:getToken() returning', details: result });

  //   return result;
  // }

  /**
   * Get role list
   *
   * @param [activeOnly]
   * @returns roles
   */
  // public getRoleList(activeOnly = false) {
  //   // log.debug({ title: `SuiteToolsModel:getRoleList() initiated`, details: { activeOnly: activeOnly } });

  //   let sql = `SELECT
  //     role.id,
  //     role.name
  //   FROM
  //     role`;
  //   if (activeOnly) {
  //     sql += ` WHERE isInactive = 'F'`;
  //   }
  //   sql += ` ORDER BY role.name`;
  //   const results = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
  //   // log.debug({ title: 'SuiteToolsModel:getRoleList returning', details: results });

  //   return results;
  // }

  /**
   * Get Roles
   *
   * @param status - the status of the login
   * @returns roles
   */
  // public getRoles(
  //   active: string
  // ) {
  //   log.debug({
  //     title: `SuiteToolsModel:getRoles() initiated`,
  //     details: {
  //       active: active,
  //     },
  //   });

  //   let sql = `SELECT
  //     role.id,
  //     role.scriptId,
  //     role.name,
  //     role.name || ' (' || role.id  || ')' AS nameId,
  //     role.centerType,
  //     role.isInactive,
  //     role.isSalesRole,
  //     role.isSupportRole,
  //     role.isWebServiceOnlyRole
  //   FROM
  //     role`;
  //   // add where clause
  //   const where = [];
  //   if (active) {
  //     if (active === 'T') {
  //       where.push(`role.isinactive = 'F'`);
  //     }
  //     if (active === 'F') {
  //       where.push(`role.isinactive = 'T'`);
  //     }
  //   }
  //   if (where.length > 0) {
  //     sql += ` WHERE ${where.join(' AND ')}`;
  //   }
  //   // add order by
  //   sql += ` ORDER BY role.name`;
  //   const results = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
  //   log.debug({ title: 'SuiteToolsModel:getRoles() returning', details: results });

  //   return results;
  // }

  /**
   * Get Role
   *
   * @param id - the id of the record
   * @returns Role
   */
  // public getRole(id: string) {
  //   log.debug({ title: `SuiteToolsModel:getRole() initiated`, details: { id: id } });

  //   const sql = `SELECT
  //     role.id,
  //     role.scriptId,
  //     role.name,
  //     role.name || ' (' || role.id  || ')' AS nameId,
  //     role.centerType,
  //     role.isInactive,
  //     role.isSalesRole,
  //     role.isSupportRole,
  //     role.isWebServiceOnlyRole
  //   FROM
  //     role
  //   WHERE
  //     role.id = ${id}`;
  //   const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
  //   let result = null;
  //   if (sqlResults.length === 0) {
  //     this.stApp.setAlert('No results found that matched criteria.');
  //   } else {
  //     result = sqlResults[0];
  //   }
  //   log.debug({ title: 'SuiteToolsModel:getRole() returning', details: result });

  //   return result;
  // }

  /**
   * Get Users
   *
   * @returns results
   */
  // public getUsers(
  //   role: string,
  //   supervisor: string
  // ) {
  //   log.debug({
  //     title: `SuiteToolsModel:getUsers() initiated`,
  //     details: { role: role, supervisor: supervisor },
  //   });

  //   let results = this.stApp.stAppSettings.users;
  //   log.debug({ title: 'SuiteToolsModel:getUsers() unfiltered users', details: results });
  //   if (role) {
  //     const tempResults = [];
  //     for (const result of results) {
  //       // add user if role id of (role) is present
  //       const roleIdsObj = JSON.parse(result.roleIds);
  //       roleIdsObj.forEach((roleId) => {
  //         if (roleId == role) {
  //           tempResults.push(result);
  //         }
  //       });
  //     }
  //     results = tempResults;
  //   }
  //   if (supervisor) {
  //     results = results.filter((result) => result.supervisorid == supervisor);
  //   }
  //   log.debug({ title: 'SuiteToolsModel:getUsers() returning', details: results });

  //   return results;
  // }

  /**
   * Get User
   *
   * @param id - the record id to return
   * @returns user
   */
  // public getUser(id: string) {
  //   log.debug({ title: `SuiteToolsModel:getUser() initiated`, details: { id: id } });

  //   const sql = `SELECT
  //     employee.id,
  //     employee.entityid,
  //     employee.firstname,
  //     employee.lastname,
  //     employee.email,
  //     BUILTIN.DF( employee.supervisor ) AS supervisorname,
  //     employee.supervisor AS supervisorid,
  //     employee.title,
  //     employee.isinactive,
  //   FROM
  //     employee
  //   WHERE
  //     employee.id = ${id}`;
  //   const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
  //   let result = null;
  //   if (sqlResults.length === 0) {
  //     this.stApp.setAlert('No results found that matched criteria.');
  //   } else {
  //     result = sqlResults[0];
  //   }

  //   // const results = this.stApp.stAppSettings.users;
  //   // log.debug({ title: 'SuiteToolsModel:getUser() unfiltered users', details: results });
  //   // const resultsFiltered = results.filter((result) => result.id == id);
  //   // const result = resultsFiltered ? resultsFiltered[0] : null;
  //   // if (!result) {
  //   //   this.stApp.setAlert('No results found that matched criteria.');
  //   // }

  //   log.debug({ title: 'SuiteToolsModel:getUser() returning', details: result });

  //   return result;
  // }

  /**
   * Get users from integration data.
   *
   * @returns results
   */
  // public getUsersIntegration(
  //   role: string,
  //   supervisor: string
  // ) {
  //   log.debug({
  //     title: `SuiteToolsModel:getUsersIntegration() initiated`,
  //     details: { role: role, supervisor: supervisor },
  //   });

  //   let results = this.stApp.stAppSettings.users;
  //   log.debug({ title: 'SuiteToolsModel:getUsersIntegration() unfiltered users', details: results });
  //   if (role) {
  //     const tempResults = [];
  //     for (const result of results) {
  //       // add user if role id of (role) is present
  //       const roleIdsObj = JSON.parse(result.roleIds);
  //       roleIdsObj.forEach((roleId) => {
  //         if (roleId == role) {
  //           tempResults.push(result);
  //         }
  //       });
  //     }
  //     results = tempResults;
  //   }
  //   if (supervisor) {
  //     results = results.filter((result) => result.supervisorid == supervisor);
  //   }
  //   log.debug({ title: 'SuiteToolsModel:getUsersIntegration() returning', details: results });

  //   return results;
  // }

  /**
   * Get Users Roles
   *
   * @returns users roles matrix
   */
  // public getUsersRoles() {
  //   log.debug({
  //     title: `SuiteToolsModel:getUsersRoles() initiated`,
  //     details: null,
  //   });

  //   const sql = `SELECT
  //       Employee.id,
  //       Employee.entityId,
  //       Role.id as roleId,
  //       Role.name AS roleName,
  //     FROM
  //       Employee
  //       INNER JOIN EmployeeRolesForSearch ON
  //         ( EmployeeRolesForSearch.entity = Employee.id )
  //       INNER JOIN Role ON
  //         ( Role.ID = EmployeeRolesForSearch.role ) AND ( Role.isInactive = 'F' )
  //     ORDER BY
  //       Employee.entityId ASC`;
  //   const results = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
  //   // log.debug({ title: 'SuiteToolsModel:getUsersRoles() returning', details: results });

  //   return results;
  // }

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
  //     title: `SuiteToolsModel:getUserLogins() initiated`,
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
  //     const integrations = this.stApp.stModel.getIntegrationList();
  //     const foundIntegration = integrations.find((record) => record['id'] == integration);
  //     let integrationName: string = foundIntegration ? foundIntegration.name : 'INTEGRATION_NOT_FOUND';
  //     // switch integration name to match what is on the login audit record
  //     if (integrationName === 'SuiteCloud IDE & CLI') {
  //       this.stApp.setAlert(
  //         'Note that "SuiteCloud IDE & CLI" Integration is listed as "SuiteCloud Development Integration" in the login audit table.'
  //       );
  //       integrationName = 'SuiteCloud Development Integration';
  //     }
  //     // add integration name to where clause
  //     where.push(`LoginAudit.oAuthAppName = '${integrationName}'`);
  //   }
  //   if (token) {
  //     // lookup token name from id
  //     const tokens = this.stApp.stModel.getTokenList();
  //     const foundToken = tokens.find((record) => record['id'] == token);
  //     const tokenName: string = foundToken ? foundToken.name : 'TOKEN_NOT_FOUND';
  //     // // switch token name to match what is on the login audit record
  //     // if (tokenName === 'SuiteCloud IDE & CLI') {
  //     //   this.stApp.setAlert(
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
  //         log.error({ title: `SuiteToolsModel:getUserLogins() invalid date option`, details: dates });
  //         break;
  //     }
  //   }
  //   if (where.length > 0) {
  //     sql += ` WHERE ${where.join(' AND ')}`;
  //   }
  //   // add order by
  //   sql += ` ORDER BY LoginAudit.date DESC`;
  //   const results = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);

  //   log.debug({ title: 'SuiteToolsModel:getUserLogins() returning', details: results });

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
  //     title: `SuiteToolsModel:getScriptLogsViaSearch() initiated`,
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
  //   const searchResults = this.stApp.stLib.stLibNs.stLibNsSearch.search(
  //     'scriptexecutionlog',
  //     columns,
  //     filters,
  //     rows,
  //     true
  //   );

  //   // get list of active users so that we can determine user ids
  //   const userList = this.stApp.stModel.getEmployeeList(true);

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

  //   log.debug({ title: 'SuiteToolsModel:getScriptLogsViaSearch() returning', details: results });

  //   return results;
  // }

  /**
   * Get employee list
   *
   * @param [activeOnly]
   * @returns employees
   */
  public getEmployeeList(activeOnly?: boolean) {
    log.debug({ title: `SuiteToolsModel:getEmployeeList() initiated`, details: { activeOnly: activeOnly } });

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
    const results = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    // log.debug({ title: 'SuiteToolsModel:getEmployeeList() returning', details: results });

    return results;
  }

  /**
   * Get Employees
   *
   * @returns results
   */
  // public getEmployees(
  //   active: string,
  //   role: string,
  //   supervisors: string[]
  // ) {
  //   log.debug({
  //     title: `SuiteToolsModel:getEmployees() initiated`,
  //     details: { active: active, role: role, supervisors: supervisors },
  //   });

  //   // alternative name field: // TRIM(TRIM(employee.firstname) || ' ' || TRIM(employee.lastname)) as name,
  //   let sql = `SELECT
  //     employee.id,
  //     employee.email,
  //     employee.entityid || ' (' || employee.id || ')' AS name,
  //     employee.firstname,
  //     employee.lastname,
  //     employee.supervisor as supervisorId,
  //     BUILTIN.DF( employee.supervisor ) || ' (' || employee.supervisor  || ')' AS supervisor,
  //     employee.title,`;
  //   if (role) {
  //     sql += ` role.id AS roleId,
  //     role.name || ' (' || role.id || ')' AS roleName`;
  //   }
  //   sql += ` FROM employee`;
  //   if (role) {
  //     sql += ` INNER JOIN employeerolesforsearch ON ( employeerolesforsearch.entity = employee.id )
  //     INNER JOIN role ON ( role.id = employeerolesforsearch.role )`;
  //   }
  //   // add where clause
  //   const where = [];
  //   switch (active) {
  //     case 'U':
  //       where.push(`employee.giveaccess = 'T'`);
  //       where.push(`employee.isinactive = 'F'`);
  //       break;
  //     case 'T':
  //       where.push(`employee.isinactive = 'F'`);
  //       break;
  //     case 'F':
  //       where.push(`employee.isinactive = 'T'`);
  //       break;
  //     default:
  //       // do not add a filter
  //       break;
  //   }
  //   if (role) {
  //     where.push(`role.id = ${role}`);
  //   }
  //   if (supervisors) {
  //     if (Array.isArray(supervisors)) {
  //       supervisors = supervisors.map((employee) => {
  //         return `'${employee.toUpperCase()}'`;
  //       });
  //       where.push(`employee.supervisor IN (${supervisors.join(',')})`);
  //     }
  //   }
  //   if (where.length > 0) {
  //     sql += ` WHERE ${where.join(' AND ')}`;
  //   }
  //   // add order by
  //   sql += ` ORDER BY employee.firstname ASC`;
  //   const results = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
  //   // log.debug({ title: 'SuiteToolsModel:getEmployees() returning', details: results });

  //   return results;
  // }

  /**
   * Get Employee
   *
   * @param id - the record id to return
   * @returns employee
   */
  // public getEmployee(id: string) {
  //   log.debug({ title: `SuiteToolsModel:getEmployee() initiated`, details: { id: id } });

  //   const sql = `SELECT
  //     employee.id,
  //     employee.entityid,
  //     employee.firstname,
  //     employee.lastname,
  //     employee.email,
  //     BUILTIN.DF( employee.supervisor ) || ' (' || employee.supervisor  || ')' AS supervisor,
  //     employee.title,
  //     employee.isinactive,
  //   FROM
  //     employee
  //   WHERE
  //     employee.id = ${id}`;
  //   const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);
  //   let result = null;
  //   if (sqlResults.length === 0) {
  //     this.stApp.setAlert('No results found that matched criteria.');
  //   } else {
  //     result = sqlResults[0];
  //   }
  //   log.debug({ title: 'SuiteToolsModel:getEmployee() returning', details: result });

  //   return result;
  // }

  /**
   * Get Script Log
   *
   * @param id - the record id to return
   * @returns script log
   */
  public getScriptLog(id: string) {
    log.debug({
      title: `SuiteToolsModel:SuiteToolsApi:getScriptLog() initiated`,
      details: {
        id: id,
      },
    });

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
    log.debug({ title: `SuiteToolsModel:SuiteToolsApi:getScriptLog() generated this sql`, details: sql });
    const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);

    // return first record of sql results
    let result = null;
    if (sqlResults.length === 0) {
      // TODO: set alert
      // this.stApp.setAlert('No results found that matched criteria.');
    } else {
      result = sqlResults[0];
    }

    return result;
  }

  /**
   * Get Script Logs results (SuiteQL version)
   *
   * The SuiteQL version can not return the user that triggered the log message, but it can only be filtered by minutes.
   *
   * @param rows - the number of rows to return
   * @param levels - type of log (e.g. debug, error, ...)
   * @param types - types of script
   * @param scripts - the scripts to return log records for
   * @param owners - the script owners to return log records for
   * @param dates - the dates to return log records for
   * @param title - the title contains this string
   * @param detail - the detail contains this string
   * @returns script logs
   */
  public getScriptLogsViaSuiteQL(
    rows: string,
    levels: string[],
    types: string[],
    scripts: string[],
    owners: string[],
    dates: string | string[],
    title: string,
    detail: string,
  ) {
    log.debug({
      title: `SuiteToolsModel:getScriptLogsViaSuiteQL() initiated`,
      details: {
        rows: rows,
        levels: levels,
        types: types,
        scripts: scripts,
        owners: owners,
        dates: dates,
        title: title,
        detail: detail,
      },
    });

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
    const where = [];
    if (rows && rows !== '0') {
      // limit to specified number of rows
      where.push(`RowNum <= ${rows}`);
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
    if (dates) {
      // check if dates is an object
      if (typeof dates === 'object') {
        // check if dates is an array
        if (Array.isArray(dates) && typeof dates[0] === 'string' && typeof dates[1] === 'string') {
          where.push(
            `date BETWEEN TO_DATE( '${dates[0]}', 'YYYY-MM-DD hh24:mi:ss' ) AND TO_DATE( '${dates[1]}', 'YYYY-MM-DD hh24:mi:ss' )`,
          );
        } else {
          log.error({ title: `SuiteToolsModel:getScriptLogsViaSuiteQL() invalid object date option`, details: dates });
        }
      } else {
        switch (dates) {
          case '0':
            // do not need a filter All is selected
            break;
          case '15':
            where.push('date > SYSDATE - ( 15 / 1440 )');
            break;
          case '60':
            where.push('date > SYSDATE - ( 1 / 24 )');
            break;
          case '240':
            where.push('date > SYSDATE - ( 4 / 24 )');
            break;
          case 'today':
            where.push("TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE, 'YYYY-MM-DD')");
            break;
          case 'yesterday':
            where.push("TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD') = TO_CHAR ( SYSDATE - 1, 'YYYY-MM-DD')");
            break;
          default:
            log.error({
              title: `SuiteToolsModel:getScriptLogsViaSuiteQL() invalid string date option`,
              details: dates,
            });
            break;
        }
      }
    }
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
    // log.debug({ title: `SuiteToolsModel:getScriptLogsViaSuiteQL() generated this sql`, details: sql });
    const sqlResults = this.stApp.stLib.stLibNs.stLibNsSuiteQl.query(sql, true);

    return sqlResults;
  }

  // ---------------------------------------------------------------------------
  // Supporting Functions
  // ---------------------------------------------------------------------------
}
