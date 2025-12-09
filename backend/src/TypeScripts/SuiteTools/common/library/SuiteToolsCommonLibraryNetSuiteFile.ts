/**
 * SuiteTools Library - NetSuite File Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as file from 'N/file';
import type { SuiteToolsCommon } from '../SuiteToolsCommon';

/**
 * SuiteTools NetSuite File Library
 *
 * @author Matthew Plant <i@idev.systems>
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
    if (typeof id === 'string') {
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
    const lastModifiedDate = result?.[0]?.lastmodifieddate ?? '';

    return lastModifiedDate;
  }

  /**
   * Gets NetSuite file URL.
   *
   * @param fileName - the path to the file in the /SuiteScripts/{appDir} folder
   * @returns file url
   */
  public getFileUrl(fileName: string): string {
    // log.debug({ title: 'SuiteToolsCommonLibraryNetSuiteFile:getFileURL() initiated', details: { fileName: fileName } });
    const fileObj = this.getFileObj(fileName);

    return fileObj.url;
  }
}
