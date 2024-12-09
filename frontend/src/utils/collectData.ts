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
  // console.log('convertTableToArray() initiated', html);

  const table: string[][] = [];
  const tableRows = html.split('</tr>');
  tableRows.forEach((row) => {
    // console.log('row =', row);
    const tableColumns = row.split('</td>');
    const tableRow: string[] = [];
    tableColumns.forEach((column) => {
      // console.log('col =', column);
      const tableCell = column.replace(/<[^>]*>?/gm, '').trim();
      // console.log('tableCell =', tableCell);
      tableRow.push(tableCell);
    });
    if (!(Array.isArray(tableRow) && tableRow.length === 1 && tableRow[0] === '')) {
      // console.log('ADDING TABLE ROW =', tableRow);
      table.push(tableRow);
      // console.log('tableRows =', tableRows);
    }
  });
  // console.log('convertTableToArray() returning', table);

  return table;
}
