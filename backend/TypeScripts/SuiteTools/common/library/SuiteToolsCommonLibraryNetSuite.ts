/**
 * SuiteTools Library - NetSuite Library
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import { SuiteToolsCommonLibraryNetSuiteEmail } from './SuiteToolsCommonLibraryNetSuiteEmail';
import { SuiteToolsCommonLibraryNetSuiteFile } from './SuiteToolsCommonLibraryNetSuiteFile';
import { SuiteToolsCommonLibraryNetSuiteHttp } from './SuiteToolsCommonLibraryNetSuiteHttp';
import { SuiteToolsCommonLibraryNetSuiteRecord } from './SuiteToolsCommonLibraryNetSuiteRecord';
import { SuiteToolsCommonLibraryNetSuiteScript } from './SuiteToolsCommonLibraryNetSuiteScript';
import { SuiteToolsCommonLibraryNetSuiteSearch } from './SuiteToolsCommonLibraryNetSuiteSearch';
import { SuiteToolsCommonLibraryNetSuiteSuiteQl } from './SuiteToolsCommonLibraryNetSuiteSuiteQl';
import { SuiteToolsCommonLibraryNetSuiteTask } from './SuiteToolsCommonLibraryNetSuiteTask';
import type { SuiteToolsCommon } from '../SuiteToolsCommon';

/**
 * SuiteTools NetSuite Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuite {
  private _stCommon: SuiteToolsCommon;
  private _stLibNsEmail: SuiteToolsCommonLibraryNetSuiteEmail;
  private _stLibNsFile: SuiteToolsCommonLibraryNetSuiteFile;
  private _stLibNsHttp: SuiteToolsCommonLibraryNetSuiteHttp;
  private _stLibNsRecord: SuiteToolsCommonLibraryNetSuiteRecord;
  private _stLibNsScript: SuiteToolsCommonLibraryNetSuiteScript;
  private _stLibNsSearch: SuiteToolsCommonLibraryNetSuiteSearch;
  private _stLibNsSuiteQl: SuiteToolsCommonLibraryNetSuiteSuiteQl;
  private _stLibNsTask: SuiteToolsCommonLibraryNetSuiteTask;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }
  get stLibNsEmail(): SuiteToolsCommonLibraryNetSuiteEmail {
    return this._stLibNsEmail;
  }
  get stLibNsFile(): SuiteToolsCommonLibraryNetSuiteFile {
    return this._stLibNsFile;
  }
  get stLibNsHttp(): SuiteToolsCommonLibraryNetSuiteHttp {
    return this._stLibNsHttp;
  }
  get stLibNsRecord(): SuiteToolsCommonLibraryNetSuiteRecord {
    return this._stLibNsRecord;
  }
  get stLibNsScript(): SuiteToolsCommonLibraryNetSuiteScript {
    return this._stLibNsScript;
  }
  get stLibNsSearch(): SuiteToolsCommonLibraryNetSuiteSearch {
    return this._stLibNsSearch;
  }
  get stLibNsSuiteQl(): SuiteToolsCommonLibraryNetSuiteSuiteQl {
    return this._stLibNsSuiteQl;
  }
  get stLibNsTask(): SuiteToolsCommonLibraryNetSuiteTask {
    return this._stLibNsTask;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
    this._stLibNsEmail = new SuiteToolsCommonLibraryNetSuiteEmail(this.stCommon);
    this._stLibNsFile = new SuiteToolsCommonLibraryNetSuiteFile(this.stCommon);
    this._stLibNsHttp = new SuiteToolsCommonLibraryNetSuiteHttp(this.stCommon);
    this._stLibNsRecord = new SuiteToolsCommonLibraryNetSuiteRecord(this.stCommon);
    this._stLibNsScript = new SuiteToolsCommonLibraryNetSuiteScript(this.stCommon);
    this._stLibNsSearch = new SuiteToolsCommonLibraryNetSuiteSearch(this.stCommon);
    this._stLibNsSuiteQl = new SuiteToolsCommonLibraryNetSuiteSuiteQl(this.stCommon);
    this._stLibNsTask = new SuiteToolsCommonLibraryNetSuiteTask(this.stCommon);
  }
}
