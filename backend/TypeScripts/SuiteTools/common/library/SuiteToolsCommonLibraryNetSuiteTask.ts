/**
 * SuiteTools Library - NetSuite Task Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from 'N/log';
import * as task from 'N/task';

// Forward declaration to avoid circular dependency
declare class SuiteToolsCommon {}

/**
 * SuiteTools NetSuite Task Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteTask {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Submits the NetSuite task.
   *
   * @param scriptType
   * @param scriptId
   * @param deploymentId
   * @param params
   * @returns the script task id
   */
  public submit(taskType: string, scriptId: string, deploymentId: string, params: object): string {
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteTask:submit() initiated',
      details: { taskType: taskType, scriptId: scriptId, deploymentId: deploymentId },
    });

    let scriptTaskId = '';
    let taskTypeEnum: task.TaskType = null;
    // set the task type to the task.TaskType enum
    if (taskType === 'SCHEDULED_SCRIPT') {
      taskTypeEnum = task.TaskType.SCHEDULED_SCRIPT;
    } else if (taskType === 'MAP_REDUCE') {
      taskTypeEnum = task.TaskType.MAP_REDUCE;
    } else if (taskType === 'CSV_IMPORT') {
      taskTypeEnum = task.TaskType.CSV_IMPORT;
    } else if (taskType === 'ENTITY_DEDUPLICATION') {
      taskTypeEnum = task.TaskType.ENTITY_DEDUPLICATION;
    } else if (taskType === 'WORKFLOW_TRIGGER') {
      taskTypeEnum = task.TaskType.WORKFLOW_TRIGGER;
    } else if (taskType === 'SEARCH') {
      taskTypeEnum = task.TaskType.SEARCH;
    } else if (taskType === 'RECORD_ACTION') {
      taskTypeEnum = task.TaskType.RECORD_ACTION;
    } else if (taskType === 'SUITE_QL') {
      taskTypeEnum = task.TaskType.SUITE_QL;
    } else if (taskType === 'QUERY') {
      taskTypeEnum = task.TaskType.QUERY;
    }
    if (taskTypeEnum) {
      // initiate the last logins map/reduce script
      const scriptTask = task.create({
        taskType: task.TaskType.MAP_REDUCE, // Cast to the correct type
        scriptId: scriptId,
        deploymentId: deploymentId,
        params: params,
      });
      scriptTaskId = scriptTask.submit();
    }
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteTask:submit() returning',
      details: scriptTaskId,
    });

    return scriptTaskId;
  }
}
