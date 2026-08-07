/**
 * SuiteTools Data Collection Library
 *
 * This library provides functions to collect data from NetSuite pages.
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * Copyright (C) 2024  Matthew Plant
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { ApmUnavailableError } from './ApmUnavailableError';

export interface NetSuiteResponse {
  success: boolean;
  message: string;
  data: object;
}

/**
 * Get data from NetSuite page
 * @param url - the URL to the page to load
 * @returns string
 */
export async function getDataFromPageContent(url: string): Promise<NetSuiteResponse> {

  const response = await fetch(url, { credentials: 'same-origin' }).catch((error) => {
    console.error(`getDataFromPageContent() error =\n`, error);
    throw error;
  });

  const content = await response.text();
  if (!content) {
    throw new Error(`getDataFromPageContent() no content found at ${url}`);
  }

  // Missing APM / failed scriptlet typically returns HTTP 500 + HTML Notice, or HTML with 200.
  if (!response.ok) {
    const snippet = content.replace(/\s+/g, ' ').slice(0, 180);
    throw new ApmUnavailableError(
      `NetSuite returned HTTP ${response.status} for ${url}. ` +
        `This usually means the APM scriptlet is missing or failed. Preview: ${snippet}`,
      { url, status: response.status },
    );
  }

  if (/^\s*</.test(content)) {
    throw new ApmUnavailableError(
      `Expected JSON from ${url} but received HTML. ` +
        `The APM concurrency SuiteApp may not be installed or the scriptlet crashed.`,
      { url, status: response.status },
    );
  }

  let data: NetSuiteResponse;
  try {
    data = JSON.parse(content);
  } catch (error) {
    console.error('getDataFromPageContent() error parsing JSON data:', error);
    throw new Error(`Failed to parse JSON from ${url}: ${error instanceof Error ? error.message : String(error)}`);
  }

  if (!data.success && data.message) {
    throw new Error(`getDataFromPageContent() response not successful: ${data.message}`);
  }

  return data;
}

/**
 * Gets data from table shown in NetSuite's UI.
 *
 * Allows access to your own NetSuite data that is not available via APIs.
 * @param url - url of the page
 * @param id - id of the table element on page
 * @returns data from page table
 */
export async function getDataFromPageTable(
  url: string,
  id: string,
  removeHeader: boolean = false,
): Promise<string[][]> {
  const tableHtml = await getPageTable(url, id);
  const tableArray = convertTableToArray(tableHtml);
  if (removeHeader) {
    tableArray.shift();
  }

  // check to see if NetSuite is reporting that the there are not records to show - [['No records to show.', '']]
  const noRecords =
    tableArray.length === 1 &&
    Array.isArray(tableArray[0]) &&
    tableArray[0].length >= 1 &&
    String(tableArray[0][0]).includes('No records to show');
  if (noRecords) {
    return [];
  }


  return tableArray;
}

async function getPageTable(url: string, id: string): Promise<string> {
  const response = await fetch(url);
  const pageData = await response.text();
  const parser = new DOMParser();
  const domPage = parser.parseFromString(pageData, 'text/html');

  // Session expiry often returns the login form instead of the list page.
  const looksLikeLogin =
    Boolean(domPage.querySelector('form[name="login"], input#userName, input[name="email"]')) &&
    !domPage.getElementById(id);
  if (looksLikeLogin) {
    throw new Error(`NetSuite returned a login page for ${url}. Refresh SuiteTools and try again.`);
  }

  let element: Element | null = domPage.getElementById(id);
  if (!element) {
    // NetSuite list markup varies by version; fall back to common list tables.
    element =
      domPage.querySelector(`table#${CSS.escape(id)}`) ||
      domPage.querySelector('table.listtable') ||
      domPage.querySelector('table.uir-list-table') ||
      domPage.querySelector('table[id*="div__body"]');
  }
  if (!element) {
    throw new Error(`List table "${id}" not found on ${url}. NetSuite may have changed the page markup.`);
  }

  return element.outerHTML;
}

function convertTableToArray(html: string): string[][] {
  const table: string[][] = [];
  const tableRows = html.split('</tr>');
  tableRows.forEach((row) => {
    const tableColumns = row.split('</td>');
    const tableRow: string[] = [];
    tableColumns.forEach((column) => {
      if (column.includes('<a')) {
        const matchResult = column.match(/<a[^>]*>[\s\S]*?<\/a>/);
        if (matchResult) {
          tableRow.push(matchResult[0]);
        } else {
          tableRow.push(column.replace(/<[^>]*>?/gm, '').trim());
        }
      } else {
        const tableCell = column.replace(/<[^>]*>?/gm, '').trim();
        tableRow.push(tableCell);
      }
    });
    if (!(Array.isArray(tableRow) && tableRow.length === 1 && tableRow[0] === '')) {
      table.push(tableRow);
    }
  });

  return table;
}
