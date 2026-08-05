/**
 * SuiteTools API - PUT Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from 'N/log';
import * as error from 'N/error';
import type { Response } from './types';
import { assertIsRequestBody, assertIsRequestBodyData } from './types';
import type { SuiteToolsCommon } from '../common/SuiteToolsCommon';
import type { SuiteToolsApiModel } from './SuiteToolsApiModel';

/**
 * SuiteTools API PUT Class
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsApiPut {
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
    log.debug({ title: 'SuiteToolsApiPut:process() initiated', details: requestBody });
    assertIsRequestBody(requestBody);

    let response: Response;
    const endpoint = requestBody.endpoint;
    switch (endpoint) {
      case 'settings':
        response = this.putSettings(requestBody.data);
        break;
      default:
        throw error.create({
          name: 'SUITE_TOOLS_INVALID_PARAMETER',
          message: `Invalid parameter: endpoint=${endpoint}`,
          notifyOff: true,
        });
    }

    return response;
  }

  public putSettings(requestBodyData: object): Response {
    assertIsRequestBodyData(requestBodyData);

    const devMode = (requestBodyData as any).devMode;
    const updateSettings = { custrecord_idev_st_setting_dev_mode: devMode };
    this.stCommon.stSettings.getSettings();
    const success = this.stCommon.stLib.stLibNs.stLibNsRecord.updateCustomRecordEntry(
      this.stCommon.appSettingsRecord,
      String(this.stCommon.stSettings.recordId),
      updateSettings,
    );
    log.debug({ title: `SuiteToolsApiPut:putSettings() saved successfully?`, details: success });

    return {
      status: 200,
      data: {},
      message: 'Settings updated',
    };
  }
}
