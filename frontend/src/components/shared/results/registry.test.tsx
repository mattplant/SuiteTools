// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from "vitest";
import { resultsRegistry } from "./registry";
import { ResultsTypes } from "./types";

const ENTITY_TYPES = Object.values(ResultsTypes);

/**
 * Titles previously lived in a second table inside `Results.tsx`, hand-matched to this list.
 * Pinning them here is what makes collapsing the two tables a checkable move rather than a retype.
 */
const EXPECTED_TITLES: Record<ResultsTypes, string> = {
  [ResultsTypes.FILE]: "File",
  [ResultsTypes.INTEGRATION]: "Integration",
  [ResultsTypes.JOB]: "Job",
  [ResultsTypes.JOBRUN]: "Job Execution",
  [ResultsTypes.LOGIN]: "Login",
  [ResultsTypes.ROLE]: "Role",
  [ResultsTypes.SCRIPT]: "Script",
  [ResultsTypes.SCRIPTLOG]: "Script Log Details",
  [ResultsTypes.SOAPLOG]: "SOAP Log Details",
  [ResultsTypes.TOKEN]: "Token",
  [ResultsTypes.USER]: "User",
};

describe("resultsRegistry", () => {
  it("has an entry for every results type", () => {
    expect(Object.keys(resultsRegistry).sort()).toEqual([...ENTITY_TYPES].sort());
  });

  it.each(ENTITY_TYPES)("%s carries a title and a grid", (type) => {
    const entry = resultsRegistry[type];
    expect(entry.title).toBe(EXPECTED_TITLES[type]);
    expect(typeof entry.Grid).toBe("function");
  });

  // The old ResultsModal switch asserted the payload in each of its eleven cases. The registry
  // moves that into one shared helper, so this sweeps all eleven to confirm none lost its guard —
  // `renderDetail` must reject before it ever reaches the detail component.
  it.each(ENTITY_TYPES)("%s validates the modal payload before rendering", (type) => {
    expect(() => resultsRegistry[type].renderDetail({ nope: true })).toThrow();
  });
});
