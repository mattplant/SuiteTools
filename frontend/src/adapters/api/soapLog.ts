// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for a single SOAP web services status row (scrape-based).
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
