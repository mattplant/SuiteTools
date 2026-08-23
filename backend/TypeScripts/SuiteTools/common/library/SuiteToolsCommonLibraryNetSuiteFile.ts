// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * SuiteTools Library - NetSuite File Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as file from "N/file";
import * as log from "N/log";
import type { SuiteToolsCommon } from "../SuiteToolsCommon";

/**
 * SuiteTools NetSuite File Library
 */
export class SuiteToolsCommonLibraryNetSuiteFile {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Get NetSuite file object.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file
   */
  private getFileObj(id: number | string): file.File {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileObj() initiated', details: { id: id } });
    let fileObj: file.File;
    if (typeof id === "string") {
      const filePath = `/SuiteScripts/${this.stCommon.appDir}/${id}`;
      fileObj = file.load({ id: filePath });
    } else {
      fileObj = file.load({ id: id });
    }

    return fileObj;
  }

  /**
   * Gets NetSuite file contents.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file contents
   */
  public getFileContents(id: number | string): string {
    const fileObj = this.getFileObj(id);

    return fileObj.getContents();
  }

  /**
   * Gets NetSuite file contents.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file contents
   */
  public getFileLastModified(id: number | string): string {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileContents() initiated', details: { id: id } });
    const fileObj = this.getFileObj(id);
    const sql = `select TO_CHAR(File.LastModifiedDate, 'YYYY-MM-DD HH24:MI:SS') as lastModifiedDate from file where id = ${fileObj.id}`;
    const result = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql) as Array<{ lastmodifieddate: string }>;
    const lastModifiedDate = result?.[0]?.lastmodifieddate ?? "";

    return lastModifiedDate;
  }

  /**
   * Gets NetSuite file URL, or `undefined` when the file is not deployed.
   *
   * Unlike the getters above this one absorbs the failure rather than throwing it. `file.load()`
   * throws when the path does not exist, and both callers resolve an app asset the SPA build
   * emits -- the settings endpoint the SPA bootstraps from, and the page render itself -- where
   * an unguarded lookup would turn one undeployed file into a dead app rather than one dead link.
   *
   * Note the return type against the siblings' plain `string`: that difference, not the name, is
   * what tells a caller absence is possible, and `strict` makes the compiler enforce it.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns the file url, or undefined if it could not be resolved
   */
  public getFileUrl(fileName: string): string | undefined {
    try {
      return this.getFileObj(fileName).url;
    } catch (err) {
      log.error({
        title: `SuiteToolsCommonLibraryNetSuiteFile:getFileUrl() could not resolve ${fileName}`,
        details: err,
      });
      return undefined;
    }
  }
}
