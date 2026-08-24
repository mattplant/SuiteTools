// SPDX-License-Identifier: GPL-3.0-or-later

import * as log from "N/log";
import * as url from "N/url";
import type { EntryPoints } from "N/types";
import type { Settings } from "../../TypeScripts/SuiteTools/common/SuiteToolsCommonSettings";

jest.mock("N/log");
jest.mock("N/url");

// The two collaborators bootstrapSpa() drives. Mocking them keeps this suite on the branch under
// test -- which page gets rendered -- rather than on SuiteQL and the File Cabinet.
const getSettings = jest.fn<Settings | null, []>();
const initializeApp = jest.fn();
const getFileUrl = jest.fn<string, [string]>();
const renderSpa = jest.fn();
const renderAppIssuesForm = jest.fn();
const renderAppErrorForm = jest.fn();

jest.mock("../../TypeScripts/SuiteTools/common/SuiteToolsCommon", () => ({
  SuiteToolsCommon: jest
    .fn()
    .mockImplementation(() => ({
      appCssFile: "dist/output.css",
      appJsFile: "dist/app-bundle.js",
      stSettings: { getSettings, initializeApp },
      stLib: { stLibNs: { stLibNsFile: { getFileUrl } } },
    })),
}));

jest.mock("../../TypeScripts/SuiteTools/app/SuiteToolsAppView", () => ({
  SuiteToolsAppView: jest.fn().mockImplementation(() => ({ renderSpa, renderAppIssuesForm, renderAppErrorForm })),
}));

import { SuiteToolsApp } from "../../TypeScripts/SuiteTools/app/SuiteToolsApp";
import { SuiteToolsAppView } from "../../TypeScripts/SuiteTools/app/SuiteToolsAppView";

const SETTINGS: Settings = {
  recordId: 1,
  devMode: false,
  appBundle: "2026-08-01 12:00:00",
  notifyAuthor: undefined,
  notifyEmail: undefined,
  lastLogins: null,
};

const CSS_URL = "/core/media/media.nl?id=101&c=1&h=a";
const JS_URL = "/core/media/media.nl?id=102&c=1&h=b";

const CONTEXT = { request: {}, response: { write: jest.fn() } } as unknown as EntryPoints.Suitelet.onRequestContext;

/** Resolve css then js, in the order bootstrapSpa() asks for them. */
function stubAssets(cssUrl: string, jsUrl: string): void {
  getFileUrl.mockImplementation((file: string) => (file === "dist/output.css" ? cssUrl : jsUrl));
}

/** The single issue string the app shows when the settings record was just created. */
const CREATED_ISSUE = "The settings record was just created. Refresh page to see if the issue has been resolved.";
/** The single issue string the app shows when an asset URL is missing. */
const ASSETS_ISSUE = "Application files were not found. Refresh page to see if the issue has been resolved.";

beforeEach(() => {
  jest.clearAllMocks();
  jest
    .mocked(url.resolveScript)
    .mockImplementation(
      (options) => `/app/site/hosting/scriptlet.nl?script=${options.scriptId}&deploy=${options.deploymentId}`,
    );
  getSettings.mockReturnValue(SETTINGS);
  stubAssets(CSS_URL, JS_URL);
});

describe("SuiteToolsApp constructor", () => {
  it("resolves both script URLs", () => {
    const app = new SuiteToolsApp(CONTEXT);

    expect(app.appUrl).toContain("customscript_idev_suitetools_app");
    expect(app.appUrl).toContain("customdeploy_idev_suitetools_app");
    expect(app.apiUrl).toContain("customscript_idev_suitetools_api");
    expect(app.apiUrl).toContain("customdeploy_idev_suitetools_api");
  });

  it("resolves internal URLs, never external ones", () => {
    new SuiteToolsApp(CONTEXT);

    for (const call of jest.mocked(url.resolveScript).mock.calls) {
      expect(call[0]).toMatchObject({ returnExternalUrl: false });
    }
  });

  it("exposes the common instance it constructed", () => {
    expect(new SuiteToolsApp(CONTEXT).stCommon).toBeDefined();
  });
});

