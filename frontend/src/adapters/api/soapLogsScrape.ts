// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file Scrape SOAP web services status rows from NetSuite UI.
 * @description
 * SOAP job status is not exposed via a stable SuiteScript search for this app.
 * The Sync Status list (`syncstatus.nl`) is the source of truth.
 */

import { SoapLogBundle } from "@suiteworks/suitetools-shared";
import type { SoapLog, SoapLogs } from "@suiteworks/suitetools-shared";
import type { CriteriaFields } from "../../components/shared/criteria/types";
import { adaptSoapLog } from "./soapLogAdapt";

const JOBID_RE = /(?:jobid|id)=([^&"'#\s]+)/i;

/**
 * Format a date as NetSuite list filter expects (unpadded M/D/YYYY).
 * @param date - Date to format.
 */
function formatNsListDate(date: Date): string {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

/**
 * Extract a numeric SOAP job id from a cell that may contain HTML.
 * Prefers digits in link text / bare cell text; falls back to a numeric jobid query param.
 * @param cell - Raw table cell value.
 */
export function extractSoapJobId(cell: string): number | null {
  const stripped = cell.replace(/<[^>]*>/g, "").trim();
  const fromText = Number(stripped);
  if (Number.isFinite(fromText) && fromText > 0) {
    return fromText;
  }

  const jobMatch = cell.match(JOBID_RE);
  if (jobMatch) {
    const asNumber = Number(jobMatch[1]);
    if (Number.isFinite(asNumber) && asNumber > 0) {
      return asNumber;
    }
  }

  return null;
}

/**
 * Build Sync Status list URLs to try (most specific first).
 * @param fromDate - Inclusive start date for the NetSuite date filter.
 */
export function buildSoapLogsUrls(fromDate: Date): string[] {
  const dateFrom = encodeURIComponent(formatNsListDate(fromDate));
  const dateTo = encodeURIComponent(formatNsListDate(new Date()));
  const dateFromTime = encodeURIComponent("12:00 am");
  const dateToTime = encodeURIComponent("11:59 pm");
  const customRange =
    `daterange=CUSTOM&datemodi=WITHIN&datefrom=${dateFrom}&datefromtime=${dateFromTime}` +
    `&dateto=${dateTo}&datetotime=${dateToTime}&date=CUSTOM`;

  return [
    `/app/webservices/syncstatus.nl?frame=B&sortcol=jobid&sortdir=DESC&${customRange}&segment=0`,
    // Legacy-style URL (from-date only) used before the adapter migration.
    `/app/webservices/syncstatus.nl?frame=B&sortcol=jobid&sortdir=DESC&daterange=CUSTOM&datemodi=WITHIN&datefrom=${dateFrom}&datefromtime=${dateFromTime}&date=CUSTOM&segment=0`,
    "/app/webservices/syncstatus.nl?frame=B&sortcol=jobid&sortdir=DESC",
    "/app/webservices/syncstatus.nl",
  ];
}

type RawSoapRow = {
  id: number;
  startDate: string;
  duration: number;
  integration: string;
  action: string;
  recordType: string;
  user: string;
  status: string;
  records: number;
  recordsFinished: number;
  recordsFailed: number;
  recordsReturned: number;
  request: string;
  response: string;
};

const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, "").trim();

const toNumber = (value: string | undefined): number => {
  const n = Number(stripHtml(value ?? ""));
  return Number.isFinite(n) ? n : 0;
};

/**
 * Map one Sync Status table row into a SoapLog-shaped object.
 * Finds the job id in any cell (leading edit/checkbox columns are common).
 * @param record - Cell values for one table row.
 */
export function parseSoapLogCells(record: string[]): RawSoapRow | null {
  let id: number | null = null;
  let idIdx = -1;
  for (let i = 0; i < record.length; i++) {
    const found = extractSoapJobId(record[i] ?? "");
    if (found) {
      id = found;
      idIdx = i;
      break;
    }
  }
  if (!id || idIdx < 0) {
    return null;
  }

  // Columns after the job id follow the Sync Status list order.
  const after = record.slice(idIdx + 1);

  return {
    id,
    startDate: stripHtml(after[0] ?? ""),
    duration: toNumber(after[1]),
    integration: after[2] ?? "",
    action: stripHtml(after[3] ?? ""),
    recordType: stripHtml(after[4] ?? ""),
    user: stripHtml(after[5] ?? ""),
    status: stripHtml(after[6] ?? ""),
    records: toNumber(after[7]),
    recordsFinished: toNumber(after[8]),
    recordsFailed: toNumber(after[9]),
    recordsReturned: toNumber(after[10]),
    request: after[11] ?? "",
    response: after[12] ?? "",
  };
}

function filterByIntegrations(rows: SoapLogs, integrations: string[] | undefined): SoapLogs {
  const ids = (integrations ?? []).map(String).filter((value) => value !== "");
  if (ids.length === 0) {
    return rows;
  }
  return rows.filter((row) => row.integrationId != null && ids.includes(String(row.integrationId)));
}

/**
 * DOM-parse Sync Status HTML into raw SoapLog rows.
 * @param html - Full HTML document from syncstatus.nl.
 */
export function parseSoapLogsHtml(html: string): RawSoapRow[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  const looksLikeLogin =
    Boolean(doc.querySelector('form[name="login"], input#userName, input[name="email"]')) &&
    !doc.querySelector('table.listtable, table.uir-list-table, table[id*="div__body"], #div__body');
  if (looksLikeLogin) {
    throw new Error("NetSuite returned a login page for syncstatus.nl. Refresh SuiteTools and try again.");
  }

  const table =
    doc.getElementById("div__body") ||
    doc.querySelector("table#div__body") ||
    doc.querySelector("table.listtable") ||
    doc.querySelector("table.uir-list-table") ||
    doc.querySelector('table[id*="div__body"]');

  if (!table) {
    throw new Error("SOAP Sync Status list table was not found. NetSuite may have changed the page markup.");
  }

  const rows = Array.from(table.querySelectorAll("tr"));
  const parsed: RawSoapRow[] = [];

  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll("td")).map((td) => {
      const anchor = td.querySelector('a[href*="jobid"], a[href*="wslog"], a[href*="integrapp"]');
      if (anchor) {
        // Keep href + text so id / integration extraction can use either.
        return `${anchor.getAttribute("href") || ""} ${anchor.textContent || ""} ${td.textContent || ""}`;
      }
      return (td.textContent || "").replace(/\s+/g, " ").trim();
    });
    if (cells.length === 0) {
      continue;
    }
    if (cells.some((cell) => cell.includes("No records to show"))) {
      return [];
    }
    const mapped = parseSoapLogCells(cells);
    if (mapped) {
      parsed.push(mapped);
    }
  }

  return parsed;
}

