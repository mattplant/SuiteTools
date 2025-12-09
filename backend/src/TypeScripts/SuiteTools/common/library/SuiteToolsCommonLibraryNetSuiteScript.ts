/**
 * SuiteTools Library - NetSuite Script Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from 'N/log';
import * as url from 'N/url';
import * as redirect from 'N/redirect';
import type { SuiteToolsCommon } from '../SuiteToolsCommon';

/**
 * SuiteTools NetSuite Script Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteScript {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Redirects to SuiteScript script.
   *
   * @param scriptId - the script id
   * @param deploymentId - the deployment id
   * @param parameters - the parameters
   */
  public redirectToScript(scriptId: string, deploymentId: string, params: object): void {
    try {
      log.debug({
        title: 'SuiteToolsCommonLibraryNetSuiteScript:redirectToScript() initiated',
        details: { scriptId: scriptId, deploymentId: deploymentId, params: params },
      });
      const scriptUrl = url.resolveScript({
        scriptId: scriptId,
        deploymentId: deploymentId,
      });
      log.debug({
        title: 'SuiteToolsCommonLibraryNetSuiteScript:redirectToScript() redirecting to',
        details: scriptUrl,
      });
      redirect.redirect({
        url: scriptUrl,
        parameters: params,
      });
    } catch (e) {
      log.error('SuiteToolsCommonLibraryNetSuiteScript:redirectToScript() error', e);
    }
  }
}
