export function getPageTableContent(url: string, id: string): unknown {
  console.log('getPageTableContent() initiated', { url, id });

  // TODO enhance to support local environment

  return fetch(url)
    .then((response) => response.text())
    .then((pageData) => {
      console.log('pageData = ' + pageData);
      const parser = new DOMParser();
      const domPage = parser.parseFromString(pageData, 'text/html');
      const element = domPage.getElementById(id);
      if (!element) {
        throw new Error(`Element with id ${id} not found`);
      }
      const tableHtml = element.outerHTML;
      console.log('tableHtml = ' + tableHtml);

      // convert tableHtml to tableJson
      const tableJson: string[][] = [];
      const tableRows = tableHtml.split('</tr>');
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
          tableJson.push(tableRow);
          // console.log('tableRows =', tableRows);
        }
      });
      console.log('tableJson =', tableJson);

      return tableJson;
    })
    .catch((error) => {
      console.error(`getPageTableContent() Error =\n`, error);
    });
}