async function fetchSoapLogsHtml(url: string): Promise<string> {
  const response = await fetch(url, { credentials: "same-origin" });
  if (!response.ok) {
    throw new Error(`Failed to load SOAP Sync Status (${response.status}) from ${url}`);
  }
  return response.text();
}

/**
 * Scrape SOAP web services status rows from NetSuite.
 * @param fields - Optional integration id filter.
 */
export async function scrapeSoapLogs(fields: CriteriaFields): Promise<SoapLogs> {
  if (typeof window !== "undefined" && window.location.href.includes("localhost")) {
    return SoapLogBundle.parseMany([
      {
        id: 12345,
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
        request: "jobid=12345",
        response: "jobid=12345",
      },
    ]).map(adaptSoapLog);
  }

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - 90);
  const urls = buildSoapLogsUrls(fromDate);

  let rawRows: RawSoapRow[] = [];
  let lastError: unknown;

  for (const url of urls) {
    try {
      const html = await fetchSoapLogsHtml(url);
      rawRows = parseSoapLogsHtml(html);
      if (rawRows.length > 0) {
        break;
      }
    } catch (err) {
      lastError = err;
      console.warn("[soapLogsScrape] URL failed", { url, err });
    }
  }

  if (rawRows.length === 0 && lastError) {
    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  }

  const safe = SoapLogBundle.safeParseMany(rawRows);
  const parsed: SoapLog[] = [];
  for (const result of safe) {
    if (result.success) {
      parsed.push(adaptSoapLog(result.data));
    }
  }

  if (rawRows.length > 0 && parsed.length === 0) {
    throw new Error("SOAP Sync Status rows were found but failed schema validation. Check the browser console.");
  }

  return filterByIntegrations(parsed, fields.integrations);
}

/**
 * Find a scraped SOAP log by job id.
 * @param id - SOAP job id.
 */
export async function findScrapedSoapLog(id: number): Promise<SoapLog | undefined> {
  const rows = await scrapeSoapLogs({});
  return rows.find((row) => row.id === id);
}
