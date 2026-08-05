/**
 * SuiteTools API - GET Options Operations
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 */

import * as log from 'N/log';
import * as error from 'N/error';
import type { Response } from './types';
import type { SuiteToolsCommon } from '../common/SuiteToolsCommon';
import type { SuiteToolsApiModel } from './SuiteToolsApiModel';

interface OptionValuesResponse {
  id: number;
  name: string;
}

interface OptionValues {
  value: string;
  text: string;
}

type RequestParams = { [key: string]: string };

/**
 * SuiteTools API GET Options Class
 *
 * @author Matthew Plant <i@idev.systems>
 */
export class SuiteToolsApiGetOptions {
  private _stCommon: SuiteToolsCommon;
  private _stApiModel: SuiteToolsApiModel;

  get stCommon(): SuiteToolsCommon {
    return this._stCommon;
  }
  get stApiModel(): SuiteToolsApiModel {
    return this._stApiModel;
  }

  constructor(stCommon: SuiteToolsCommon, stApiModel: SuiteToolsApiModel) {
    this._stCommon = stCommon;
    this._stApiModel = stApiModel;
  }

  public process(requestParams: RequestParams): Response {
    let data: unknown;
    let result = {};
    const type = requestParams.type;
    switch (type) {
      case 'file':
        data = this.getFileList(true);
        break;
      case 'filetype':
        data = this.getFileTypeList();
        break;
      case 'job':
        data = this.getJobList();
        break;
      case 'owner':
        data = this.getEmployeeList(true);
        break;
      case 'role':
        data = this.getRoleList(true);
        break;
      case 'script':
        data = this.getScriptList();
        break;
      case 'scripttype':
        data = this.getScriptTypeList();
        break;
      case 'user':
        data = this.getEmployeeList(true);
        break;
      default:
        throw error.create({
          name: 'SUITE_TOOLS_INVALID_PARAMETER',
          message: `Invalid parameter: type=${type}`,
          notifyOff: true,
        });
    }
    this.assertIsOptionValuesResponse(data);
    const optionValues = this.convertOptionValuesResponse(data);
    if (optionValues.length === 0) {
      log.error({ title: 'SuiteToolsApiGetOptions:process() no results', details: '' });
    } else {
      result = optionValues;
    }

    return { status: 200, data: result };
  }

  private assertIsOptionValuesResponse(data: unknown): asserts data is OptionValuesResponse[] {
    if (!Array.isArray(data)) {
      throw new Error('OptionValuesResponse is not an array');
    }
    if (data.length === 0) {
      throw new Error('OptionValuesResponse is empty');
    }
    // check the data for the required fields
    // id
    if (!('id' in data[0])) {
      throw new Error('OptionValuesResponse is missing the "id" field');
    }
    // name
    if (!('name' in data[0])) {
      throw new Error('OptionValuesResponse is missing the "name" field');
    }
    if (typeof data[0].name !== 'string') {
      throw new Error('OptionValuesResponse "name" field is not a string');
    }
  }

  private convertOptionValuesResponse(values: OptionValuesResponse[]): OptionValues[] {
    const options: OptionValues[] = [];
    if (values && Array.isArray(values) && values.length > 0) {
      values.forEach((option) => {
        options.push({
          value: String(option.id),
          text: option.name,
        });
      });
    }

    return options;
  }

  // ------------------------------
  // GET OPTION LISTS
  // ------------------------------

  /**
   * Get employee list
   *
   * @param [activeOnly]
   * @returns employees
   */
  private getEmployeeList(activeOnly?: boolean): OptionValuesResponse[] {
    let sql = `SELECT
      employee.id,
      TRIM(employee.firstname || ' ' || employee.lastname) AS name
    FROM
      employee`;
    if (activeOnly) {
      sql += ` WHERE
        giveaccess = 'T'
        AND isinactive = 'F'`;
    }
    sql += ` ORDER BY name ASC`;

    return this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql) as OptionValuesResponse[];
  }

  private getFileList(activeOnly?: boolean): OptionValuesResponse[] {
    let sql = `SELECT
      File.id,
      File.name
    FROM
	    File
    INNER JOIN Script ON
		  ( Script.ScriptFile = File.ID )
    WHERE
      ( File.filetype = 'JAVASCRIPT' )`;
    if (activeOnly) {
      sql += ` AND ( Script.isinactive = 'F' )`;
    }
    sql += ` ORDER BY file.name ASC`;

    return this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql) as OptionValuesResponse[];
  }

  private getFileTypeList(): OptionValuesResponse[] {
    const sql = `SELECT
      DISTINCT filetype as id,
      filetype as name
    FROM file
    ORDER BY filetype`;

    return this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql) as OptionValuesResponse[];
  }

  private getJobList(activeOnly?: boolean): OptionValuesResponse[] {
    const customRecord = 'customrecord_idev_suitetools_job';
    let sql = `SELECT
      ${customRecord}.id,
      ${customRecord}.name,
    FROM
      ${customRecord}`;
    if (activeOnly) {
      sql += ` WHERE isinactive = 'F'`;
    }
    sql += ` ORDER BY name ASC`;

    return this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql) as OptionValuesResponse[];
  }

  private getRoleList(activeOnly = false): OptionValuesResponse[] {
    let sql = `SELECT
      role.id,
      role.name
    FROM
      role`;
    if (activeOnly) {
      sql += ` WHERE isInactive = 'F'`;
    }
    sql += ` ORDER BY role.name ASC`;

    return this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql) as OptionValuesResponse[];
  }

  private getScriptList(activeOnly?: boolean): OptionValuesResponse[] {
    let sql = `SELECT
      script.id,
      script.name
    FROM
      script`;
    if (activeOnly) {
      sql += ` WHERE isinactive = 'F'`;
    }
    sql += ` ORDER BY name ASC`;

    return this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql) as OptionValuesResponse[];
  }

  private getScriptTypeList(): OptionValuesResponse[] {
    const sql = 'SELECT scriptType.id, scriptType.name FROM scriptType ORDER BY name';

    return this.stCommon.stLib.stLibNs.stLibNsSuiteQl.query(sql) as OptionValuesResponse[];
  }
}
