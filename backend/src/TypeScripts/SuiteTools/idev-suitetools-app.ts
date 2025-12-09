/**
 * SuiteTools SuiteToolsApp
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
 * @NScriptName SuiteTools SuiteToolsApp
 * @NScriptType Suitelet
 * @NApiVersion 2.1
 */

import type { EntryPoints } from 'N/types';
import * as log from 'N/log';
import { SuiteToolsApp } from './app/SuiteToolsApp';

/**
 * Suitelet onRequest event handler
 *
 * Routes the SuiteTools application requests to the appropriate handler.
 *
 * @param context - this Suitelet's context object
 */
export function onRequest(context: EntryPoints.Suitelet.onRequestContext): void {
  log.debug({ title: 'SuiteToolsApp:onRequest()', details: context });

  // initialize the SuiteTools application
  new SuiteToolsApp(context);
}
