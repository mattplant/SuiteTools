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
define(["require", "exports", "N/error", "N/log", "N/runtime", "../idev-suitetools-library", "../idev-suitetools-library"], function (require, exports, error, log, runtime, idev_suitetools_library_1, idev_suitetools_library_2) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.reduce = exports.getInputData = void 0;
    const stLibNsSuiteQl = new idev_suitetools_library_1.SuiteToolsLibraryNetSuiteSuiteQl(null);
    const stLibNsRecord = new idev_suitetools_library_2.SuiteToolsLibraryNetSuiteRecord(null);
    /**
     * getInputData() stage function
     *
     * @param context: EntryPoints.MapReduce.getInputDataContext
     */
    function getInputData(context) {
        log.debug('*START*', '<------------------- START ------------------->');
        log.debug('getInputData() initiated with', JSON.stringify(context));
        let integrations = null;
        try {
            // get the integration list from the script parameter
            integrations = JSON.parse(String(runtime.getCurrentScript().getParameter({ name: 'custscript_idev_st_mr_lastlogins_ints' })));
            log.debug('getInputData() integrations =', integrations);
            return integrations;
        }
        catch (e) {
            log.error('getInputData() error', JSON.stringify(e));
        }
    }
    exports.getInputData = getInputData;
    /**
     * reduce() stage function
     *
     * @param context: EntryPoints.MapReduce.reduceContext
     * @returns {void}
     */
    function reduce(context) {
        // log.debug('reduce() initiated', null);
        let integrationName = null;
        try {
            // get the required values
            const contextObj = JSON.parse(context.values[0]);
            log.debug('reduce() contextObj = ', JSON.stringify(contextObj));
            // get the integration name
            integrationName = contextObj.name;
            // determine last login
            const lastLoginSQL = `SELECT
        MAX(TO_CHAR(LoginAudit.date, 'YYYY-MM-DD HH:MI:SS')) AS logindate
      FROM
        LoginAudit
      WHERE
      oAuthAppName = '${integrationName}'
      GROUP BY LoginAudit.oauthaccesstokenname`;
            const lastLogin = stLibNsSuiteQl.getSqlValue(lastLoginSQL, 'logindate');
            // return the result
            context.write({
                key: integrationName,
                value: lastLogin,
            });
        }
        catch (e) {
            log.error('reduce() error', e);
            // add an audit log entry for the failure
            const msg = `Error in looking up last login for ${integrationName}`;
            log.audit('FAILURE', msg);
            // throw new error so that it get's added to the summary and sent in the notification
            throw error.create({
                name: 'SUITE_TOOLS_MR_LAST_LOGINS_ERROR',
                message: msg,
            });
        }
    }
    exports.reduce = reduce;
    /**
     * summarize() stage function
     *
     * @param context: EntryPoints.MapReduce.summarizeContext
     * @returns {void}
     */
    function summarize(context) {
        try {
            log.debug('summarize() context = ', JSON.stringify(context));
            // get the SuiteTools applicaiton settings record id
            const appSettingsRecordId = JSON.parse(String(runtime.getCurrentScript().getParameter({ name: 'custscript_idev_st_mr_lastlogins_set_id' })));
            log.debug('summarize() appSettingsRecordId =', appSettingsRecordId);
            // collect the results
            const integrations = [];
            context.output.iterator().each(function (key, value) {
                integrations.push({ name: key, lastLogin: value });
                return true;
            });
            // write the results to the SuiteTools application settings record
            const updateSettings = { custrecord_idev_st_config_last_logins: JSON.stringify(integrations) };
            log.debug('summarize() updateSettings = ', JSON.stringify(integrations));
            const success = stLibNsRecord.updateCustomRecord('customrecord_idev_suitetools_settings', appSettingsRecordId, updateSettings);
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
                log.error('summarize() ' + scriptErrors.length + ' error(s) occured', scriptErrors.join('\n'));
            }
            else {
                log.debug('summarize()', 'Script completed without errors.');
            }
            // log.debug('STATS - Map Time Total (seconds)', context.mapSummary.seconds);
            log.debug('STATS - Reduce Time Total (seconds)', context.reduceSummary.seconds);
            log.debug('STATS - Max Reduce Concurrency Utilized', context.reduceSummary.concurrency);
            log.debug('STATS - Overall Usage Units Consumed', context.usage);
            log.debug('STATS - Overall Concurrency Utilized', context.concurrency);
            log.debug('STATS - Overall Number Of Yields', context.yields);
            log.debug('*END*', '<-------------------- END -------------------->');
        }
        catch (e) {
            log.error('summarize() error', JSON.stringify(e));
        }
    }
    exports.summarize = summarize;
});
