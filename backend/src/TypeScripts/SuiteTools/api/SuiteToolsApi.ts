/**
 * SuiteTools API - Main API Class
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

// Imports for modular API components
import { SuiteToolsApiGet } from './SuiteToolsApiGet';
import { SuiteToolsApiPost } from './SuiteToolsApiPost';
import { SuiteToolsApiPut } from './SuiteToolsApiPut';
import { SuiteToolsApiModel } from './SuiteToolsApiModel';
import { SuiteToolsCommon } from '../common/SuiteToolsCommon';

// Re-export types for other modules
export type { Response, RequestBody, RequestBodyData } from './types';

/**
 * SuiteTools API Main Class
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsApi {
  private _stApiGet: SuiteToolsApiGet;
  private _stApiPost: SuiteToolsApiPost;
  private _stApiPut: SuiteToolsApiPut;
  private _stApiModel: SuiteToolsApiModel;
  private _stCommon: SuiteToolsCommon;

  get stApiGet(): SuiteToolsApiGet {
    return this._stApiGet;
  }
  get stApiPost(): SuiteToolsApiPost {
    return this._stApiPost;
  }
  get stApiPut(): SuiteToolsApiPut {
    return this._stApiPut;
  }
  get stApiModel(): SuiteToolsApiModel {
    return this._stApiModel;
  }
  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor() {
    this._stCommon = new SuiteToolsCommon();
    this._stApiModel = new SuiteToolsApiModel(this._stCommon);
    this._stApiGet = new SuiteToolsApiGet(this._stCommon, this._stApiModel);
    this._stApiPost = new SuiteToolsApiPost(this._stCommon, this._stApiModel);
    this._stApiPut = new SuiteToolsApiPut(this._stCommon, this._stApiModel);
  }
}
