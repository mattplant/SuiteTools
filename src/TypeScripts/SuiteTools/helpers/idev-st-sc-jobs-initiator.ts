/**
 * SuiteTools Jobs Initiator Script
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
 * @NScriptType ScheduledScript
 * @NApiVersion 2.1
 */

import { EntryPoints } from 'N/types';
import log = require('N/log');
import task = require('N/task');

/**
 * execute() function
 *
 * @param context: EntryPoints.Scheduled.executeContext
 */
export function execute(context: EntryPoints.Scheduled.executeContext): boolean {
  try {
    log.debug('*START*', '<------------------- START ------------------->');
    log.debug('execute() initiated with', JSON.stringify(context));

    // execute the SuiteTools Saved Search Job script
    log.audit({ title: 'execute() execute the scheduled script', details: null });
    const scriptTask = task.create({
      taskType: task.TaskType.SCHEDULED_SCRIPT,
      scriptId: 'customscript_idev_st_sc_jobs_search',
      deploymentId: 'customdeploy_idev_st_sc_jobs_search',
      params: {
        // custscript_bp_mr_odw_bg_export_orders: JSON.stringify(uniqueOrderIds),
      },
    });
    const scriptTaskId = scriptTask.submit();
    log.audit({
      title: 'execute() initiated SuiteTools Saved Search Job script',
      details: 'scriptTaskId = ' + scriptTaskId,
    });

    log.debug('*END*', '<------------------- END ------------------->');
  } catch (e) {
    log.error('execute() error', JSON.stringify(e));
  }

  return true;
}
