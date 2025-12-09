/**
 * SuiteTools Library - Main Library Class
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import { SuiteToolsCommonLibraryGeneral } from './SuiteToolsCommonLibraryGeneral';
import { SuiteToolsCommonLibraryNetSuite } from './SuiteToolsCommonLibraryNetSuite';
import type { SuiteToolsCommon } from '../SuiteToolsCommon';

/**
 * SuiteTools Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibrary {
  private _stCommon: SuiteToolsCommon;
  private _stLibGeneral: SuiteToolsCommonLibraryGeneral;
  private _stLibNs: SuiteToolsCommonLibraryNetSuite;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  get stLibGeneral(): SuiteToolsCommonLibraryGeneral {
    return this._stLibGeneral;
  }

  get stLibNs(): SuiteToolsCommonLibraryNetSuite {
    return this._stLibNs;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
    this._stLibGeneral = new SuiteToolsCommonLibraryGeneral(this.stCommon);
    this._stLibNs = new SuiteToolsCommonLibraryNetSuite(this.stCommon);
  }
}
