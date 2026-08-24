// SPDX-License-Identifier: GPL-3.0-or-later

import * as log from "N/log";
import type { SuiteToolsCommon } from "../../TypeScripts/SuiteTools/common/SuiteToolsCommon";
import type { SuiteQLResults } from "../../TypeScripts/SuiteTools/common/types";
import { SuiteToolsCommonSettings } from "../../TypeScripts/SuiteTools/common/SuiteToolsCommonSettings";

jest.mock("N/log");

const SETTINGS_RECORD = "customrecord_idev_suitetools_settings";
const APP_JS_FILE = "dist/app-bundle.js";

type Stubs = {
  query: jest.Mock;
  getFileLastModified: jest.Mock;
  createCustomRecordEntry: jest.Mock;
  initializeJobs: jest.Mock;
  currentUser: { id: number; email: string };
};

/**
 * A SuiteToolsCommon stubbed down to what the settings class actually reaches through it:
 * the SuiteQL runner, the File Cabinet stamp, the record writer, the jobs initializer and
 * the current user.
 */
function stubCommon(overrides: Partial<Stubs> = {}): { stCommon: SuiteToolsCommon; stubs: Stubs } {
  const stubs: Stubs = {
    query: jest.fn().mockReturnValue([] as SuiteQLResults),
    getFileLastModified: jest.fn().mockReturnValue("2026-08-01 12:00:00"),
    createCustomRecordEntry: jest.fn().mockReturnValue(42),
    initializeJobs: jest.fn(),
    currentUser: { id: 7, email: "admin@example.com" },
    ...overrides,
  };
  const stCommon = {
    appSettingsRecord: SETTINGS_RECORD,
    appJsFile: APP_JS_FILE,
    runtime: { getCurrentUser: () => stubs.currentUser },
    stJobs: { initializeJobs: stubs.initializeJobs },
    stLib: {
      stLibNs: {
        stLibNsSuiteQl: { query: stubs.query },
        stLibNsFile: { getFileLastModified: stubs.getFileLastModified },
        stLibNsRecord: { createCustomRecordEntry: stubs.createCustomRecordEntry },
      },
    },
  } as unknown as SuiteToolsCommon;
  return { stCommon, stubs };
}

