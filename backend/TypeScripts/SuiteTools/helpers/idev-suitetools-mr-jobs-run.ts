// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Map/Reduce script that executes queued SuiteTools jobs.
 *
 * @fileoverview
 * NetSuite invokes this directly, and the frontend triggers it indirectly: `initiateJob` posts
 * to the RESTlet, which queues a run that this script picks up. Each staged run produces the
 * JobRun records the UI later displays.
 *
 * @remarks
 * Because execution is asynchronous, a successful `initiateJob` response means queued, not
 * finished — the UI must poll for the JobRun rather than assume completion. Map/Reduce is what
 * lets a job exceed a single script's governance budget.
 *
 * @see ../app/SuiteToolsApp.ts – the application context this runs within
 * @see ../../../../frontend/src/adapters/api/job.ts – where a run is initiated
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 *
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */

import type { EntryPoints } from "N/types";
import * as log from "N/log";
import * as runtime from "N/runtime";
import { SuiteToolsApp } from "../app/SuiteToolsApp";

/**
 * getInputData() stage function
 *
 * @param context: EntryPoints.MapReduce.getInputDataContext
 */
export function getInputData(
  context: EntryPoints.MapReduce.getInputDataContext,
): Array<{ id: number; data?: string; name?: string }> {
  log.debug("*START*", "<------------------- START ------------------->");
  log.debug("getInputData() initiated with", JSON.stringify(context));

  try {
    const jobId = Number(runtime.getCurrentScript().getParameter({ name: "custscript_idev_st_mr_jobs_id" }));
    const jobDataParam = runtime.getCurrentScript().getParameter({ name: "custscript_idev_st_mr_jobs_data" });
    // Keep as string for the reduce stage; empty/null means no payload.
    const jobData =
      jobDataParam == null || jobDataParam === "" || jobDataParam === "null" ? undefined : String(jobDataParam);

    if (jobId) {
      // Property must be `data` — reduce reads values.data (was incorrectly `name`).
      // Omit `data` entirely when there is no payload rather than setting it to undefined: the
      // Map/Reduce framework JSON-serializes this and JSON.stringify drops undefined values, so
      // an absent key is already what reduce() sees. Same bytes, honest type.
      const inputData = jobData === undefined ? [{ id: jobId }] : [{ id: jobId, data: jobData }];
      log.debug(`getInputData() running for job #${jobId}`, { hasData: Boolean(jobData) });
      return inputData;
    }

    // run all active jobs
    const stApp = new SuiteToolsApp(); // bootstrap SuiteTools App as library
    return stApp.stCommon.stJobs.getScheduledJobs();
  } catch (e) {
    log.error("getInputData() error", JSON.stringify(e));
  }

  // Falling out of the try without returning previously yielded undefined, which the
  // Map/Reduce framework cannot consume. An empty list is the correct "no work" input.
  return [];
}

/**
 * reduce() stage function
 *
 * @param context: EntryPoints.MapReduce.reduceContext
 * @returns {void}
 */
export function reduce(context: EntryPoints.MapReduce.reduceContext): void {
  log.debug("reduce() initiated", JSON.stringify(context));
  let jobId = null;
  let jobData: object | undefined;
  const values = JSON.parse(context.values[0]);
  jobId = values.id;

  // Payload was historically stored on `name`; prefer `data`, fall back for older runs.
  const rawJobData = values.data ?? values.name;
  if (rawJobData != null && rawJobData !== "" && rawJobData !== "null") {
    try {
      jobData = typeof rawJobData === "string" ? JSON.parse(rawJobData) : rawJobData;
    } catch (e) {
      log.error("reduce() jobData data was not a valid object", JSON.stringify(e));
    }
  }

  if (jobId) {
    const stApp = new SuiteToolsApp(); // bootstrap SuiteTools App as library
    stApp.stCommon.stJobs.runJob(jobId, jobData);
  } else {
    log.error("reduce() error", "No job id found in context");
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
