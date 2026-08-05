// SPDX-License-Identifier: GPL-3.0-or-later

import * as query from "N/query";
import * as log from "N/log";
import { UnexpectedError } from "@suiteworks/suitetools-shared/errors";
import { SuiteToolsCommonLibraryNetSuiteSuiteQl } from "../../TypeScripts/SuiteTools/common/library/SuiteToolsCommonLibraryNetSuiteSuiteQl";

jest.mock("N/query");
jest.mock("N/log");

describe("SuiteToolsCommonLibraryNetSuiteSuiteQl.query", () => {
  const suiteQl = new SuiteToolsCommonLibraryNetSuiteSuiteQl({} as never);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("normalizes newlines and returns mapped results", () => {
    const asMappedResults = jest.fn().mockReturnValue([{ id: 1 }]);
    jest.mocked(query.runSuiteQL).mockReturnValue({ asMappedResults } as never);

    const rows = suiteQl.query("SELECT id\nFROM employee");

    expect(query.runSuiteQL).toHaveBeenCalledWith({
      query: "SELECT id FROM employee",
    });
    expect(rows).toEqual([{ id: 1 }]);
    expect(log.debug).toHaveBeenCalled();
  });

  it("returns an empty array for successful empty result sets", () => {
    jest.mocked(query.runSuiteQL).mockReturnValue({
      asMappedResults: () => [],
    } as never);

    expect(suiteQl.query("SELECT id FROM employee WHERE id = -1")).toEqual([]);
  });

  it("wraps SuiteQL runtime failures in UnexpectedError", () => {
    jest.mocked(query.runSuiteQL).mockImplementation(() => {
      throw new Error("SSS_SEARCH_ERROR");
    });

    expect(() => suiteQl.query("SELECT bad FROM nowhere")).toThrow(
      UnexpectedError,
    );
    expect(log.error).toHaveBeenCalled();
  });
});
