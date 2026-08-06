/**
 * SuiteTools Library - Jobs
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from 'N/log';

// Forward declaration to avoid circular dependency
declare class SuiteToolsCommon {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stLib: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stSettings: any;
}

/**
 * Jobs support for SuiteTools App and SuiteTools API
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonJobs {
  private _stCommon: SuiteToolsCommon;
  private _appJobRecord = 'customrecord_idev_suitetools_job';
  private _appJobRunRecord = 'customrecord_idev_suitetools_job_run';

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Initializes jobs
   *
   * Add the jobs when we first install the SuiteTools app.
   */
  public initializeJobs(): void {
    log.debug({ title: `SuiteToolsCommonJobs:initializeJobs() initiated`, details: '' });

    // ADD THE DEFAULT JOBS
    // recent script errors job
    const recentScriptErrorsJob = {
      name: 'Recent Script Errors',
      custrecord_idev_st_mr_job_desc:
        'The job notifies user of recent errors (Error, Emergency, System) across all script execution logs.',
      custrecord_idev_st_mr_job_scheduled: true,
      custrecord_idev_st_mr_job_notify: true,
    };
    this.stCommon.stLib.stLibNs.stLibNsRecord.createCustomRecordEntry(this._appJobRecord, recentScriptErrorsJob);
    // last logins job
    const lastLoginsJob = {
      name: 'Last Logins',
      custrecord_idev_st_mr_job_desc: 'This job get the last logins for the users, tokens and integrations.',
      custrecord_idev_st_mr_job_scheduled: false, // script can not be scheduled since it needs to be run in UI
      custrecord_idev_st_mr_job_notify: false, // no need to notify user since not able to be scheduled
    };
    this.stCommon.stLib.stLibNs.stLibNsRecord.createCustomRecordEntry(this._appJobRecord, lastLoginsJob);
    log.debug({ title: `SuiteToolsCommonJobs::initializeJobs() completed`, details: null });
  }

  /**
   * Get scheduled jobs
   *
   * @returns array of scheduled jobs
   */
  public getScheduledJobs(): Array<{ id: number; name: string }> {
    log.debug('SuiteToolsCommonJobs:getScheduledJobs() initiated', null);

    const customRecord = 'customrecord_idev_suitetools_job';
    const sql = `SELECT
      ${customRecord}.id,
      ${customRecord}.name,
    FROM
      ${customRecord}
    WHERE
      ${customRecord}.isinactive = 'F'
      AND custrecord_idev_st_mr_job_scheduled = 'T'
    ORDER BY
      ${customRecord}.id ASC`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql) as Array<{
      id: number;
      name: string;
    }>;
    if (sqlResults.length === 0) {
      log.audit(`getJobs() - No active scheduled job records found`, null);
    } else {
      log.debug({ title: 'SuiteToolsCommonJobs:getScheduledJobs() returning', details: sqlResults });
    }

    return sqlResults;
  }

  /**
   * Creates job run record
   *
   * @param id - job id
   * @returns job run record id
   */
  public createJobRunRecord(id: string): number {
    log.debug('SuiteToolsCommonJobs:createJobRunRecord() initiated', { id });

    // save new job run record
    const jobRunRecordId = Number(
      this.stCommon.stLib.stLibNs.stLibNsRecord.createCustomRecordEntry(this._appJobRunRecord, {
        custrecord_idev_st_mr_job_run_job_id: id,
      }),
    );
    log.debug({ title: 'SuiteToolsCommonJobs:createJobRunRecord() created job run record', details: jobRunRecordId });

    return jobRunRecordId;
  }

  /**
   * Updates job run record
   *
   * @param id - job run record id
   * @param completed - did the job complete successfully?
   * @param results - job results
   */
  public updateJobRunRecord(id: string, completed: boolean, results: string): void {
    log.debug('SuiteToolsCommonJobs:updateJobRunRecord() initiated', { id, completed, results });
    // update job run record
    this.stCommon.stLib.stLibNs.stLibNsRecord.updateCustomRecordEntry(this._appJobRunRecord, id, {
      custrecord_idev_st_mr_job_run_completed: completed,
      custrecord_idev_st_mr_job_run_results: results,
    });
  }

  /**
   * Get Job Last Run
   *
   * Look up via the job run records when the last time a job was run
   *
   * @param id - the job to look up
   * @returns results
   */
  public getJobLastRun(id: string): string {
    log.debug({ title: `SuiteToolsCommonJobs:getJobLastRun() initiated`, details: { id: id } });
    let result = '';
    const customRecord = this._appJobRunRecord;
    const sql = `SELECT TOP 1
        TO_CHAR ( ${customRecord}.created, 'YYYY-MM-DD HH24:MI:SS' ) AS lastrun
      FROM
        ${customRecord}
      WHERE
        ${customRecord}.custrecord_idev_st_mr_job_run_job_id = ${id}
      ORDER by
        ${customRecord}.created DESC`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length !== 0) {
      result = String(sqlResults[0].lastrun);
    }

    return result;
  }

  /**
   * Runs job
   *
   * @param jobId
   * @param jobData
   * @returns void
   */
  public async runJob(jobId: string, jobData?: object): Promise<void> {
    log.debug('SuiteToolsCommonJobs:runJob() initiated', { jobId, jobData });
    let result: object;
    let completed = false;
    if (jobId) {
      // load job details
      const jobDetails = this.stCommon.stLib.stLibNs.stLibNsRecord.getCustomRecord(this._appJobRecord, Number(jobId));
      if (jobDetails) {
        log.debug('SuiteToolsCommonJobs:runJob() job details', jobDetails);
        const lastRun = this.getJobLastRun(jobId);
        // create new job run record
        const jobRunId = this.createJobRunRecord(jobId);
        // execute the job
        log.debug('SuiteToolsCommonJobs:runJob() executing job', jobId);
        switch (String(jobId)) {
          case '1': // Recent Script Errors
            result = this.getRecentScriptErrorsJob(lastRun);
            completed = true;
            break;
          case '2': // Last Logins
            result = this.initiateLastLoginsJob(jobData ?? []);
            completed = true;
            break;
          default:
            log.error('SuiteToolsCommonJobs:runJob() error', `Unknown job id: ${jobId}`);
        }
        log.debug('SuiteToolsCommonJobs:runJob() job processed', { jobId, completed, result });
        // update job run record after execution
        this.updateJobRunRecord(String(jobRunId), completed, JSON.stringify(result));
        // send notification email if job is set to notify
        const notify = jobDetails.getValue('custrecord_idev_st_mr_job_notify');
        if (notify) {
          const notifyAuthor = this.stCommon.stSettings.notifyAuthor;
          const notifyEmail = this.stCommon.stSettings.notifyEmail;
          this.stCommon.stLib.stLibNs.stLibNsEmail.sendNotification(
            notifyAuthor,
            [notifyEmail],
            notifyEmail,
            'SuiteTools Job Notification',
            JSON.stringify(result),
          );
        }
      } else {
        log.error('SuiteToolsCommonJobs:runJob() error', `Job details not found for job id: ${jobId}`);
      }
    } else {
      log.error('SuiteToolsCommonJobs:runJob() error', 'No job id provided');
    }
  }

  /**
   * Gets recent script errors
   *
   * @param lastRun - last run timestamp
   * @returns recent script errors
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getRecentScriptErrorsJob(lastRun: string): any[] {
    log.debug({
      title: `SuiteToolsCommonJobs:getRecentScriptErrorsJob() initiated`,
      details: { lastRun },
    });
    // get the errors from the script execution log
    let levels = ['ERROR', 'EMERGENCY', 'SYSTEM'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any[] = [];
    let sql = `SELECT
      ScriptNote.internalid AS id,
      TO_CHAR ( ScriptNote.date, 'YYYY-MM-DD HH24:MI:SS' ) AS timestamp,
      ScriptNote.type,
      script.scripttype AS scriptType,
      BUILTIN.DF( script.owner ) || ' (' || script.owner  || ')' AS owner,
      BUILTIN.DF( script.name ) || ' (' || script.id  || ')' AS scriptName,
      ScriptNote.title, REPLACE( detail, '"', '""' ) AS detail
    FROM ScriptNote
    INNER JOIN script
      ON ScriptNote.scripttype = script.id`;
    // add where clause
    const where: string[] = [];
    if (levels) {
      if (Array.isArray(levels)) {
        levels = levels.map((type) => {
          return `'${type.toUpperCase()}'`;
        });
        where.push(`ScriptNote.type IN (${levels.join(',')})`);
      }
    }
    // add in time filter
    if (lastRun) {
      where.push(`ScriptNote.date > TO_DATE('${lastRun}', 'YYYY-MM-DD HH24:MI:SS')`);
    } else {
      where.push(`ScriptNote.date > SYSDATE - ( 60 / 1440 )`); // last 60 minutes
    }
    // add where clause
    if (where.length > 0) {
      sql += ` WHERE ${where.join(' AND ')}`;
    }
    // add order by
    sql += ` ORDER BY ScriptNote.internalId DESC`;
    const sqlResults = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    if (sqlResults.length !== 0) {
      result = sqlResults;
    }

    return result;
  }

  /**
   * Initiate last logins job
   *
   * @param requestBodyData
   * @returns object
   */
  public initiateLastLoginsJob(requestBodyData: object): object {
    log.debug({ title: 'SuiteToolsCommonJobs:initiateLastLoginsJob() initiated', details: requestBodyData });
    let message = '';
    let entityRecords: { type: string; name: string }[] = [];

    // Prefer entity records supplied by the caller (frontend scrape).
    if (Array.isArray(requestBodyData) && requestBodyData.length > 0) {
      entityRecords = requestBodyData.filter(
        (item) => item && typeof item === 'object' && typeof item.type === 'string' && typeof item.name === 'string',
      );
      log.debug({
        title: 'SuiteToolsCommonJobs:initiateLastLoginsJob() set entity records from request',
        details: { count: entityRecords.length },
      });
    }

    // Fallback: discover entities from LoginAudit so the job still works when
    // the UI scrape returns nothing (or the jobs-run MR drops the payload).
    if (entityRecords.length === 0) {
      entityRecords = this.getLastLoginEntitiesFromAudit();
      log.debug({
        title: 'SuiteToolsCommonJobs:initiateLastLoginsJob() entity records from LoginAudit',
        details: { count: entityRecords.length },
      });
    }

    if (entityRecords.length > 0) {
      // Ensure settings are loaded so recordId is available for the MR script.
      this.stCommon.stSettings.getSettings();
      const params = {
        custscript_idev_st_mr_logins_entity: JSON.stringify(entityRecords),
        custscript_idev_st_mr_logins_set_id: this.stCommon.stSettings.recordId,
      };
      const scriptTaskId = this.stCommon.stLib.stLibNs.stLibNsTask.submit(
        'MAP_REDUCE',
        'customscript_idev_suitetools_mr_logins',
        'customdeploy_idev_suitetools_mr_logins',
        params,
      );
      message = 'Last logins script initiated with task id of ' + scriptTaskId;
      // NOTE: the results are saved in the summary step of the last logins script
    } else {
      message = 'No active entity records found';
    }
    log.debug({ title: 'SuiteToolsCommonJobs:initiateLastLoginsJob() returning', details: message });

    return {
      data: { entityCount: entityRecords.length },
      message: message,
    };
  }

  /**
   * Build Last Logins entity list from LoginAudit distinct names.
   * @returns Entity records for integrations, tokens, and users.
   */
  private getLastLoginEntitiesFromAudit(): { type: string; name: string }[] {
    const entities: { type: string; name: string }[] = [];
    const queries: { type: string; sql: string; field: string }[] = [
      {
        type: 'integration',
        field: 'oauthappname',
        sql: `SELECT DISTINCT oAuthAppName AS oauthappname FROM LoginAudit WHERE oAuthAppName IS NOT NULL`,
      },
      {
        type: 'token',
        field: 'oauthaccesstokenname',
        sql: `SELECT DISTINCT oAuthAccessTokenName AS oauthaccesstokenname FROM LoginAudit WHERE oAuthAccessTokenName IS NOT NULL`,
      },
      {
        type: 'user',
        field: 'emailaddress',
        sql: `SELECT DISTINCT emailAddress AS emailaddress FROM LoginAudit WHERE emailAddress IS NOT NULL`,
      },
    ];

    // Soft per-query: Last Logins entity discovery is a fallback path. One
    // LoginAudit SuiteQL failure should not abort the whole entity list.
    for (const query of queries) {
      try {
        const rows = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(query.sql) as Record<string, string>[];
        for (const row of rows || []) {
          const name = row[query.field];
          if (name) {
            entities.push({ type: query.type, name });
          }
        }
      } catch (e) {
        log.error({
          title: 'SuiteToolsCommonJobs:getLastLoginEntitiesFromAudit() query failed',
          details: { type: query.type, error: e },
        });
      }
    }

    return entities;
  }
}
