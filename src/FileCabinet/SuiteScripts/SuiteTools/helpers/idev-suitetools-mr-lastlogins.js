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
define(["require", "exports", "N/error", "N/log", "N/record", "N/runtime", "N/search"], function (require, exports, error, log, record, runtime, search) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.summarize = exports.reduce = exports.getInputData = void 0;
    /**
     * getInputData() stage function
     *
     * @param context: EntryPoints.MapReduce.getInputDataContext
     */
    function getInputData(context) {
        log.debug('*START*', '<------------------- START ------------------->');
        log.debug('getInputData() initiated with', JSON.stringify(context));
        try {
            // get the search id from the script parameter (e.g. 'customsearch_df6_b_celigo_odw_if_lookup')
            const searchId = String(runtime.getCurrentScript().getParameter({ name: 'custscript_bp_mr_cash_sale_search_id' }));
            const csSearch = search.load({ id: searchId });
            return csSearch;
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
        log.debug('reduce() initiated', null);
        // get the required values
        const contextObj = JSON.parse(context.values[0]);
        log.debug('reduce() contextObj = ', JSON.stringify(contextObj));
        // get the item fulfillment
        const ifName = contextObj.values.transactionnumber;
        // get the sales order id that the item fulfillment was created from
        const soId = contextObj.values.createdfrom.value;
        const soName = contextObj.values.createdfrom.text;
        try {
            // transform the item fulfillment into a cash sale
            const cs = record.transform({
                fromType: record.Type.SALES_ORDER,
                fromId: soId,
                toType: record.Type.CASH_SALE,
                isDynamic: true,
            });
            // save the cash sale
            const csId = cs.save();
            if (csId) {
                log.audit('SUCCESS', `Created Cash Sale id ${csId} from ${ifName} on ${soName}`);
            }
        }
        catch (e) {
            log.error('reduce() error', e);
            // add an audit log entry for the failure
            const msg = `Error creating Cash Sale from ${ifName} on ${soName}`;
            log.audit('FAILURE', msg);
            // throw new error so that it get's added to the summary and sent in the notification
            throw error.create({
                name: 'MR_CASH_SALE_ERROR',
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
            // generate and log summary
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
