/**
 * SuiteTools Library - General Utilities
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from 'N/log';

// Forward declaration to avoid circular dependency
declare class SuiteToolsCommon {}

/**
 * SuiteTools General Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryGeneral {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Format date object into a string with the format YYYY-MM-DD hh24:mi:ss.
   *
   * @param {Date} date - the date object to format
   * @returns {string} formattedDate - the formatted date string
   */
  public formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    let hour = '' + d.getHours();
    let minute = '' + d.getMinutes();
    let second = '' + d.getSeconds();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;
    if (second.length < 2) second = '0' + second;
    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
  }

  public getElementFromHtmlString(htmlString: string, id: string): string {
    log.debug('getElementFromHtmlString() initiated', { htmlString, id });
    try {
      let result = '';
      // const pattern = /<([a-zA-Z]+)\s+id="div__body"[^>]*>([\s\S]*?)<\/\1>/;
      const pattern = /<table\s+id="div__body"[^>]*>([\s\S]*?)<\/table>/;
      const match = htmlString.match(pattern);
      log.debug('getElementFromHtmlString() match', match);
      if (match) {
        const elementType = match[1]; // element type (e.g., table, div)
        const elementContent = match[2]; // element content
        result = `<${elementType} id="${id}">${elementContent}</${elementType}>`;
      } else {
        throw new Error(`Element with id ${id} not found`);
      }
      log.debug('getElementFromHtmlString() returning', result);

      return result;
    } catch (e) {
      log.error('getElementFromHtmlString() error', e);
      return '';
    }
  }
}
