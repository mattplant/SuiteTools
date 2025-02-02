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
// import error = require('N/error');
import log = require('N/log');
import record = require('N/record');
// import runtime = require('N/runtime');

// import { SuiteToolsLibraryNetSuiteSuiteQl } from '../idev-suitetools-library';
// const stLibNsSuiteQl = new SuiteToolsLibraryNetSuiteSuiteQl(null);

// import { SuiteToolsLibraryNetSuiteRecord } from '../idev-suitetools-library';
// const stLibNsRecord = new SuiteToolsLibraryNetSuiteRecord(null);

/**
 * getInputData() stage function
 *
 * @param context: EntryPoints.MapReduce.getInputDataContext
 */
export function getInputData(context: EntryPoints.MapReduce.getInputDataContext) {
  log.debug('*START*', '<------------------- START ------------------->');
  log.debug('getInputData() initiated with', JSON.stringify(context));

  try {
    // TODO get the records list from the script parameter
    // records = JSON.parse(
    //   String(runtime.getCurrentScript().getParameter({ name: '' }))
    // );
    // log.debug('getInputData() records list =', records);

    const records = [16420418, 12233752];

    return records;
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

  // determine the record type and action from the script parameters
  // const type = String(runtime.getCurrentScript().getParameter({ name: 'custscript_idev_st_mr_jobs_type' }));
  // const action = String(runtime.getCurrentScript().getParameter({ name: 'custscript_idev_st_mr_jobs_action' }));
  // get the record id from the context
  const id = String(JSON.parse(context.values[0]));
  // perform the action
  recordAction('customer', 'activate', id);
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

function recordAction(type: string, action: string, id: string) {
  log.debug('recordAction() initiated with', { type: type, action: action, id: id });

  let jobRecord = null;
  // perform the action
  switch (action) {
    case 'activate':
      jobRecord = record.load({ type: type, id: id });
      jobRecord.setValue('isinactive', false);
      jobRecord.save();
      log.audit('recordAction() activated', { type: type, id: id });
      break;
    case 'inactivate':
      jobRecord = record.load({ type: type, id: id });
      jobRecord.setValue('isinactive', true);
      jobRecord.save();
      log.audit('recordAction() inactivated', { type: type, id: id });
      break;
    default:
      log.error('recordAction() error', `Unknown record action: ${action}`);
  }
}
