/**
 * SuiteTools API - Model Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from "N/log";
import * as task from "N/task";
import type { SuiteToolsCommon } from "../common/SuiteToolsCommon";

import { queryMany, queryOne } from "./SuiteToolsApiModelQuery";
import type { Response } from "./types";

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

    const sql = `SELECT
      file.id,
      file.folder,
      TO_CHAR(file.createddate, 'YYYY-MM-DD HH24:MI:SS') AS dateCreated,
      TO_CHAR(file.lastmodifieddate, 'YYYY-MM-DD HH24:MI:SS') AS lastModifiedDate,
      file.filetype,
      BUILTIN.DF(file.filetype) AS fileTypeName,
      file.name || ' (' || file.id  || ')' AS name,
      file.filesize AS fileSize,
      file.description,
      file.url
    FROM
      file
    WHERE
      file.id = ${id}`;
    const response = queryOne(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No file found with id of ${id}`);
    log.debug({ title: "SuiteToolsApiModel:getFile() returning", details: response });

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
  public getFiles(row: string, types: string | string[] | null, createdDate: string, modifiedDate: string): Response {
    let sql = `SELECT
      file.id,
      file.folder,
      TO_CHAR(file.createddate, 'YYYY-MM-DD HH24:MI:SS') AS dateCreated,
      TO_CHAR(file.lastmodifieddate, 'YYYY-MM-DD HH24:MI:SS') AS lastModifiedDate,
      file.filetype,
      BUILTIN.DF(file.filetype) AS fileTypeName,
      file.name || ' (' || file.id  || ')' AS name,
      file.filesize AS fileSize,
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
        const filteredTypes = types.filter((type) => type && type.trim() !== "");
        if (filteredTypes.length > 0) {
          const typeList = filteredTypes.map((type) => `'${type.toUpperCase()}'`);
          where.push(`filetype IN (${typeList.join(",")})`);
        }
      }
    }
    this.addDateFilter(where, "SuiteToolsApiModel:getFiles()", "file", "createddate", createdDate);
    this.addDateFilter(where, "SuiteToolsApiModel:getFiles()", "file", "lastmodifieddate", modifiedDate);
    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`;
    }
    sql += ` ORDER BY name ASC`;
    return queryMany(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No file records found`);
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
      scriptId: "customscript_idev_suitetools_mr_jobs_run",
      deploymentId: "customdeploy_idev_suitetools_mr_jobs_run",
      params: {
        custscript_idev_st_mr_jobs_id: id,
        custscript_idev_st_mr_jobs_data: data ? JSON.stringify(data) : null,
      },
    });
    const scriptTaskId = scriptTask.submit();
    log.debug({
      title: "SuiteToolsApiModel:initiateJob() submitted run job map/reduce script",
      details: `scriptTaskId = ${scriptTaskId}`,
    });
  }

  /**
   * Get Job
   *
   * @param id - the record to return
   * @returns results
   */
  public getJob(id: string): Response {
    const customRecord = "customrecord_idev_suitetools_job";
    const sql = `SELECT
      ${customRecord}.id,
      ${customRecord}.name,
      ${customRecord}.isinactive AS isInactive,
      ${customRecord}.custrecord_idev_st_mr_job_config as config,
      ${customRecord}.custrecord_idev_st_mr_job_desc as description,
      ${customRecord}.custrecord_idev_st_mr_job_scheduled as scheduled,
      ${customRecord}.custrecord_idev_st_mr_job_notify as notify,
    FROM
      ${customRecord}
    WHERE
      ${customRecord}.id = ${id}`;
    return queryOne(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No job found with id of ${id}`);
  }

  /**
   * Get Jobs
   *
   * @param active - the active flag
   * @returns results
   */
  public getJobs(active: string): Response {
    const customRecord = "customrecord_idev_suitetools_job";
    let sql = `SELECT
      ${customRecord}.id,
      ${customRecord}.name,
      ${customRecord}.isinactive AS isInactive,
      ${customRecord}.custrecord_idev_st_mr_job_config as config,
      ${customRecord}.custrecord_idev_st_mr_job_desc as description,
      ${customRecord}.custrecord_idev_st_mr_job_scheduled as scheduled,
      ${customRecord}.custrecord_idev_st_mr_job_notify as notify,
    FROM
      ${customRecord}`;

    // add where clause
    const where = [];
    if (active) {
      if (active === "T") {
        where.push(`isinactive = 'F'`);
      } else {
        where.push(`isinactive = 'T'`);
      }
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`;
    }
    sql += ` ORDER BY ${customRecord}.id ASC`;
    return queryMany(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No job records found`);
  }

  /**
   * Get Role
   *
   * @param id - the id of the record
   * @returns Role
   */
  public getRole(id: string): Response {
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
    return queryOne(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No role found with id of ${id}`);
  }

  /**
   * Get Roles
   *
   * @param status - the status of the record
   * @returns roles
   */
  public getRoles(active: string): Response {
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
      if (active === "T") {
        where.push(`role.isinactive = 'F'`);
      } else {
        where.push(`role.isinactive = 'T'`);
      }
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`;
    }
    sql += ` ORDER BY role.name`;

    return queryMany(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No role records found`);
  }

  /**
   * Get Integration
   *
   * @param id - the record to return
   * @returns results
   */
  public getIntegration(id: string): Response {
    const response: Response = { status: 200, data: null };
    // Integration Applications are not a searchable N/search record type (INVALID_RCRD_TYPE).
    // Resolve via SuiteQL when available, else LoginAudit synthetic rows.
    const sql = `SELECT
      integration.id,
      integration.name,
      integration.applicationid AS applicationId,
      BUILTIN.DF(integration.state) AS state,
      TO_CHAR(integration.datecreated, 'YYYY-MM-DD HH24:MI:SS') AS dateCreated
    FROM
      integration
    WHERE
      integration.id = ${id}`;

    // Empty SuiteQL success may still resolve via LoginAudit synthetic rows.
    // SuiteQL runtime failures throw and must escalate (not look like "not found").
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length > 0) {
      response.data = this.normalizeIntegrationRow(sqlResults[0]);
      return response;
    }

    const fromSynthetic = this.getIntegrationFromSyntheticId(id);
    if (fromSynthetic) {
      response.data = fromSynthetic;
    } else {
      response.message = `No integration found with id of ${id}`;
      response.data = null;
    }

    return response;
  }

  /**
   * Get Integrations
   *
   * @param active - Enabled (T) / Blocked (F) / All
   * @returns results
   */
  public getIntegrations(active: string): Response {
    const response: Response = { status: 200, data: [] };

    // N/search type "integration" is invalid in SuiteScript — use SuiteQL + LoginAudit only.
    const rows = this.mergeIntegrationRows(this.queryIntegrationRowsSuiteQl(), this.integrationNamesFromLoginAudit());

    response.data = this.filterIntegrationsByActive(rows, active);

    if (!Array.isArray(response.data)) {
      response.data = [];
    }
    if ((response.data as unknown[]).length === 0) {
      response.message = `No integration records found`;
    }

    return response;
  }

  /**
   * Map a SuiteQL Integration row into the Integration schema shape.
   *
   * Keys are read in several casings because SuiteQL `asMappedResults()` lowercases aliases,
   * while other callers have supplied camelCase or uppercase rows.
   *
   * @param row - Raw SuiteQL row.
   */
  private normalizeIntegrationRow(row: Record<string, unknown>): {
    id: number;
    name: string;
    applicationId: string;
    state: string;
    dateCreated: string;
  } {
    let name = String(row.name ?? row.Name ?? "");
    if (name === "SuiteCloud IDE & CLI") {
      name = "SuiteCloud Development Integration";
    }
    return {
      id: Number(row.id ?? row.ID),
      name,
      applicationId: String(row.applicationid ?? row.applicationId ?? row.APPLICATIONID ?? ""),
      state: String(row.state ?? row.State ?? ""),
      dateCreated: String(row.datecreated ?? row.dateCreated ?? row.DATECREATED ?? ""),
    };
  }

  /**
   * Load Integration records via SuiteQL without state filters in SQL.
   * BUILTIN.DF() in WHERE often returns zero rows even when records exist.
   */
  private queryIntegrationRowsSuiteQl(): {
    id: number;
    name: string;
    applicationId: string;
    state: string;
    dateCreated: string;
  }[] {
    const sql = `SELECT
      integration.id,
      integration.name,
      integration.applicationid AS applicationId,
      BUILTIN.DF(integration.state) AS state,
      TO_CHAR(integration.datecreated, 'YYYY-MM-DD HH24:MI:SS') AS dateCreated
    FROM
      integration
    ORDER BY
      integration.name ASC`;

    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    return (sqlResults || []).map((row) => this.normalizeIntegrationRow(row));
  }

  /**
   * Filter integration rows by Enabled (T) / Blocked (F) / All.
   * @param active - Enabled (T) / Blocked (F) / All
   */
  private filterIntegrationsByActive(
    rows: { id: number; name: string; applicationId: string; state: string; dateCreated: string }[],
    active: string,
  ): { id: number; name: string; applicationId: string; state: string; dateCreated: string }[] {
    if (!active) {
      return rows;
    }
    if (active === "T") {
      return rows.filter((row) => this.isIntegrationEnabled(row.state));
    }
    if (active === "F") {
      return rows.filter((row) => this.isIntegrationBlocked(row.state));
    }
    return rows;
  }

  private isIntegrationEnabled(state: string): boolean {
    const normalized = String(state || "").toLowerCase();
    if (!normalized) {
      return true;
    }
    return normalized === "enabled" || normalized === "t";
  }

  private isIntegrationBlocked(state: string): boolean {
    const normalized = String(state || "").toLowerCase();
    return normalized === "blocked" || normalized === "f";
  }

  /**
   * Distinct OAuth application names from LoginAudit (same query Last Logins MR uses).
   */
  private integrationNamesFromLoginAudit(): string[] {
    const sql = `SELECT DISTINCT
      oAuthAppName AS oauthappname
    FROM
      LoginAudit
    WHERE
      oAuthAppName IS NOT NULL
    ORDER BY
      oAuthAppName ASC`;

    const auditRows = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    const names: string[] = [];
    const seen = new Set<string>();

    for (const auditRow of auditRows || []) {
      const raw = auditRow.oauthappname ?? auditRow.name ?? auditRow.OAUTHAPPNAME ?? "";
      let name = String(raw).trim();
      if (!name || seen.has(name.toLowerCase())) {
        continue;
      }
      seen.add(name.toLowerCase());
      if (name === "SuiteCloud IDE & CLI") {
        name = "SuiteCloud Development Integration";
      }
      names.push(name);
    }

    return names;
  }

  /**
   * Union integration records with LoginAudit OAuth app names.
   * @param primary - Rows from SuiteQL.
   * @param auditNames - Distinct oAuthAppName values from LoginAudit.
   */
  private mergeIntegrationRows(
    primary: { id: number; name: string; applicationId: string; state: string; dateCreated: string }[],
    auditNames: string[],
  ): { id: number; name: string; applicationId: string; state: string; dateCreated: string }[] {
    const byName = new Map<
      string,
      { id: number; name: string; applicationId: string; state: string; dateCreated: string }
    >();

    for (const row of primary) {
      if (!row.name || !Number.isFinite(row.id)) {
        continue;
      }
      byName.set(row.name.toLowerCase(), row);
    }

    for (const name of auditNames) {
      const key = name.toLowerCase();
      if (byName.has(key)) {
        continue;
      }

      const resolved = this.resolveIntegrationByName(name);
      if (resolved) {
        byName.set(key, resolved);
        continue;
      }

      // LoginAudit name with no matching integration record — still list it (MR already uses these names).
      byName.set(key, {
        id: this.stableIntegrationIdFromName(name),
        name,
        applicationId: "",
        state: "Enabled",
        dateCreated: "",
      });
    }

    return Array.from(byName.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Stable synthetic id for LoginAudit-only integration rows (high range avoids real internal ids).
   * @param name - Integration display name.
   */
  private stableIntegrationIdFromName(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (Math.imul(31, hash) + name.charCodeAt(i)) | 0;
    }
    return 900000000 + Math.abs(hash % 100000000);
  }

  /**
   * Resolve LoginAudit-only integration rows by synthetic id.
   * @param id - Integration internal or synthetic id.
   */
  private getIntegrationFromSyntheticId(
    id: string,
  ): { id: number; name: string; applicationId: string; state: string; dateCreated: string } | null {
    const numericId = Number(id);
    if (!Number.isFinite(numericId) || numericId < 900000000) {
      return null;
    }

    for (const name of this.integrationNamesFromLoginAudit()) {
      if (this.stableIntegrationIdFromName(name) === numericId) {
        return { id: numericId, name, applicationId: "", state: "Enabled", dateCreated: "" };
      }
    }

    return null;
  }

  /**
   * Resolve a full integration record by display name.
   * @param name - Integration name from LoginAudit or UI.
   */
  private resolveIntegrationByName(
    name: string,
  ): { id: number; name: string; applicationId: string; state: string; dateCreated: string } | null {
    const namesToTry = [name];
    if (name === "SuiteCloud Development Integration") {
      namesToTry.push("SuiteCloud IDE & CLI");
    }

    for (const candidate of namesToTry) {
      const escaped = candidate.replace(/'/g, "''");
      const sql = `SELECT
        integration.id,
        integration.name,
        integration.applicationid AS applicationId,
        BUILTIN.DF(integration.state) AS state,
        TO_CHAR(integration.datecreated, 'YYYY-MM-DD HH24:MI:SS') AS dateCreated
      FROM
        integration
      WHERE
        integration.name = '${escaped}'`;

      const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
      if (sqlResults.length > 0) {
        return this.normalizeIntegrationRow(sqlResults[0]);
      }
    }

    return null;
  }

  /**
   * Get Script
   *
   * @param id - the record to return
   * @returns results
   */
  public getScript(id: string): Response {
    const sql = `SELECT
      script.id,
      script.apiversion AS apiVersion,
      script.isinactive AS isInactive,
      script.scripttype AS scriptType,
      script.name,
      script.scriptid AS scriptId,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      NVL(file.name || ' (' || file.id  || ')', '') AS scriptFile,
      script.notifyemails AS notifyEmails,
      script.description
    FROM
      script
    LEFT JOIN file
      ON script.scriptfile = file.id
    WHERE
      script.id = ${id}`;
    return queryOne(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No script found with id of ${id}`);
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
    versions: string[] | null,
    types: string[] | null,
    scripts: string[] | null,
    owners: string[] | null,
    files: string[] | null,
  ): Response {
    let sql = `SELECT
      script.id,
      script.apiversion AS apiVersion,
      script.isinactive AS isInactive,
      script.scripttype AS scriptType,
      script.name || ' (' || script.id  || ')' AS name,
      script.scriptid AS scriptId,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      NVL(file.name || ' (' || file.id  || ')', '') AS scriptFile,
      script.notifyemails AS notifyEmails,
      script.description
    FROM
      script
    LEFT JOIN file
      ON script.scriptfile = file.id`;

    // add where clause
    const where = [];
    if (active) {
      if (active === "T") {
        where.push(`script.isinactive = 'F'`);
      } else {
        where.push(`script.isinactive = 'T'`);
      }
    }
    if (versions && Array.isArray(versions)) {
      where.push(`apiversion IN (${versions.join(",")})`);
    }
    if (types && Array.isArray(types)) {
      const typeList = types.map((type) => `'${type.toUpperCase()}'`);
      where.push(`scripttype IN (${typeList.join(",")})`);
    }
    if (scripts && Array.isArray(scripts)) {
      const scriptList = scripts.map((script) => `'${script.toUpperCase()}'`);
      where.push(`script.id IN (${scriptList.join(",")})`);
    }
    if (owners && Array.isArray(owners)) {
      const ownerList = owners.map((owner) => `'${owner.toUpperCase()}'`);
      where.push(`owner IN (${ownerList.join(",")})`);
    }
    if (files && Array.isArray(files)) {
      const fileList = files.map((file) => `'${file.toUpperCase()}'`);
      where.push(`file.id IN (${fileList.join(",")})`);
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`;
    }
    sql += ` ORDER BY name ASC`;

    return queryMany(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No script records found`);
  }

  /**
   * Get User
   *
   * @param id - the record id to return
   * @returns user
   */
  public getUser(id: string): Response {
    const sql = `SELECT
      employee.id,
      employee.isinactive AS isInactive,
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
    // Soft miss via message + null (Get layer → ensureEntityOrSoftNotFound); was hard 404.
    return queryOne(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No user found with id of ${id}`);
  }

  /**
   * Get Users
   *
   * @returns results
   */
  public getUsers(active: string, roles?: string[] | null, supervisors?: string[] | null): Response {
    let sql = `SELECT
      employee.id,
      employee.isinactive AS isInactive,
      employee.email,
      employee.entityid AS name,
      employee.title,
      MAX(BUILTIN.DF( employee.supervisor )) AS supervisor
      FROM employee
      INNER JOIN employeerolesforsearch ON ( employeerolesforsearch.entity = employee.id )
      INNER JOIN role ON ( role.id = employeerolesforsearch.role )`;

    const where = [];
    switch (active) {
      case "U":
        where.push(`employee.giveaccess = 'T'`);
        where.push(`employee.isinactive = 'F'`);
        break;
      case "T":
        where.push(`employee.isinactive = 'F'`);
        break;
      case "F":
        where.push(`employee.isinactive = 'T'`);
        break;
      default:
        // do not add a filter
        break;
    }
    if (roles && Array.isArray(roles)) {
      const roleList = roles.map((role) => role);
      where.push(`role.id IN (${roleList.join(",")})`);
    }
    if (supervisors && Array.isArray(supervisors)) {
      const supervisorList = supervisors.map((supervisor) => supervisor);
      where.push(`employee.supervisor IN (${supervisorList.join(",")})`);
    }

    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`;
    }

    sql += ` GROUP BY
      employee.id,
      employee.isinactive,
      employee.email,
      employee.entityid,
      employee.title
    ORDER BY employee.entityid`;

    return queryMany(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No user records found`);
  }

  /**
   * Get Script Log
   *
   * @param id - the record id to return
   * @returns script log
   */
  public getScriptLog(id: string): Response {
    const sql = `SELECT
      ScriptNote.internalid AS id,
      TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD HH24:MI:SS' ) AS timestamp,
      ScriptNote.type,
      script.scripttype AS scriptType,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      BUILTIN.DF( script.name ) || ' (' || script.id  || ')' AS scriptName,
      ScriptNote.title, REPLACE( ScriptNote.detail, '"', '""' ) AS detail
    FROM ScriptNote
    INNER JOIN script
      ON ScriptNote.scripttype = script.id
    WHERE ScriptNote.internalid = ${id}`;
    log.debug({ title: `SuiteToolsApiModel:getScriptLog() generated this sql`, details: sql });
    return queryOne(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No script log found with id of ${id}`);
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
    levels: string[] | null,
    types: string[] | null,
    scripts: string[] | null,
    owners: string[] | null,
    timemode: string,
    date: string,
    customdatetime: string | null,
    customduration: string | null,
    title: string,
    detail: string,
  ): Response {
    let sql = `SELECT
      ScriptNote.internalid AS id,
      TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD HH24:MI:SS' ) AS timestamp,
      ScriptNote.type,
      script.scripttype AS scriptType,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      BUILTIN.DF( script.name ) || ' (' || script.id  || ')' AS scriptName,
      ScriptNote.title, REPLACE( ScriptNote.detail, '"', '""' ) AS detail
    FROM ScriptNote
    INNER JOIN script
      ON ScriptNote.scripttype = script.id`;

    const where: string[] = [];
    if (row && row !== "0") {
      where.push(`RowNum <= ${row}`);
    }
    if (levels && Array.isArray(levels)) {
      const levelList = levels.map((type) => `'${type.toUpperCase()}'`);
      where.push(`ScriptNote.type IN (${levelList.join(",")})`);
    }
    if (types && Array.isArray(types)) {
      const typeList = types.map((type) => `'${type.toUpperCase()}'`);
      where.push(`script.scripttype IN (${typeList.join(",")})`);
    }
    if (scripts && Array.isArray(scripts)) {
      where.push(`ScriptNote.scriptType IN (${scripts.join(",")})`);
    }
    if (owners && Array.isArray(owners)) {
      const ownerList = owners.map((owner) => `'${owner.toUpperCase()}'`);
      where.push(`owner IN (${ownerList.join(",")})`);
    }
    if (title) {
      where.push(`ScriptNote.title LIKE '%${title}%'`);
    }
    if (detail) {
      where.push(`ScriptNote.detail LIKE '%${detail}%'`);
    }

    // Add date/time filtering
    if (timemode === "now" && date) {
      // Named windows (today/yesterday/…) and minute offsets via addDateFilter
      this.addDateFilter(where, "SuiteToolsApiModel:getScriptLogsViaSuiteQL()", "ScriptNote", "date", date);
    } else if (timemode === "custom" && customdatetime && customduration) {
      // End datetime (YYYY-MM-DD HH24:MI:SS or epoch ms) + lookback in minutes
      const durationMinutes = this.resolveDurationMinutes(customduration);
      const endDateTime = this.resolveSuiteQlDateTime(customdatetime);
      if (durationMinutes > 0 && endDateTime) {
        where.push(
          `ScriptNote.date >= (TO_DATE('${endDateTime}', 'YYYY-MM-DD HH24:MI:SS') - ${durationMinutes} / 1440)`,
        );
        where.push(`ScriptNote.date <= TO_DATE('${endDateTime}', 'YYYY-MM-DD HH24:MI:SS')`);
      }
    }

    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`;
    }
    sql += ` ORDER BY ScriptNote.date DESC`;

    return queryMany(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No script log records found`);
  }

  /**
   * Add Date Filter
   *
   * Supports:
   * - `0` / empty: no filter
   * - numeric strings (`15`, `60`, `240`): last N minutes
   * - `today`, `yesterday`, `lastweek` (7 days), `lastmonth` (31 days)
   *
   * @param where - the where clause
   * @param functionName - the function name (for debug logging)
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
    if (!dates || dates === "" || dates === "0") {
      return;
    }

    // Files UI only sends a single select value today.
    if (typeof dates !== "string") {
      log.debug({ title: `${functionName} addDateFilter`, details: { skippedNonStringDates: dates } });
      return;
    }

    const column = table ? `${table}.${field}` : field;

    switch (dates) {
      case "today":
        where.push(`TO_CHAR(${column}, 'YYYY-MM-DD') = TO_CHAR(SYSDATE, 'YYYY-MM-DD')`);
        break;
      case "yesterday":
        where.push(`TO_CHAR(${column}, 'YYYY-MM-DD') = TO_CHAR(SYSDATE - 1, 'YYYY-MM-DD')`);
        break;
      case "lastweek":
        where.push(`${column} >= (SYSDATE - 7)`);
        break;
      case "lastmonth":
        where.push(`${column} >= (SYSDATE - 31)`);
        break;
      default: {
        // Relative window in minutes (e.g. "15", "60", "240")
        // NetSuite SuiteQL uses fractional days: minutes / 1440
        const minutes = parseInt(dates, 10);
        if (!Number.isNaN(minutes) && minutes > 0) {
          where.push(`${column} >= (SYSDATE - ${minutes} / 1440)`);
        } else {
          log.debug({ title: `${functionName} addDateFilter`, details: `Unhandled date filter value: ${dates}` });
        }
        break;
      }
    }
  }

  /**
   * Resolve a custom lookback duration to minutes.
   * Accepts numeric minutes or legacy named tokens (`hour`, `day`, `week`, `month`).
   */
  private resolveDurationMinutes(duration: string): number {
    const named: Record<string, number> = { hour: 60, day: 1440, week: 10080, month: 43200 };
    if (named[duration] != null) {
      return named[duration];
    }
    const minutes = parseInt(duration, 10);
    return !Number.isNaN(minutes) && minutes > 0 ? minutes : 0;
  }

  /**
   * Normalize custom end datetime for SuiteQL `TO_DATE(..., 'YYYY-MM-DD HH24:MI:SS')`.
   * Accepts that string form, or a millisecond epoch (legacy FE).
   */
  private resolveSuiteQlDateTime(value: string): string {
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(value)) {
      return value;
    }
    if (/^\d+$/.test(value)) {
      const date = new Date(Number(value));
      if (!Number.isNaN(date.getTime())) {
        const pad = (n: number) => String(n).padStart(2, "0");
        return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
      }
    }
    log.debug({
      title: "SuiteToolsApiModel:resolveSuiteQlDateTime",
      details: `Unhandled customDateTime value: ${value}`,
    });
    return "";
  }

  /**
   * Get Job Run
   *
   * @param id - the record id to return
   * @returns results
   */
  public getJobRun(id: string): Response {
    const customRecord = "customrecord_idev_suitetools_job_run";
    const sql = `SELECT
      ${customRecord}.id,
      TO_CHAR ( ${customRecord}.created, 'YYYY-MM-DD HH24:MI:SS' ) AS created,
      ${customRecord}.custrecord_idev_st_mr_job_run_job_id AS jobId,
      customrecord_idev_suitetools_job.name AS jobName,
      ${customRecord}.custrecord_idev_st_mr_job_run_completed AS completed,
      ${customRecord}.custrecord_idev_st_mr_job_run_results AS results
    FROM
      ${customRecord}
    INNER JOIN customrecord_idev_suitetools_job
      ON customrecord_idev_suitetools_job_run.custrecord_idev_st_mr_job_run_job_id = customrecord_idev_suitetools_job.id
    WHERE
      ${customRecord}.id = ${id}`;
    return queryOne(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No job execution found with id of ${id}`);
  }

  /**
   * Get Job Runs
   *
   * @param job - the specific job to see the executions of
   * @param completed - the completed status
   * @returns results
   */
  public getJobRuns(job: string, completed: string): Response {
    const customRecord = "customrecord_idev_suitetools_job_run";
    let sql = `SELECT
      ${customRecord}.id,
      TO_CHAR ( ${customRecord}.created, 'YYYY-MM-DD HH24:MI:SS' ) AS created,
      ${customRecord}.custrecord_idev_st_mr_job_run_job_id AS jobId,
      customrecord_idev_suitetools_job.name AS jobName,
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
      sql += ` WHERE ${where.join(" AND ")}`;
    }
    sql += ` ORDER BY ${customRecord}.id DESC`;
    return queryMany(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No job execution records found`);
  }

  /**
   * Normalize integration application display names for consistent matching.
   * @param name - Raw application name from SuiteQL or UI criteria.
   */
  private normalizeTokenIntegrationName(name: string): string {
    if (name === "SuiteCloud IDE & CLI") {
      return "SuiteCloud Development Integration";
    }
    return name;
  }

  /**
   * Map a SuiteQL OAuthToken row into the Token schema shape.
   *
   * Keys are read in both lowercase and camelCase because SuiteQL `asMappedResults()` lowercases
   * aliases, but callers have supplied camelCase rows too. Values are coerced with `String()`
   * rather than defaulted with `??` alone: SuiteQL can hand back numbers, which would otherwise
   * land in these string-typed fields unconverted.
   *
   * @param row - Raw SuiteQL row.
   */
  private normalizeTokenRow(row: Record<string, unknown>): {
    id: number;
    name: string;
    userName: string;
    roleName: string;
    integrationName: string;
    state: string;
    dateCreated: string;
    createdBy: string;
  } {
    return {
      id: Number(row.id),
      name: String(row.name ?? ""),
      userName: String(row.username ?? row.userName ?? ""),
      roleName: String(row.rolename ?? row.roleName ?? ""),
      integrationName: this.normalizeTokenIntegrationName(String(row.integrationname ?? row.integrationName ?? "")),
      state: String(row.state ?? ""),
      dateCreated: String(row.datecreated ?? row.dateCreated ?? ""),
      createdBy: String(row.createdby ?? row.createdBy ?? ""),
    };
  }

  /**
   * Get a single TBA access token by internal id.
   * @param id - Token internal id.
   * @returns Token response.
   */
  public getToken(id: string): Response {
    const sql = `SELECT
      OAuthToken.id,
      OAuthToken.TBA_Token_Name AS name,
      BUILTIN.DF(OAuthToken.Entity_Name) AS userName,
      BUILTIN.DF(OAuthToken.Role_Name) AS roleName,
      BUILTIN.DF(OAuthToken.TBA_App_Name) AS integrationName,
      CASE WHEN OAuthToken.BREVOKED = 'T' THEN 'Revoked' ELSE 'Active' END AS state,
      TO_CHAR(OAuthToken.DCreated, 'YYYY-MM-DD HH24:MI:SS') AS dateCreated,
      BUILTIN.DF(OAuthToken.CreatedBy) AS createdBy
    FROM
      OAuthToken
    WHERE
      OAuthToken.id = ${id}`;

    return queryOne(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No token found with id of ${id}`, (row) =>
      this.normalizeTokenRow(row),
    );
  }

  /**
   * Get TBA access tokens with optional filters.
   * Name filters (integration/user/role) are applied by the frontend adapter —
   * SuiteQL `BUILTIN.DF(...)` in WHERE is unreliable for these columns.
   * @param active - T = Active (not revoked), F = Revoked, empty = all
   * @param _integrationName - Unused; kept for API compatibility
   * @param _userName - Unused; kept for API compatibility
   * @param _roleName - Unused; kept for API compatibility
   * @returns Token list response.
   */
  public getTokens(active: string, _integrationName: string, _userName: string, _roleName: string): Response {
    let sql = `SELECT
      OAuthToken.id,
      OAuthToken.TBA_Token_Name AS name,
      BUILTIN.DF(OAuthToken.Entity_Name) AS userName,
      BUILTIN.DF(OAuthToken.Role_Name) AS roleName,
      BUILTIN.DF(OAuthToken.TBA_App_Name) AS integrationName,
      CASE WHEN OAuthToken.BREVOKED = 'T' THEN 'Revoked' ELSE 'Active' END AS state,
      TO_CHAR(OAuthToken.DCreated, 'YYYY-MM-DD HH24:MI:SS') AS dateCreated,
      BUILTIN.DF(OAuthToken.CreatedBy) AS createdBy
    FROM
      OAuthToken`;

    const where: string[] = [`OAuthToken.BINACTIVE = 'F'`];
    if (active === "T") {
      where.push(`OAuthToken.BREVOKED = 'F'`);
    } else if (active === "F") {
      where.push(`OAuthToken.BREVOKED = 'T'`);
    }

    sql += ` WHERE ${where.join(" AND ")} ORDER BY OAuthToken.TBA_Token_Name`;

    return queryMany(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No token records found`, (rows) =>
      rows.map((row) => this.normalizeTokenRow(row)),
    );
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
    users: string[] | null,
    roles: string[] | null,
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
      if (active === "T") {
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
        const userIds = users.filter((user) => user !== "" && user != null);
        if (userIds.length > 0) {
          where.push(`loginAudit.user IN (${userIds.join(",")})`);
        }
      }
    }
    if (roles) {
      if (Array.isArray(roles)) {
        const roleIds = roles.filter((role) => role !== "" && role != null);
        if (roleIds.length > 0) {
          where.push(`loginAudit.role IN (${roleIds.join(",")})`);
        }
      }
    }
    if (where.length > 0) {
      sql += ` WHERE ${where.join(" AND ")}`;
    }
    // add order by
    sql += ` ORDER BY loginAudit.date DESC`;

    return queryMany(this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql), `No login audit records found`);
  }
}
