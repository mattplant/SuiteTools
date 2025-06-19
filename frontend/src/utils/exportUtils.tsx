/**
 * React Data Grid's export utilities
 *
 * From React Data Grid website "exportUtils.tsx" file located at
 *   https://github.dev/adazzle/react-data-grid/tree/main/website/exportUtlis.tsx
 *   from verison 7.0.0-beta.47
 *
 * @license MIT
 *
 * Original work Copyright (c) 2014 Prometheus Research
 * Modified work Copyright 2015 Adazzle
 *
 * For the original source code please see https://github.com/prometheusresearch-archive/react-grid
 * For the modified source code please see https://github.dev/adazzle/react-data-grid
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

export function exportToCsv(gridEl: HTMLDivElement, fileName: string) {
  const { head, body, foot } = getGridContent(gridEl);
  const content = [...head, ...body, ...foot].map((cells) => cells.map(serialiseCellValue).join(',')).join('\n');

  downloadFile(fileName, new Blob([content], { type: 'text/csv;charset=utf-8;' }));
}

// export async function exportToPdf(gridEl: HTMLDivElement, fileName: string) {
//   const { head, body, foot } = getGridContent(gridEl);
//   const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')]);
//   const doc = new jsPDF({
//     orientation: 'l',
//     unit: 'px',
//   });

//   autoTable(doc, {
//     head,
//     body,
//     foot,
//     horizontalPageBreak: true,
//     styles: { cellPadding: 1.5, fontSize: 8, cellWidth: 'wrap' },
//     tableWidth: 'wrap',
//   });
//   doc.save(fileName);
// }

function getGridContent(gridEl: HTMLDivElement) {
  return {
    head: getRows('.rdg-header-row'),
    body: getRows('.rdg-row:not(.rdg-summary-row)'),
    foot: getRows('.rdg-summary-row'),
  };

  function getRows(selector: string) {
    return Array.from(gridEl.querySelectorAll<HTMLDivElement>(selector)).map((gridRow) => {
      return Array.from(gridRow.querySelectorAll<HTMLDivElement>('.rdg-cell')).map((gridCell) => gridCell.innerText);
    });
  }
}

function serialiseCellValue(value: unknown) {
  if (typeof value === 'string') {
    const formattedValue = value.replace(/"/g, '""');
    return formattedValue.includes(',') ? `"${formattedValue}"` : formattedValue;
  }
  return value;
}

function downloadFile(fileName: string, data: Blob) {
  const downloadLink = document.createElement('a');
  downloadLink.download = fileName;
  const url = URL.createObjectURL(data);
  downloadLink.href = url;
  downloadLink.click();
  URL.revokeObjectURL(url);
}
