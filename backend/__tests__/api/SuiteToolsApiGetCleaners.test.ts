// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Cleaner-level coverage for the Get layer.
 *
 * The shared schemas already pin the flag contract (`"F"` -> false), but nothing exercised the
 * cleaners that run *before* validation. That gap let `cleanRoleData` and `cleanUserData` remap
 * `"F"` to `"Yes"`, which `booleanFromTF` reads as `true` -- inverting active status for Roles
 * and Users while every schema test stayed green. These tests close that gap by asserting the
 * cleaners hand the schema a value it coerces correctly.
 */

import { RoleBundle, ScriptBundle, UserBundle, JobBundle } from "@suiteworks/suitetools-shared";
import { SuiteToolsApiGet } from "../../TypeScripts/SuiteTools/api/SuiteToolsApiGet";
import type { SuiteToolsCommon } from "../../TypeScripts/SuiteTools/common/SuiteToolsCommon";
import type { SuiteToolsApiModel } from "../../TypeScripts/SuiteTools/api/SuiteToolsApiModel";

// The cleaners under test touch neither collaborator; they are only needed to construct.
const stCommon = {} as SuiteToolsCommon;
const stApiModel = {} as SuiteToolsApiModel;
const api = new SuiteToolsApiGet(stCommon, stApiModel);

/** Call a private cleaner without widening its signature just for the test. */
function clean(method: string, row: Record<string, unknown>): Record<string, unknown> {
  const fn = (api as unknown as Record<string, (data: unknown) => unknown>)[method];
  return fn.call(api, row) as Record<string, unknown>;
}

describe("Get-layer flag cleaners", () => {
  describe("cleanRoleData", () => {
    it("leaves T/F flags in a shape the Role schema coerces correctly", () => {
      const cleaned = clean("cleanRoleData", {
        id: 3,
        name: "Administrator",
        centertype: "ACCOUNTCENTER",
        isinactive: "F",
        issalesrole: "F",
        issupportrole: "T",
        iswebserviceonlyrole: "F",
      });

      // An active role must not come back inactive -- this is the inversion that shipped.
      expect(RoleBundle.schema.parse(cleaned)).toMatchObject({
        id: 3,
        isInactive: false,
        isSalesRole: false,
        isSupportRole: true,
        isWebServiceOnlyRole: false,
      });
    });

    it("reports an inactive role as inactive", () => {
      const cleaned = clean("cleanRoleData", {
        id: 4,
        name: "Retired",
        centertype: null,
        isinactive: "T",
        issalesrole: "F",
        issupportrole: "F",
        iswebserviceonlyrole: "F",
      });

      expect(RoleBundle.schema.parse(cleaned)).toMatchObject({ isInactive: true, centerType: "" });
    });
  });

  describe("cleanUserData", () => {
    it("reports an active user as active", () => {
      const cleaned = clean("cleanUserData", {
        id: 5,
        isinactive: "F",
        email: "ada@example.com",
        name: "Ada Lovelace",
        title: "Engineer",
      });

      expect(UserBundle.schema.parse(cleaned)).toMatchObject({ id: 5, isInactive: false });
    });

    it("reports an inactive user as inactive", () => {
      const cleaned = clean("cleanUserData", {
        id: 6,
        isinactive: "T",
        email: "b@example.com",
        name: "Bob",
        title: "",
      });

      expect(UserBundle.schema.parse(cleaned)).toMatchObject({ isInactive: true });
    });
  });

  describe("cleanScriptData", () => {
    it("reports an active script as active", () => {
      const cleaned = clean("cleanScriptData", {
        id: 12,
        name: "Nightly",
        apiversion: "2.1",
        isinactive: "F",
        scripttype: "MAPREDUCE",
        scriptid: "customscript_x",
        scriptfile: "x.js",
        notifyemails: "",
        owner: "Ada",
      });

      expect(ScriptBundle.schema.parse(cleaned)).toMatchObject({ id: 12, isInactive: false });
    });
  });

  describe("cleanJobData", () => {
    it("reports an active job as active", () => {
      const cleaned = clean("cleanJobData", {
        id: 9,
        name: "Cleanup",
        isinactive: "F",
        config: "{}",
        description: "nightly",
        scheduled: "T",
        notify: "F",
      });

      expect(JobBundle.schema.parse(cleaned)).toMatchObject({
        id: 9,
        isInactive: false,
        scheduled: true,
        notify: false,
      });
    });
  });

  it("drops the lowercase SuiteQL alias after remapping", () => {
    const cleaned = clean("cleanUserData", { id: 7, isinactive: "F", email: "", name: "", title: "" });
    expect(cleaned).not.toHaveProperty("isinactive");
    expect(cleaned).toHaveProperty("isInactive", "F");
  });
});
