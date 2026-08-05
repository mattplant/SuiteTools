/**
 * SuiteTools Library - NetSuite Record Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import * as log from 'N/log';
import * as record from 'N/record';
import * as query from 'N/query';
import type { SuiteToolsCommon } from '../SuiteToolsCommon';

/**
 * SuiteTools NetSuite Record Library
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsCommonLibraryNetSuiteRecord {
  private _stCommon: SuiteToolsCommon;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }

  constructor(stCommon: SuiteToolsCommon) {
    this._stCommon = stCommon;
  }

  /**
   * Create custom record or list entry
   *
   * @param recordType
   * @param values
   * @returns record id of newly created record if successful else 0
   */
  public createCustomRecordEntry(recordType: string, values: object): number {
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:createCustomRecordEntry() initiated',
      details: { recordType: recordType, values: values },
    });
    let recordId = 0;

    try {
      const recordObj = record.create({
        type: recordType,
      });
      for (const field in values) {
        recordObj.setValue({ fieldId: field, value: values[field] });
      }
      recordId = recordObj.save({
        enableSourcing: false,
        ignoreMandatoryFields: true,
      });
    } catch (e) {
      log.error({
        title: `SuiteToolsCommonLibraryNetSuiteRecord:createCustomRecordEntry - Error on ${recordType}`,
        details: e,
      });
    }

    return recordId;
  }

  /**
   * Get custom record or list entry
   *
   * @param recordType
   * @param recordId
   * @returns value
   */
  public getCustomRecord(recordType: string, recordId: number): record.Record | undefined {
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:getCustomRecord() initiated',
      details: { recordType: recordType, recordId: recordId },
    });

    try {
      const recordObj = record.load({
        type: recordType,
        id: recordId,
      });

      return recordObj;
    } catch (e) {
      log.error({
        title: `SuiteToolsCommonLibraryNetSuiteRecord:getCustomRecord - Error on ${recordType}`,
        details: e,
      });
      return undefined;
    }
  }

  /**
   * Update custom record or list entry
   *
   * @param recordType
   * @param recordId
   * @returns true if successful else false
   */
  public updateCustomRecordEntry(recordType: string, recordId: string, values: object): boolean {
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:updateCustomRecord() initiated',
      details: { recordType: recordType, recordId: recordId, values: values },
    });
    let success = false;

    try {
      const recordObj = record.load({
        type: recordType,
        id: recordId,
      });
      for (const field in values) {
        recordObj.setValue({ fieldId: field, value: values[field] });
      }
      recordObj.save({
        enableSourcing: false,
        ignoreMandatoryFields: true,
      });
      success = true;
    } catch (e) {
      log.error({
        title: `SuiteToolsCommonLibraryNetSuiteRecord:updateCustomRecord - Error on ${recordType}`,
        details: e,
      });
    }

    return success;
  }

  /**
   * Clears custom record.
   *
   * @param recordType
   * @returns true if successful else false
   */
  public clearCustomRecord(recordType: string): boolean {
    let success = false;
    try {
      const queryResults = query.runSuiteQL({ query: `SELECT ID FROM ${recordType}` }).asMappedResults();
      for (let i = 0; i < queryResults.length; i++) {
        const recordId = queryResults[i].id as string;
        log.debug({
          title: 'SuiteToolsCommonLibraryNetSuiteRecord:clearCustomRecord() deleting record',
          details: { recordType: recordType, recordID: recordId },
        });
        record.delete({ type: recordType, id: recordId });
      }
      success = true;
    } catch (e) {
      log.error({
        title: `SuiteToolsCommonLibraryNetSuiteRecord:clearCustomRecord - Error on ${recordType}`,
        details: e,
      });
    }

    return success;
  }

  /**
   * Gets the Custom Record's internal id.
   *
   * @param customRecord - the custom record id (e.g. "customrecord_...")
   * @returns the internal id
   */
  public getCustomRecordInternalId(customRecord: string): number {
    let result = 0;
    const sql = `
        SELECT
          CustomRecordType.internalId,
        FROM
          CustomRecordType
        WHERE
          CustomRecordType.scriptId = '${customRecord.toUpperCase()}'
      `;
    const resultSet = this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql);
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:getCustomRecordInternalId() - resultSet',
      details: resultSet,
    });
    if (resultSet.length > 0) {
      result = resultSet[0].internalid;
    }
    log.debug({
      title: 'SuiteToolsCommonLibraryNetSuiteRecord:getCustomRecordInternalId() returning',
      details: result,
    });

    return result;
  }
}
