/**
 * SuiteTools Last Logins Map/Reduce Script
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
 * @NScriptType MapReduceScript
 * @NApiVersion 2.1
 */

import { EntryPoints } from 'N/types';
import error = require('N/error');
import log = require('N/log');
import runtime = require('N/runtime');
import { SuiteToolsCommonLibraryNetSuiteSuiteQl } from '../idev-suitetools-common';
import { SuiteToolsCommonLibraryNetSuiteRecord } from '../idev-suitetools-common';

type MapReduceKey = {
  type: string;
  name: string;
};

/**
 * getInputData() stage function
 *
 * @param context: EntryPoints.MapReduce.getInputDataContext
 */
export function getInputData(context: EntryPoints.MapReduce.getInputDataContext) {
  log.debug('*START*', '<------------------- START ------------------->');
  log.debug('getInputData() initiated with', JSON.stringify(context));

  let entityRecords = null;
  try {
    entityRecords = JSON.parse(
      String(runtime.getCurrentScript().getParameter({ name: 'custscript_idev_st_mr_lastlogins_entity' })),
    );
    log.debug('getInputData() identity records =', entityRecords);

    return entityRecords;
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
  log.debug('reduce() initiated', context);
  let entityRecordName = null;
  let entityRecordType = null;

  try {
    const contextObj = JSON.parse(context.values[0]);
    entityRecordType = contextObj.type;
    entityRecordName = contextObj.name;

    // determine last login
    let whereClause = null;
    switch (entityRecordType) {
      case 'integration':
        whereClause = `WHERE oAuthAppName = '${entityRecordName}'`;
        break;
      case 'token':
        whereClause = `WHERE oAuthAccessTokenName = '${entityRecordName}'`;
        break;
      case 'user':
        whereClause = `WHERE emailAddress = '${entityRecordName}'`;
        break;
      default:
        log.error('reduce() error', `Unknown identity record type: ${entityRecordType}`);
    }
    if (whereClause) {
      const key: MapReduceKey = {
        type: entityRecordType,
        name: entityRecordName,
      };
      const lastLoginSQL = `SELECT MAX(TO_CHAR(LoginAudit.date, 'YYYY-MM-DD HH24:MI:SS')) AS logindate
      FROM LoginAudit ${whereClause}`;
      const stLibNsSuiteQl = new SuiteToolsCommonLibraryNetSuiteSuiteQl(null);
      const lastLogin = stLibNsSuiteQl.getSqlValue(lastLoginSQL, 'logindate');
      // return the result
      context.write({
        key: key,
        value: lastLogin,
      });
    }
  } catch (e) {
    log.error('reduce() error', e);
    const msg = `Error in looking up last login for "${entityRecordName}" ${entityRecordType}`;
    log.audit('FAILURE', msg);
    throw error.create({
      name: 'SUITE_TOOLS_MR_LAST_LOGINS_ERROR',
      message: msg,
    });
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

    const entityRecords = [];
    context.output.iterator().each(function (key, value) {
      const keyObj = JSON.parse(key);
      entityRecords.push({ name: keyObj, lastLogin: value });
      return true;
    });
    const results = {
      finished: new Date().toLocaleString(),
      data: entityRecords,
    };
    log.debug('summarize() results = ', JSON.stringify(results));
    const updateSettings = { custrecord_idev_st_config_last_logins: JSON.stringify(results) };
    const appSettingsRecordId = JSON.parse(
      String(runtime.getCurrentScript().getParameter({ name: 'custscript_idev_st_mr_lastlogins_set_id' })),
    );
    const stLibNsRecord = new SuiteToolsCommonLibraryNetSuiteRecord(null);
    const success = stLibNsRecord.updateCustomRecord(
      'customrecord_idev_suitetools_settings',
      appSettingsRecordId,
      updateSettings,
    );
    log.debug({ title: `getInputData() saved last logins successfully?`, details: success });

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
