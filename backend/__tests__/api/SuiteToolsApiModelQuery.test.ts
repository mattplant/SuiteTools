// SPDX-License-Identifier: GPL-3.0-or-later

import { queryMany, queryOne } from '../../TypeScripts/SuiteTools/api/SuiteToolsApiModelQuery';

describe('SuiteToolsApiModelQuery', () => {
  describe('queryOne', () => {
    it('returns null data and message when rows are empty', () => {
      expect(queryOne([], 'No file found with id of 9')).toEqual({
        status: 200,
        data: null,
        message: 'No file found with id of 9',
      });
    });

    it('returns the first row on hit', () => {
      const row = { id: 1, name: 'a.pdf' };
      expect(queryOne([row, { id: 2, name: 'b.pdf' }], 'unused')).toEqual({
        status: 200,
        data: row,
      });
    });

    it('maps the first row when mapRow is provided', () => {
      expect(queryOne([{ id: '1' }], 'unused', (row) => ({ id: Number(row.id) }))).toEqual({
        status: 200,
        data: { id: 1 },
      });
    });
  });

  describe('queryMany', () => {
    it('returns empty array and message when rows are empty', () => {
      expect(queryMany([], 'No file records found')).toEqual({
        status: 200,
        data: [],
        message: 'No file records found',
      });
    });

    it('returns all rows on hit', () => {
      const rows = [
        { id: 1, name: 'a' },
        { id: 2, name: 'b' },
      ];
      expect(queryMany(rows, 'unused')).toEqual({
        status: 200,
        data: rows,
      });
    });

    it('maps rows when mapRows is provided', () => {
      expect(
        queryMany([{ id: '1' }, { id: '2' }], 'unused', (rows) => rows.map((r) => ({ id: Number(r.id) }))),
      ).toEqual({
        status: 200,
        data: [{ id: 1 }, { id: 2 }],
      });
    });
  });
});