describe("SuiteToolsApp library bootstrap (no Suitelet context)", () => {
  it("renders nothing -- there is no page to render", () => {
    new SuiteToolsApp();

    expect(SuiteToolsAppView).not.toHaveBeenCalled();
    expect(renderSpa).not.toHaveBeenCalled();
  });

  it("runs when no argument is passed at all", () => {
    // The MR scripts construct it bare; the default parameter has to reach the same branch.
    new SuiteToolsApp();

    expect(getSettings).toHaveBeenCalledTimes(1);
    expect(log.error).not.toHaveBeenCalled();
  });

  it("logs an error when there are no settings, but does not initialize the app", () => {
    getSettings.mockReturnValue(null);

    new SuiteToolsApp(null);

    expect(log.error).toHaveBeenCalledWith(
      expect.objectContaining({ details: ["SuiteToolsApp:bootstrapLibrary() did not find any settings"] }),
    );
    expect(initializeApp).not.toHaveBeenCalled();
  });

  it("does not pay for the File Cabinet lookups the jobs never use", () => {
    new SuiteToolsApp(null);

    expect(getFileUrl).not.toHaveBeenCalled();
  });
});

describe("SuiteToolsApp SPA bootstrap", () => {
  it("renders the SPA when settings and both assets resolve", () => {
    new SuiteToolsApp(CONTEXT);

    expect(renderSpa).toHaveBeenCalledWith(SETTINGS, CSS_URL, JS_URL);
    expect(renderAppIssuesForm).not.toHaveBeenCalled();
    expect(renderAppErrorForm).not.toHaveBeenCalled();
  });

  it("passes the view the context and the app itself", () => {
    const app = new SuiteToolsApp(CONTEXT);

    expect(SuiteToolsAppView).toHaveBeenCalledWith(CONTEXT, app);
  });

  it("resolves the asset URLs at render time rather than reading them off settings", () => {
    new SuiteToolsApp(CONTEXT);

    expect(getFileUrl).toHaveBeenCalledWith("dist/output.css");
    expect(getFileUrl).toHaveBeenCalledWith("dist/app-bundle.js");
  });

  it("initializes the app and shows the refresh issue when no settings record exists", () => {
    getSettings.mockReturnValue(null);

    new SuiteToolsApp(CONTEXT);

    expect(initializeApp).toHaveBeenCalledTimes(1);
    expect(renderSpa).not.toHaveBeenCalled();
    expect(renderAppIssuesForm).toHaveBeenCalledWith([CREATED_ISSUE]);
  });

  it("does not re-read settings after initializing -- the snapshot predates the new record", () => {
    getSettings.mockReturnValue(null);

    new SuiteToolsApp(CONTEXT);

    expect(getSettings).toHaveBeenCalledTimes(1);
  });

  it.each([
    ["the stylesheet is missing", "", JS_URL],
    ["the app bundle is missing", CSS_URL, ""],
    ["both assets are missing", "", ""],
  ])("shows the assets issue when %s", (_label, cssUrl, jsUrl) => {
    stubAssets(cssUrl, jsUrl);

    new SuiteToolsApp(CONTEXT);

    expect(renderSpa).not.toHaveBeenCalled();
    expect(renderAppIssuesForm).toHaveBeenCalledWith([ASSETS_ISSUE]);
  });

  it("reports both issues at once when settings and assets are all missing", () => {
    getSettings.mockReturnValue(null);
    stubAssets("", "");

    new SuiteToolsApp(CONTEXT);

    expect(renderAppIssuesForm).toHaveBeenCalledWith([CREATED_ISSUE, ASSETS_ISSUE]);
  });

  it("logs the issues it renders", () => {
    stubAssets("", "");

    new SuiteToolsApp(CONTEXT);

    expect(log.error).toHaveBeenCalledWith(expect.objectContaining({ details: [ASSETS_ISSUE] }));
  });

  it("renders the error form when loading settings throws", () => {
    const boom = new Error("SuiteQL is down");
    getSettings.mockImplementation(() => {
      throw boom;
    });

    new SuiteToolsApp(CONTEXT);

    expect(renderAppErrorForm).toHaveBeenCalledWith(boom);
    expect(renderSpa).not.toHaveBeenCalled();
    expect(renderAppIssuesForm).not.toHaveBeenCalled();
  });

  it("renders the error form when an asset lookup throws", () => {
    const boom = new Error("file.load failed");
    getFileUrl.mockImplementation(() => {
      throw boom;
    });

    new SuiteToolsApp(CONTEXT);

    expect(renderAppErrorForm).toHaveBeenCalledWith(boom);
  });

  it("does not let a bootstrap failure escape to the Suitelet entry point", () => {
    getSettings.mockImplementation(() => {
      throw new Error("boom");
    });

    expect(() => new SuiteToolsApp(CONTEXT)).not.toThrow();
    expect(log.error).toHaveBeenCalledWith(expect.objectContaining({ title: expect.stringContaining("caught error") }));
  });
});
