/**
 * SuiteTools Saved Search Job Script
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

import { SuiteToolsApp } from '../idev-suitetools-app';

/**
 * execute() function
 *
 * @param context: EntryPoints.Scheduled.executeContext
 */
export function execute(context: EntryPoints.Scheduled.executeContext): boolean {
  try {
    log.debug('*START*', '<------------------- START ------------------->');
    log.debug('execute() initiated with', JSON.stringify(context));

    const stApp = new SuiteToolsApp();

    // TODO grab saved search id from script parameter
    const searchId = 'customsearch_bp_server_script_errors';
    const searchResults = stApp.stLib.stLibNs.stLibNsSearch.run(searchId);
    log.debug('execute() searchResults', JSON.stringify(searchResults));

    // are there any results?
    if (searchResults.length > 0) {
      // email the results
      stApp.stLib.stLibNs.stLibNsEmail.sendNotification('test subject', JSON.stringify(searchResults, null, 3));
    }

    log.debug('*END*', '<------------------- END ------------------->');
  } catch (e) {
    log.error('execute() error', JSON.stringify(e));
  }

  return true;
}
