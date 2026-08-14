// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file Shared SoapLog view-model helpers.
 */

import type { SoapLog } from "@suiteworks/suitetools-shared";

/**
 * Enrich a validated SoapLog with navigation URLs.
 * @param soapLog - Validated soap log payload.
 */
export function adaptSoapLog(soapLog: SoapLog): SoapLog {
  return { ...soapLog, urlDetail: soapLog.urlDetail ?? `#/soapLog/${soapLog.id}` };
}
