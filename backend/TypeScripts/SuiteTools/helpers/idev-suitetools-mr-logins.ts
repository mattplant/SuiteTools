// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Map/Reduce script that collects last-login timestamps.
 *
 * @fileoverview
 * NetSuite schedules and invokes this directly. It reads the login audit with SuiteQL and
 * writes a per-entity last-login summary that the settings payload later carries to the
 * frontend, where token, user and integration lists join against it by name.
 *
 * @remarks
 * Runs as Map/Reduce because the login audit is far too large to page through in a Suitelet's
 * governance budget — the staged model is what keeps it inside limits. The key is
 * `{ type, name }`, so entities are matched by name downstream and a rename breaks the join
 * until this reruns.
 *
 * @see ../common/library/SuiteToolsCommonLibraryNetSuiteSuiteQl.ts – the SuiteQL access used here
 * @see ../../../../frontend/src/adapters/api/tokens.ts – a consumer of the lastLogins payload
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 *
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

import type { EntryPoints } from "N/types";
import * as error from "N/error";
import * as log from "N/log";
import * as runtime from "N/runtime";
import { SuiteToolsCommonLibraryNetSuiteSuiteQl } from "../common/library/SuiteToolsCommonLibraryNetSuiteSuiteQl";
import { SuiteToolsCommonLibraryNetSuiteRecord } from "../common/library/SuiteToolsCommonLibraryNetSuiteRecord";

type MapReduceKey = { type: string; name: string };

/**
 * getInputData() stage function
 *
 * @param context: EntryPoints.MapReduce.getInputDataContext
 */
// `getInputData` is the *function* type for the entry point; the value returned is a
// `GetInputDataResponse`. The mismatch only compiled while null was assignable to anything.
export function getInputData(
  context: EntryPoints.MapReduce.getInputDataContext,
): EntryPoints.MapReduce.GetInputDataResponse {
  log.debug("*START*", "<------------------- START ------------------->");
  log.debug("getInputData() initiated with", JSON.stringify(context));

  let entityRecords: EntryPoints.MapReduce.GetInputDataResponse;
  try {
    entityRecords = JSON.parse(
      String(runtime.getCurrentScript().getParameter({ name: "custscript_idev_st_mr_logins_entity" })),
    );
    log.debug("getInputData() identity records =", entityRecords);

    return entityRecords;
  } catch (e) {
    log.error("getInputData() error", JSON.stringify(e));
    // Returning null previously handed the Map/Reduce framework a value it cannot consume.
    // An empty list is the correct "no work" input.
    return [];
  }
}

/**
 * reduce() stage function
 *
 * @param context: EntryPoints.MapReduce.reduceContext
 * @returns {void}
 */
export function reduce(context: EntryPoints.MapReduce.reduceContext): void {
  log.debug("reduce() initiated", context);
  let entityRecordName = null;
  let entityRecordType = null;

  try {
    const contextObj = JSON.parse(context.values[0]);
    entityRecordType = contextObj.type;
    entityRecordName = contextObj.name;

    // determine last login
    let whereClause = null;
    switch (entityRecordType) {
      case "integration":
        whereClause = `WHERE oAuthAppName = '${entityRecordName}'`;
        break;
      case "token":
        whereClause = `WHERE oAuthAccessTokenName = '${entityRecordName}'`;
        break;
      case "user":
        whereClause = `WHERE emailAddress = '${entityRecordName}'`;
        break;
      default:
        log.error("reduce() error", `Unknown identity record type: ${entityRecordType}`);
    }
    if (whereClause) {
      const key: MapReduceKey = { type: entityRecordType, name: entityRecordName };
      const lastLoginSQL = `SELECT MAX(TO_CHAR(LoginAudit.date, 'YYYY-MM-DD HH24:MI:SS')) AS logindate
      FROM LoginAudit ${whereClause}`;
      const stLibNsSuiteQl = new SuiteToolsCommonLibraryNetSuiteSuiteQl(null);
      const lastLogin = stLibNsSuiteQl.getSqlValue(lastLoginSQL, "logindate");
      // save only the valid results
      if (lastLogin) {
        context.write({ key: key, value: lastLogin });
      }
    }
  } catch (e) {
    log.error("reduce() error", e);
    const msg = `Error in looking up last login for "${entityRecordName}" ${entityRecordType}`;
    log.audit("FAILURE", msg);
    throw error.create({ name: "SUITE_TOOLS_MR_LAST_LOGINS_ERROR", message: msg });
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
    log.debug("summarize() context = ", JSON.stringify(context));

    const entityRecords: { name: unknown; lastLogin: string }[] = [];
    context.output.iterator().each((key, value) => {
      const keyObj = JSON.parse(key);
      entityRecords.push({ name: keyObj, lastLogin: value });
      return true;
    });
    const results = { finished: new Date().toLocaleString(), data: entityRecords };
    log.debug("summarize() results = ", JSON.stringify(results));
    const updateSettings = { custrecord_idev_st_config_last_logins: JSON.stringify(results) };
    const appSettingsRecordId = JSON.parse(
      String(runtime.getCurrentScript().getParameter({ name: "custscript_idev_st_mr_logins_set_id" })),
    );
    const stLibNsRecord = new SuiteToolsCommonLibraryNetSuiteRecord(null);
    const success = stLibNsRecord.updateCustomRecordEntry(
      "customrecord_idev_suitetools_settings",
      appSettingsRecordId,
      updateSettings,
    );
    log.debug({ title: `getInputData() saved last logins successfully?`, details: success });

    // generate and log standard summary
    const scriptErrors: string[] = [];
    context.mapSummary.errors.iterator().each((_key, value) => {
      scriptErrors.push(JSON.stringify(JSON.parse(value).cause));
      return true;
    });
    context.reduceSummary.errors.iterator().each((_key, value) => {
      scriptErrors.push(JSON.stringify(JSON.parse(value).cause));
      return true;
    });
    if (scriptErrors.length > 0) {
      log.error(`summarize() ${scriptErrors.length} error(s) occurred`, scriptErrors.join("\n"));
    } else {
      log.debug("summarize()", "Script completed without errors.");
    }
    // log.debug('STATS - Map Time Total (seconds)', context.mapSummary.seconds);
    log.debug("STATS - Reduce Time Total (seconds)", context.reduceSummary.seconds);
    log.debug("STATS - Max Reduce Concurrency Utilized", context.reduceSummary.concurrency);
    log.debug("STATS - Overall Usage Units Consumed", context.usage);
    log.debug("STATS - Overall Concurrency Utilized", context.concurrency);
    log.debug("STATS - Overall Number Of Yields", context.yields);
    log.debug("*END*", "<-------------------- END -------------------->");
  } catch (e) {
    log.error("summarize() error", JSON.stringify(e));
  }
}
