/**
 * SuiteTools Library
 *
 * This is the library file for SuiteTools.
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
 * @NApiVersion 2.1
 */

import * as runtime from 'N/runtime';
import * as url from 'N/url';
import { SuiteToolsCommonJobs } from './SuiteToolsCommonJobs';
import { SuiteToolsCommonSettings } from './SuiteToolsCommonSettings';
import { SuiteToolsCommonLibrary } from './library/SuiteToolsCommonLibrary';

/**
 * Common functionality between SuiteTools App and SuiteTools API
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommon {
  // classes
  private _stJobs: SuiteToolsCommonJobs;
  private _stSettings: SuiteToolsCommonSettings;
  private _stLib: SuiteToolsCommonLibrary;
  // application url
  private _appScriptId = 'customscript_idev_suitetools_app';
  private _appDeploymentId = 'customdeploy_idev_suitetools_app';
  private _appUrl: string;
  // the application directory in the /SuiteScripts folder
  private _appDir = 'SuiteTools';
  // application files
  private _appCssFile = 'dist/output.css';
  private _appJsFile = 'dist/app-bundle.js';
  // application settings record
  private _appSettingsRecord = 'customrecord_idev_suitetools_settings'; // the application settings custom record

  get stJobs(): SuiteToolsCommonJobs {
    return this._stJobs;
  }
  get stSettings(): SuiteToolsCommonSettings {
    return this._stSettings;
  }
  get stLib(): SuiteToolsCommonLibrary {
    return this._stLib;
  }

  get appUrl(): string {
    return this._appUrl;
  }
  get appDir(): string {
    return this._appDir;
  }
  get appCssFile(): string {
    return this._appCssFile;
  }
  get appJsFile(): string {
    return this._appJsFile;
  }
  get appSettingsRecord(): string {
    return this._appSettingsRecord;
  }
  get runtime(): typeof runtime {
    return runtime;
  }
  get isAdmin(): boolean {
    return runtime.getCurrentUser().roleId == 'administrator';
  }
  get isProduction(): boolean {
    return String(runtime.EnvType[runtime.envType]) === 'PRODUCTION';
  }

  constructor() {
    this._stJobs = new SuiteToolsCommonJobs(this);
    this._stSettings = new SuiteToolsCommonSettings(this);
    this._stLib = new SuiteToolsCommonLibrary(this);

    // TODO should this be moved into the bootstrap() method?
    this._appUrl = url.resolveScript({
      scriptId: this._appScriptId,
      deploymentId: this._appDeploymentId,
      returnExternalUrl: false,
    });
  }
}
