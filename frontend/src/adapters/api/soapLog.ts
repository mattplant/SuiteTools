// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Adapter for a single SOAP web services status row.
 *
 * @fileoverview
 * Scrape-based: SOAP status is not exposed through the RESTlet, so a single row is found by id
 * within the already-scraped set rather than fetched. That is why this module calls
 * `handleNotFound` directly instead of configuring a singular adapter.
 *
 * @remarks
 * A lookup only succeeds if the scrape has been performed — this cannot resolve a row from a
 * cold start the way a RESTlet-backed adapter can, so deep-linking to a SOAP detail view
 * depends on the list having been loaded.
 *
 * @see ./soapLogsScrape.ts – the scrape this searches
 * @see ./adapterUtils.ts – handleNotFound and the contract this mirrors
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { SoapLogBundle } from "@suiteworks/suitetools-shared";
import type { SoapLog } from "@suiteworks/suitetools-shared";
import { handleNotFound } from "./adapterUtils";
import { adaptSoapLog } from "./soapLogAdapt";
import { findScrapedSoapLog } from "./soapLogsScrape";

/**
 * Resolve a single SOAP log by job id from the Sync Status scrape.
 * @param id - SOAP job id.
 * @returns The adapted SOAP log.
 * @throws {NotFoundError} When the id is missing or the scrape has no matching row.
 */
export async function getSoapLog(id: number): Promise<SoapLog> {
  if (typeof window !== "undefined" && window.location.href.includes("localhost")) {
    return adaptSoapLog(
      SoapLogBundle.parse({
        id: 1,
        startDate: "12/22/2024 8:53:01 pm",
        duration: 0.123,
        integration: '<a href="/app/common/integration/integrapp.nl?id=123">Application URL 1</a>',
        action: "search",
        recordType: "",
        user: "idev@systems.com",
        status: "FINISHED",
        records: 0,
        recordsFinished: 0,
        recordsFailed: 0,
        recordsReturned: 0,
        request: "jobid=1",
        response: "jobid=1",
      }),
    );
  }

  if (!id) {
    return handleNotFound("soapLog", id);
  }

  const record = await findScrapedSoapLog(id);
  if (!record) {
    return handleNotFound("soapLog", id);
  }

  return adaptSoapLog(SoapLogBundle.parse(record));
}
