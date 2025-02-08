/**
 * SuiteTools Jobs Run Map/Reduce Script
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
 * @NScriptType MapReduceScript
 * @NApiVersion 2.1
 */

import { EntryPoints } from 'N/types';
import * as log from 'N/log';
import * as runtime from 'N/runtime';
import {
  SuiteToolsCommonLibraryNetSuiteRecord,
  SuiteToolsCommonLibraryNetSuiteSuiteQl,
} from '../idev-suitetools-common';
const stLibNsSuiteQl = new SuiteToolsCommonLibraryNetSuiteSuiteQl(null);
const stLibNsRecord = new SuiteToolsCommonLibraryNetSuiteRecord(null);

/**
 * getInputData() stage function
 *
 * @param context: EntryPoints.MapReduce.getInputDataContext
 */
export function getInputData(context: EntryPoints.MapReduce.getInputDataContext) {
  log.debug('*START*', '<------------------- START ------------------->');
  log.debug('getInputData() initiated with', JSON.stringify(context));

  try {
    const jobId = Number(
      runtime.getCurrentScript().getParameter({
        name: 'custscript_idev_st_mr_jobs_id',
      }),
    );
    log.debug('getInputData() jobId', jobId);
    if (jobId) {
      // run the specified job
      const inputData = [{ id: jobId }];
      log.debug('getInputData() running for job #' + jobId, inputData);
      return inputData;
    } else {
      // run all active jobs
      return getJobs();
    }
  } catch (e) {
    log.error('getInputData() error', JSON.stringify(e));
  }
}

/**
 * reduce() stage function
 *
 * @param context: EntryPoints.MapReduce.reduceContext
 * @returns {void}
 */
export function reduce(context: EntryPoints.MapReduce.reduceContext): void {
  log.debug('reduce() initiated', JSON.stringify(context));
  let result: object;
  let completed = false;
  // get the values from the context
  // const values = context.values.map((value) => JSON.parse(value));
  // log.debug('reduce() values =', values);

  // get the record id from the context
  const values = JSON.parse(context.values[0]);
  const jobId = values.id;
  // const name = values.name;
  // create new job run record
  if (jobId) {
    const jobRunRecordId = createJobRunRecord(jobId);

    // execute the job
    log.debug('reduce() executing job', { jobId });
    switch (String(jobId)) {
      case '1': // Recent Script Errors
        result = getRecentScriptErrors();
        completed = true;
        log.debug('reduce() response.data', result);
        break;
      // case '2': // Test Job
      //   // jobRecord = record.load({ type: type, id: id });
      //   // jobRecord.setValue('isinactive', true);
      //   // jobRecord.save();
      //   log.audit('recordAction() inactivated', { type: type, id: id });
      // break;
      default:
        log.error('record() error', `Unknown job id: ${jobId}`);
    }

    // update job run record after execution
    updateJobRunRecord(String(jobRunRecordId), completed, JSON.stringify(result));
  } else {
    log.error('reduce() error', 'No job id provided');
  }
}

/**
 * summarize() stage function
 *
 * @param context: EntryPoints.MapReduce.summarizeContext
 * @returns {void}
 */
export function summarize(context: EntryPoints.MapReduce.summarizeContext): void {
  try {
    log.debug('summarize() context = ', JSON.stringify(context));
    // generate and log standard summary
    const scriptErrors = [];
    context.mapSummary.errors.iterator().each(function (key, value) {
      scriptErrors.push(JSON.stringify(JSON.parse(value).cause));
      return true;
    });
    context.reduceSummary.errors.iterator().each(function (key, value) {
      scriptErrors.push(JSON.stringify(JSON.parse(value).cause));
      return true;
    });
    if (scriptErrors.length > 0) {
      log.error('summarize() ' + scriptErrors.length + ' error(s) occurred', scriptErrors.join('\n'));
    } else {
      log.debug('summarize()', 'Script completed without errors.');
    }
    // log.debug('STATS - Map Time Total (seconds)', context.mapSummary.seconds);
    log.debug('STATS - Reduce Time Total (seconds)', context.reduceSummary.seconds);
    log.debug('STATS - Max Reduce Concurrency Utilized', context.reduceSummary.concurrency);
    log.debug('STATS - Overall Usage Units Consumed', context.usage);
    log.debug('STATS - Overall Concurrency Utilized', context.concurrency);
    log.debug('STATS - Overall Number Of Yields', context.yields);
    log.debug('*END*', '<-------------------- END -------------------->');
  } catch (e) {
    log.error('summarize() error', JSON.stringify(e));
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getJobs(): any[] {
  log.debug('getJobs() initiated', null);
  const customRecord = 'customrecord_idev_suitetools_job';
  const sql = `SELECT
    ${customRecord}.id,
    ${customRecord}.name,
  FROM
    ${customRecord}
  WHERE
    ${customRecord}.isinactive = 'F'
  ORDER BY
    ${customRecord}.id ASC`;
  const sqlResults = stLibNsSuiteQl.query(sql);
  if (sqlResults.length === 0) {
    log.audit(`getJobs() - No active job records found`, null);
  } else {
    log.debug({ title: 'SuiteToolsApiModel:getJobs() returning', details: sqlResults });
  }

  return sqlResults;
}

function createJobRunRecord(id: string): number {
  log.debug('createJobRunRecord() initiated', { id });
  // save new job run record
  const customRecord = 'customrecord_idev_suitetools_job_run';
  const jobRunRecordId = stLibNsRecord.createCustomRecord(customRecord, {
    custrecord_idev_st_mr_job_run_job_id: id,
  });
  log.debug({ title: 'SuiteToolsController:getJobInit() created job run record', details: jobRunRecordId });

  return jobRunRecordId;
}

function updateJobRunRecord(id: string, completed: boolean, results: string) {
  log.debug('updateJobRunRecord() initiated', { id, completed });
  // update job run record
  const customRecord = 'customrecord_idev_suitetools_job_run';
  stLibNsRecord.updateCustomRecord(customRecord, id, {
    custrecord_idev_st_mr_job_run_completed: completed,
    custrecord_idev_st_mr_job_run_results: results,
  });
}

// TODO update to use last execution date
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getRecentScriptErrors(): any[] {
  log.debug({
    title: `getScriptLogsViaSuiteQL() initiated`,
    details: null,
  });

  // get the errors from the script execution log
  let levels = ['ERROR', 'EMERGENCY', 'SYSTEM'];
  // const date = '15';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any[] = [];

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
  if (levels) {
    if (Array.isArray(levels)) {
      levels = levels.map((type) => {
        return `'${type.toUpperCase()}'`;
      });
      where.push(`ScriptNote.type IN (${levels.join(',')})`);
    }
  }

  // TODO use something like this to get from last run date
  // where.push(`ScriptNote.date >= TRUNC( SYSDATE ) - ${date}`);

  where.push(`ScriptNote.date > SYSDATE - ( 15 / 1440 )`);
  if (where.length > 0) {
    sql += ` WHERE ${where.join(' AND ')}`;
  }
  // add order by
  sql += ` ORDER BY ScriptNote.internalId DESC`;
  const sqlResults = stLibNsSuiteQl.query(sql);
  if (sqlResults.length !== 0) {
    result = sqlResults;
  }

  return result;
}
