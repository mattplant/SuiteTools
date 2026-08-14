// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for SOAP web services status rows (scrape-based).
 */

import type { SoapLogs } from "@suiteworks/suitetools-shared";
import type { CriteriaFields } from "../../components/shared/criteria/types";
import { scrapeSoapLogs } from "./soapLogsScrape";

export { adaptSoapLog } from "./soapLogAdapt";

/**
 * Fetch SOAP web services status rows from NetSuite's Sync Status page.
 * @param fields - Optional integration id filter.
 */
export async function getSoapLogs(fields: CriteriaFields): Promise<SoapLogs> {
  return scrapeSoapLogs(fields);
}
