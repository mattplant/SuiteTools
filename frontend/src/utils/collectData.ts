/**
 * SuiteTools Data Collection Library
 *
 * This library provides functions to collect data from NetSuite pages.
 *
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

export interface NetSuiteResponse {
  success: boolean;
  message: string;
  data: object;
}

/**
 * Get data from NetSuite page
 *
 * @param url - the URL to the page to load
 * @returns string
 */
export async function getDataFromPageContent(url: string): Promise<NetSuiteResponse> {
  console.log('getDataFromPageContent() initiated', { url });

  let data: NetSuiteResponse;
  const content = await fetch(url)
    .then((response) => {
      return response.text();
    })
    .catch((error) => {
      console.error(`getDataFromPageContent() error =\n`, error);
      throw error;
    });
  if (!content) {
    throw new Error(`getDataFromPageContent() no content found at ${url}`);
  }
  try {
    data = JSON.parse(content);
  } catch (error) {
    console.error('getDataFromPageContent() error parsing JSON data:', error);
    throw error;
  }

  if (!data.success && data.message) {
    throw new Error(`getDataFromPageContent() response not successful: ${data.message}`);
  }
  console.log('getDataFromPageContent() returning', data);

  return data;
}

/**
 * Gets data from table shown in NetSuite's UI.
 *
 * Allows access to your own NetSuite data that is not available via APIs.
 *
 * @param url - url of the page
 * @param id - id of the table element on page
 * @returns data from page table
 */
export async function getDataFromPageTable(
  url: string,
  id: string,
  removeHeader: boolean = false,
): Promise<string[][]> {
  console.log('getDataFromPageTable() initiated', { url, id });
  const tableHtml = await getPageTable(url, id);
  const tableArray = convertTableToArray(tableHtml);
  if (removeHeader) {
    tableArray.shift();
  }

  // check to see if NetSuite is reporting that the there are not records to show - [['No records to show.', '']]
  const noRecords =
    tableArray.length === 1 &&
    Array.isArray(tableArray[0]) &&
    tableArray[0].length === 2 &&
    tableArray[0][0] === 'No records to show.';
  if (noRecords) {
    console.log('getDataFromPageTable() has no records to show');
    return [];
  }

  console.log('getDataFromPageTable() returning', tableArray);

  return tableArray;
}

async function getPageTable(url: string, id: string): Promise<string> {
  // console.log('getPageTable() initiated', { url, id });
  const table = await fetch(url)
    .then((response) => response.text())
    .then((pageData) => {
      // console.log('getPageTable() pageData = ' + pageData);
      const parser = new DOMParser();
      const domPage = parser.parseFromString(pageData, 'text/html');
      const element = domPage.getElementById(id);
      if (!element) {
        throw new Error(`Element with id ${id} not found`);
      }

      return element.outerHTML;
    })
    .catch((error) => {
      console.error(`getPageTable() Error =\n`, error);
      throw error;
    });
  // console.log('getPageTable() returning', table);

  return table;
}

function convertTableToArray(html: string): string[][] {
  const table: string[][] = [];
  const tableRows = html.split('</tr>');
  tableRows.forEach((row) => {
    const tableColumns = row.split('</td>');
    const tableRow: string[] = [];
    tableColumns.forEach((column) => {
      if (column.includes('<a')) {
        const matchResult = column.match(/<a[^>]*>[^<]*<\/a>/);
        if (matchResult) {
          column = matchResult[0];
          tableRow.push(column);
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