/** A settings row as SuiteQL returns it: lowercased aliases, `string | number | null` values. */
function row(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return { id: 1, devmode: "F", notifyauthor: 7, notifyemail: "admin@example.com", lastlogins: null, ...overrides };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("SuiteToolsCommonSettings.getSettings", () => {
  /** Run getSettings() against a single stubbed row (or none). */
  function load(rows: Record<string, unknown>[], overrides: Partial<Stubs> = {}) {
    const { stCommon, stubs } = stubCommon({ query: jest.fn().mockReturnValue(rows), ...overrides });
    return { settings: new SuiteToolsCommonSettings(stCommon).getSettings(), stubs };
  }

  it("queries only the active settings record", () => {
    const { stubs } = load([row()]);

    const sql = stubs.query.mock.calls[0][0] as string;
    expect(sql).toContain(SETTINGS_RECORD);
    expect(sql).toContain("isInactive = 'F'");
  });

  it("returns a populated snapshot for a configured install", () => {
    const { settings } = load([row({ devmode: "T" })]);

    expect(settings).toEqual({
      recordId: 1,
      devMode: true,
      appBundle: "2026-08-01 12:00:00",
      notifyAuthor: 7,
      notifyEmail: "admin@example.com",
      lastLogins: null,
    });
  });

  it("returns null when no active settings record exists", () => {
    const { settings } = load([]);

    expect(settings).toBeNull();
  });

  it("reads devMode as strictly 'T' -- anything else is off", () => {
    expect(load([row({ devmode: "F" })]).settings?.devMode).toBe(false);
    expect(load([row({ devmode: "t" })]).settings?.devMode).toBe(false);
    expect(load([row({ devmode: null })]).settings?.devMode).toBe(false);
    expect(load([row({ devmode: "T" })]).settings?.devMode).toBe(true);
  });

  it("stamps appBundle from the File Cabinet rather than from the record", () => {
    const { settings, stubs } = load([row()]);

    expect(stubs.getFileLastModified).toHaveBeenCalledWith(APP_JS_FILE);
    expect(settings?.appBundle).toBe("2026-08-01 12:00:00");
  });

  it("keeps an empty appBundle when the bundle file is missing", () => {
    const { settings } = load([row()], { getFileLastModified: jest.fn().mockReturnValue("") });

    expect(settings?.appBundle).toBe("");
  });

  it("carries no asset URLs -- those are resolved at the point of use", () => {
    const { settings } = load([row()]);

    expect(settings).not.toHaveProperty("cssUrl");
    expect(settings).not.toHaveProperty("jsUrl");
  });

  it("uses the first row when the query returns more than one", () => {
    const { settings } = load([row({ id: 1 }), row({ id: 2 })]);

    expect(settings?.recordId).toBe(1);
  });

  describe("record id narrowing", () => {
    it("accepts a numeric string id", () => {
      expect(load([row({ id: "12" })]).settings?.recordId).toBe(12);
    });

    it.each([
      ["null", null],
      ["a non-numeric string", "abc"],
    ])("treats %s as a failed load rather than a NaN id", (_label, id) => {
      const { settings } = load([row({ id })]);

      expect(settings).toBeNull();
      expect(log.error).toHaveBeenCalledWith(
        expect.objectContaining({ title: expect.stringContaining("no usable id") }),
      );
    });
  });

  describe("optional notify columns", () => {
    it("reads an unset column as undefined, not null", () => {
      const { settings } = load([row({ notifyauthor: null, notifyemail: null })]);

      expect(settings?.notifyAuthor).toBeUndefined();
      expect(settings?.notifyEmail).toBeUndefined();
    });

    it("coerces a numeric-string author id to a number", () => {
      expect(load([row({ notifyauthor: "7" })]).settings?.notifyAuthor).toBe(7);
    });

    it("treats a non-numeric author id as absent rather than NaN", () => {
      expect(load([row({ notifyauthor: "nobody" })]).settings?.notifyAuthor).toBeUndefined();
    });

    it("coerces a non-string email column to a string", () => {
      expect(load([row({ notifyemail: 123 })]).settings?.notifyEmail).toBe("123");
    });
  });

  describe("lastLogins", () => {
    const lastLogins = { finished: "2026-08-01", data: [{ name: { type: "employee", name: "Bob" }, lastLogin: "x" }] };

    it("parses a stored JSON string", () => {
      expect(load([row({ lastlogins: JSON.stringify(lastLogins) })]).settings?.lastLogins).toEqual(lastLogins);
    });

    it("passes an already-parsed object through", () => {
      expect(load([row({ lastlogins: lastLogins })]).settings?.lastLogins).toEqual(lastLogins);
    });

    it.each([
      ["null", null],
      ["an empty string", ""],
    ])("returns null for %s -- no stored logins is not a failure", (_label, lastlogins) => {
      const { settings } = load([row({ lastlogins })]);

      expect(settings?.lastLogins).toBeNull();
      expect(log.error).not.toHaveBeenCalled();
    });

    it("returns null and logs when the stored JSON is malformed", () => {
      const { settings } = load([row({ lastlogins: "{not json" })]);

      expect(settings?.lastLogins).toBeNull();
      expect(log.error).toHaveBeenCalledWith(
        expect.objectContaining({ title: expect.stringContaining("parseLastLogins") }),
      );
    });

    it("returns null when the stored JSON is a scalar rather than an object", () => {
      expect(load([row({ lastlogins: "42" })]).settings?.lastLogins).toBeNull();
    });

    it("returns null when the stored JSON is literally 'null'", () => {
      expect(load([row({ lastlogins: "null" })]).settings?.lastLogins).toBeNull();
    });
  });
});

describe("SuiteToolsCommonSettings.initializeApp", () => {
  function initialize(overrides: Partial<Stubs> = {}) {
    const { stCommon, stubs } = stubCommon(overrides);
    new SuiteToolsCommonSettings(stCommon).initializeApp();
    return stubs;
  }

  it("creates the settings record with dev mode off", () => {
    const stubs = initialize();

    expect(stubs.createCustomRecordEntry).toHaveBeenCalledWith(
      SETTINGS_RECORD,
      expect.objectContaining({ custrecord_idev_st_setting_dev_mode: false }),
    );
  });

  it("seeds the notify fields from the current user", () => {
    const stubs = initialize({ currentUser: { id: 99, email: "someone@example.com" } });

    expect(stubs.createCustomRecordEntry).toHaveBeenCalledWith(
      SETTINGS_RECORD,
      expect.objectContaining({
        custrecord_idev_st_setting_notify_author: 99,
        custrecord_idev_st_setting_notify_email: "someone@example.com",
      }),
    );
  });

  it("writes no asset URLs -- a stored URL could never be refreshed from here", () => {
    const stubs = initialize();

    const configs = stubs.createCustomRecordEntry.mock.calls[0][1] as Record<string, unknown>;
    expect(Object.keys(configs)).toEqual([
      "custrecord_idev_st_setting_dev_mode",
      "custrecord_idev_st_setting_notify_author",
      "custrecord_idev_st_setting_notify_email",
    ]);
  });

  it("initializes the jobs as part of a fresh install", () => {
    const stubs = initialize();

    expect(stubs.initializeJobs).toHaveBeenCalledTimes(1);
  });

  it("creates the settings record before initializing the jobs", () => {
    const stubs = initialize();

    expect(stubs.createCustomRecordEntry.mock.invocationCallOrder[0]).toBeLessThan(
      stubs.initializeJobs.mock.invocationCallOrder[0],
    );
  });

  it("leaves an audit trail -- this runs once per install", () => {
    initialize();

    expect(log.audit).toHaveBeenCalledWith(
      expect.objectContaining({ title: expect.stringContaining("initializeApp") }),
    );
  });
});

describe("SuiteToolsCommonSettings", () => {
  it("exposes the common instance it was constructed with", () => {
    const { stCommon } = stubCommon();

    expect(new SuiteToolsCommonSettings(stCommon).stCommon).toBe(stCommon);
  });

  it("holds no settings state between reads", () => {
    // The class deliberately returns a snapshot; a second read re-queries rather than caching.
    const { stCommon, stubs } = stubCommon({ query: jest.fn().mockReturnValue([row()]) });
    const settings = new SuiteToolsCommonSettings(stCommon);

    settings.getSettings();
    settings.getSettings();

    expect(stubs.query).toHaveBeenCalledTimes(2);
  });
});
