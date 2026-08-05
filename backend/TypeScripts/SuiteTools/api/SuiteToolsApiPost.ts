/**
 * SuiteTools API - POST Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from 'N/log';
import * as error from 'N/error';
import type { Response } from './types';
import { assertIsRequestBody } from './types';
import type { SuiteToolsCommon } from '../common/SuiteToolsCommon';
import type { SuiteToolsApiModel } from './SuiteToolsApiModel';

type RequestParams = { [key: string]: string };

/**
 * SuiteTools API POST Class
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsApiPost {
  private _stCommon: SuiteToolsCommon;
  private _stApiModel: SuiteToolsApiModel;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }
  get stApiModel(): SuiteToolsApiModel {
    return this._stApiModel;
  }

  constructor(stCommon: SuiteToolsCommon, stApiModel: SuiteToolsApiModel) {
    this._stCommon = stCommon;
    this._stApiModel = stApiModel;
  }

  public process(requestBody: unknown): Response {
    log.debug({ title: 'SuiteToolsApiPost:process() initiated', details: requestBody });
    assertIsRequestBody(requestBody);
    let response: Response;
    const endpoint = requestBody.endpoint;
    switch (endpoint) {
      case 'initiateJob':
        response = this.initiateJob(requestBody.data as RequestParams);
        break;
      default:
        throw error.create({
          name: 'SUITE_TOOLS_INVALID_PARAMETER',
          message: `Invalid parameter: endpoint=${endpoint}`,
          notifyOff: true,
        });
    }
    log.debug({ title: 'SuiteToolsApiPost:process() returning', details: response });

    return response;
  }

  /**
   * Initiate Job
   *
   * @param requestParams
   * @returns message that the job was initiated
   */
  private initiateJob(requestParams: RequestParams): Response {
    log.debug({ title: 'SuiteToolsApiPost:initiateJob() initiated', details: requestParams });
    let id = requestParams.id;
    let data: object;
    if (!id) {
      // set to 0 to run all active jobs
      id = '0';
    }
    // check to see if requestParams.data exists
    if (requestParams.data && typeof requestParams.data === 'object') {
      data = requestParams.data;
      log.debug({ title: 'SuiteToolsApiPost:initiateJob() includes data object', details: data });
    }
    // initiate the job
    this.stApiModel.initiateJob(id, data);
    const message = 'InitiateJob() initiated with with id of ' + id;

    return {
      status: 200,
      data: {},
      message: message,
    };
  }
}
