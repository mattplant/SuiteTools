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
