/**
 * SuiteTools API - PUT Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from "N/log";
import * as error from "N/error";
import type { Response } from "./types";
import { assertIsRequestBody, assertIsRequestBodyData } from "./types";
import type { SuiteToolsCommon } from "../common/SuiteToolsCommon";
import type { SuiteToolsApiModel } from "./SuiteToolsApiModel";
import { validateMutationResponse } from "./SuiteToolsApiMutationValidate";

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
    log.debug({ title: "SuiteToolsApiPut:process() initiated", details: requestBody });
    assertIsRequestBody(requestBody);

    let response: Response;
    const endpoint = requestBody.endpoint;
    switch (endpoint) {
      case "settings":
        response = this.putSettings(requestBody.data);
        break;
      default:
        throw error.create({
          name: "SUITE_TOOLS_INVALID_PARAMETER",
          message: `Invalid parameter: endpoint=${endpoint}`,
          notifyOff: true,
        });
    }

    return validateMutationResponse("put", endpoint, response);
  }

  public putSettings(requestBodyData: object): Response {
    assertIsRequestBodyData(requestBodyData);

    const devMode = (requestBodyData as { devMode?: boolean }).devMode;
    // The checkbox field cannot take undefined; an absent devMode means "off". The frontend
    // always sends Boolean(...), so this coalesce is a guard rather than a live code path.
    const updateSettings = { custrecord_idev_st_setting_dev_mode: devMode ?? false };

    // Without a settings record there is nothing to update. This used to read an optional field
    // straight into `String(...)`, which accepts anything -- so a save before the app had ever
    // been opened, or after the record was deleted, targeted record id "undefined".
    const settings = this.stCommon.stSettings.getSettings();
    if (!settings) {
      log.error({ title: `SuiteToolsApiPut:putSettings() no settings record`, details: null });
      return { status: 409, data: {}, message: "Settings record not found. Open the app to initialise it." };
    }

    const success = this.stCommon.stLib.stLibNs.stLibNsRecord.updateCustomRecordEntry(
      this.stCommon.appSettingsRecord,
      String(settings.recordId),
      updateSettings,
    );
    log.debug({ title: `SuiteToolsApiPut:putSettings() saved successfully?`, details: success });

    // Report what actually happened; this previously returned 200 "Settings updated" even when
    // the update failed.
    if (!success) {
      return { status: 500, data: {}, message: "Settings update failed" };
    }

    return { status: 200, data: {}, message: "Settings updated" };
  }
}
