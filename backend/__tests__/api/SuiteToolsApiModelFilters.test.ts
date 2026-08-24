// SPDX-License-Identifier: GPL-3.0-or-later

import * as log from "N/log";
import { addDateFilter } from "../../TypeScripts/SuiteTools/api/SuiteToolsApiModelFilters";

jest.mock("N/log");

describe("addDateFilter", () => {
  const fn = "SuiteToolsApiModel:getFiles()";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Build a fresh where clause, run the filter, return the fragments it appended. */
  function filter(dates: string | string[], table = "file", field = "createddate"): string[] {
    const where: string[] = [];
    addDateFilter(where, fn, table, field, dates);
    return where;
  }

  describe("no-filter values", () => {
    it.each([
      ["empty string", ""],
      ["the zero sentinel", "0"],
    ])("adds nothing for %s", (_label, dates) => {
      expect(filter(dates)).toEqual([]);
    });

    it("adds nothing for a null-ish value", () => {
      // The UI can omit the field entirely; the getters pass whatever arrived through.
      expect(filter(undefined as unknown as string)).toEqual([]);
    });

    it("does not log the no-filter case", () => {
      filter("");
      expect(log.debug).not.toHaveBeenCalled();
    });
  });

  describe("named windows", () => {
    it("filters to today by calendar date, not a 24-hour window", () => {
      expect(filter("today")).toEqual(["TO_CHAR(file.createddate, 'YYYY-MM-DD') = TO_CHAR(SYSDATE, 'YYYY-MM-DD')"]);
    });

    it("filters to yesterday by calendar date", () => {
      expect(filter("yesterday")).toEqual([
        "TO_CHAR(file.createddate, 'YYYY-MM-DD') = TO_CHAR(SYSDATE - 1, 'YYYY-MM-DD')",
      ]);
    });

    it("filters the last week to 7 days", () => {
      expect(filter("lastweek")).toEqual(["file.createddate >= (SYSDATE - 7)"]);
    });

    it("filters the last month to 31 days", () => {
      expect(filter("lastmonth")).toEqual(["file.createddate >= (SYSDATE - 31)"]);
    });
  });

  describe("relative minute windows", () => {
    it.each([
      ["15", 15],
      ["60", 60],
      ["240", 240],
    ])("converts %s minutes to fractional days", (dates, minutes) => {
      expect(filter(dates)).toEqual([`file.createddate >= (SYSDATE - ${minutes} / 1440)`]);
    });

    it("takes the leading integer of a partly numeric value", () => {
      // parseInt semantics, asserted rather than assumed: "15min" is a filter, not a no-op.
      expect(filter("15min")).toEqual(["file.createddate >= (SYSDATE - 15 / 1440)"]);
    });

    it.each([
      ["a negative window", "-5"],
      ["an unrecognized token", "lastyear"],
    ])("adds nothing and logs for %s", (_label, dates) => {
      expect(filter(dates)).toEqual([]);
      expect(log.debug).toHaveBeenCalledWith(
        expect.objectContaining({ details: `Unhandled date filter value: ${dates}` }),
      );
    });
  });

  describe("column qualification", () => {
    it("qualifies the column with the table when one is given", () => {
      expect(filter("lastweek", "loginAudit", "date")).toEqual(["loginAudit.date >= (SYSDATE - 7)"]);
    });

    it("leaves the column unqualified when the table is empty", () => {
      expect(filter("lastweek", "", "date")).toEqual(["date >= (SYSDATE - 7)"]);
    });
  });

  describe("non-string input", () => {
    it("skips an array of values and logs what it dropped", () => {
      // A multi-select UI would send string[]; no getter builds SQL from one yet.
      expect(filter(["today", "yesterday"])).toEqual([]);
      expect(log.debug).toHaveBeenCalledWith(
        expect.objectContaining({ details: { skippedNonStringDates: ["today", "yesterday"] } }),
      );
    });

    it("skips an empty array too -- [] is truthy, so it reaches the non-string guard", () => {
      const where: string[] = [];
      addDateFilter(where, fn, "file", "createddate", []);
      expect(where).toEqual([]);
      expect(log.debug).toHaveBeenCalledWith(expect.objectContaining({ details: { skippedNonStringDates: [] } }));
    });
  });

  it("appends to an existing where clause rather than replacing it", () => {
    const where = ["file.folder = 5"];
    addDateFilter(where, fn, "file", "createddate", "today");
    expect(where).toHaveLength(2);
    expect(where[0]).toBe("file.folder = 5");
  });
});
