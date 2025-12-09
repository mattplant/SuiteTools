/**
 * SuiteTools Library - NetSuite HTTP Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from 'N/log';
import * as https from 'N/https';
import type { SuiteToolsCommon } from '../SuiteToolsCommon';

/**
 * SuiteTools NetSuite HTTP Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteHttp {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Get request
   *
   * @param url - the request url
   * @returns the get request reponse body
   */
  public async getRequest(url: string): Promise<string> {
    log.debug('getRequest() initiated', { url });
    let response;
    try {
      response = await https.get
        .promise({
          url: url,
        })
        .then(function (response) {
          log.debug({
            title: 'getRequest() response',
            details: response,
          });
          log.debug('getRequest() response body', response.body);

          return response.body;
        })
        .catch(function onRejected(reason) {
          log.debug({
            title: 'getRequest() invalid request',
            details: reason,
          });
        });
    } catch (e) {
      log.error('getRequest() error', e);
      // throw (e);
    }
    log.debug('getRequest() returning', response);

    return response as string;
  }
}
