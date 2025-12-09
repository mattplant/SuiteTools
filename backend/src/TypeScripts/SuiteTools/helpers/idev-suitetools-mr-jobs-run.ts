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
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

import type { EntryPoints } from 'N/types';
import * as log from 'N/log';
import * as runtime from 'N/runtime';
import { SuiteToolsApp } from '../app/SuiteToolsApp';

/**
 * getInputData() stage function
 *
 * @param context: EntryPoints.MapReduce.getInputDataContext
 */
export function getInputData(context: EntryPoints.MapReduce.getInputDataContext): Array<{ id: number; name?: string }> {
  log.debug('*START*', '<------------------- START ------------------->');
  log.debug('getInputData() initiated with', JSON.stringify(context));

  try {
    const jobId = Number(
      runtime.getCurrentScript().getParameter({
        name: 'custscript_idev_st_mr_jobs_id',
      }),
    );
    const jobData = String(
      runtime.getCurrentScript().getParameter({
        name: 'custscript_idev_st_mr_jobs_data',
      }),
    );
    if (jobId) {
      // run the specified job
      const inputData = [{ id: jobId, name: jobData }];
      log.debug('getInputData() running for job #' + jobId, null);
      return inputData;
    } else {
      // run all active jobs
      const stApp = new SuiteToolsApp(); // bootstrap SuiteTools App as library
      return stApp.stCommon.stJobs.getScheduledJobs();
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
  let jobId = null;
  let jobData: object;
  const values = JSON.parse(context.values[0]);
  jobId = values.id;
  // if we are supplied job data verify that it is valid
  if (values.data) {
    try {
      jobData = JSON.parse(values.data);
    } catch (e) {
      log.error('reduce() jobData data was not a valid object', JSON.stringify(e));
    }
  }

  if (jobId) {
    const stApp = new SuiteToolsApp(); // bootstrap SuiteTools App as library
    stApp.stCommon.stJobs.runJob(jobId, jobData);
  } else {
    log.error('reduce() error', 'No job id found in context');
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
