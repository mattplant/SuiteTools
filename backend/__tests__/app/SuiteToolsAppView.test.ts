// SPDX-License-Identifier: GPL-3.0-or-later

import type { EntryPoints } from "N/types";
import type { Settings } from "../../TypeScripts/SuiteTools/common/SuiteToolsCommonSettings";
import type { SuiteToolsApp } from "../../TypeScripts/SuiteTools/app/SuiteToolsApp";
import { SuiteToolsAppView } from "../../TypeScripts/SuiteTools/app/SuiteToolsAppView";

jest.mock("N/log");

/** A Suitelet context that records everything written to the response. */
function stubContext(): { context: EntryPoints.Suitelet.onRequestContext; written: () => string } {
  const chunks: string[] = [];
  const context = {
    response: {
      write: (value: string) => {
        chunks.push(value);
      },
    },
  } as unknown as EntryPoints.Suitelet.onRequestContext;
  return { context, written: () => chunks.join("") };
}

function stubApp(overrides: Partial<Pick<SuiteToolsApp, "appUrl" | "apiUrl">> = {}): SuiteToolsApp {
  return {
    appUrl: "/app/site/hosting/scriptlet.nl?script=1&deploy=1",
    apiUrl: "/app/site/hosting/restlet.nl?script=2&deploy=1",
    ...overrides,
  } as SuiteToolsApp;
}

function stubSettings(overrides: Partial<Settings> = {}): Settings {
  return {
    recordId: 1,
    devMode: false,
    appBundle: "2026-08-01 12:00:00",
    notifyAuthor: undefined,
    notifyEmail: undefined,
    lastLogins: null,
    ...overrides,
  };
}

// The File Cabinet serves assets from media.nl with a query string already attached -- the case
// a naive `?v=` appended to every URL would break.
const CSS_URL = "/core/media/media.nl?id=101&c=1234567&h=abc123&_xt=.css";
const JS_URL = "/core/media/media.nl?id=102&c=1234567&h=def456&_xt=.js";

describe("SuiteToolsAppView.renderSpa", () => {
  function render(settings: Settings, cssUrl = CSS_URL, jsUrl = JS_URL): string {
    const { context, written } = stubContext();
    new SuiteToolsAppView(context, stubApp()).renderSpa(settings, cssUrl, jsUrl);
    return written();
  }

  it("appends the cache-bust param with & when the asset URL already has a query string", () => {
    const html = render(stubSettings({ appBundle: "2026-08-01 12:00:00" }));
    const version = encodeURIComponent("2026-08-01 12:00:00");

    expect(html).toContain(`src="${JS_URL}&v=${version}"`);
    expect(html).toContain(`href="${CSS_URL}&v=${version}"`);
    // The naive form would have truncated the File Cabinet's own params.
    expect(html).not.toContain("?v=");
  });

  it("appends the cache-bust param with ? when the asset URL has no query string", () => {
    const html = render(stubSettings({ appBundle: "abc" }), "/assets/output.css", "/assets/app-bundle.js");

    expect(html).toContain('href="/assets/output.css?v=abc"');
    expect(html).toContain('src="/assets/app-bundle.js?v=abc"');
  });

  it("percent-encodes an appBundle stamp so its spaces and colons survive the URL", () => {
    const html = render(stubSettings({ appBundle: "2026-08-01 12:00:00" }));

    expect(html).toContain("&v=2026-08-01%2012%3A00%3A00");
    expect(html).not.toContain("&v=2026-08-01 12:00:00");
  });

  it("falls back to a timestamp when the bundle stamp is empty", () => {
    // getSettings() returns "" when the bundle file is missing; the page must still bust cache.
    const before = Date.now();
    const html = render(stubSettings({ appBundle: "" }));
    const after = Date.now();

    const match = html.match(/&v=(\d+)"/);
    expect(match).not.toBeNull();
    const stamp = Number((match as RegExpMatchArray)[1]);
    expect(stamp).toBeGreaterThanOrEqual(before);
    expect(stamp).toBeLessThanOrEqual(after);
  });

  it("uses the same version for both assets", () => {
    const versions = [...render(stubSettings({ appBundle: "" })).matchAll(/&v=([^"]+)"/g)].map((m) => m[1]);

    expect(versions).toHaveLength(2);
    expect(versions[0]).toBe(versions[1]);
  });

  it("leaves an empty asset URL alone rather than emitting a bare '?v='", () => {
    // Defensive: bootstrapSpa() renders the issues form instead of calling here with an empty
    // URL, so this guard is only reachable if that narrowing is ever lost.
    const html = render(stubSettings({ appBundle: "abc" }), "", JS_URL);

    expect(html).toContain('href=""');
    expect(html).not.toContain("?v=abc");
  });

  it("renders a complete document with the mount point the SPA looks for", () => {
    const html = render(stubSettings());

    expect(html.startsWith("<!doctype html>")).toBe(true);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain("<title>SuiteTools</title>");
    expect(html).toContain('<div id="root"');
    expect(html).toContain("</html>");
  });

  it("hands the SPA its app URL through the root element's data attribute", () => {
    const { context, written } = stubContext();
    const app = stubApp({ appUrl: "/app/site/hosting/scriptlet.nl?script=9&deploy=9" });
    new SuiteToolsAppView(context, app).renderSpa(stubSettings(), CSS_URL, JS_URL);

    expect(written()).toContain('<div id="root" data-app-url="/app/site/hosting/scriptlet.nl?script=9&deploy=9">');
  });

  it("appends the footer comments after the document", () => {
    const html = render(stubSettings());
    const app = stubApp();

    expect(html).toContain(`<!-- appUrl: ${app.appUrl} -->`);
    expect(html).toContain(`<!-- apiUrl: ${app.apiUrl} -->`);
    expect(html.indexOf("</html>")).toBeLessThan(html.indexOf("<!-- SuiteTools Application -->"));
  });

  it("writes the whole page in a single response write", () => {
    const chunks: string[] = [];
    const context = {
      response: { write: (value: string) => chunks.push(value) },
    } as unknown as EntryPoints.Suitelet.onRequestContext;
    new SuiteToolsAppView(context, stubApp()).renderSpa(stubSettings(), CSS_URL, JS_URL);

    expect(chunks).toHaveLength(1);
  });

  it("exposes the app it was constructed with", () => {
    const app = stubApp();
    const { context } = stubContext();

    expect(new SuiteToolsAppView(context, app).stApp).toBe(app);
  });
});

describe("SuiteToolsAppView.renderAppIssuesForm", () => {
  function render(issues: string[]): string {
    const { context, written } = stubContext();
    new SuiteToolsAppView(context, stubApp()).renderAppIssuesForm(issues);
    return written();
  }

  it("renders one list item per issue", () => {
    const html = render(["Settings record was just created.", "Application files were not found."]);

    expect(html).toContain("<li>Settings record was just created.</li>");
    expect(html).toContain("<li>Application files were not found.</li>");
  });

  it("still renders the form when there are no issues", () => {
    const html = render([]);

    expect(html).toContain("Application issues were discovered.");
    expect(html).not.toContain("<li>");
  });

  it("does not render the SPA mount point, so the bundle cannot boot from this page", () => {
    expect(render(["boom"])).not.toContain('id="root"');
  });
});

describe("SuiteToolsAppView.renderAppErrorForm", () => {
  function render(caught: unknown): string {
    const { context, written } = stubContext();
    new SuiteToolsAppView(context, stubApp()).renderAppErrorForm(caught);
    return written();
  }

  it("renders a SuiteScriptError's id, name and message", () => {
    const html = render({
      id: "SSS_MISSING_REQD_ARGUMENT",
      name: "SuiteScriptError",
      message: "Missing a required argument",
      stack: ["at Object.getSettings (/SuiteScripts/x.js:12)"],
    });

    expect(html).toContain("<p>SSS_MISSING_REQD_ARGUMENT</p>");
    expect(html).toContain('<h3 class="text-xl">SuiteScriptError</h3>');
    expect(html).toContain("<p>Missing a required argument</p>");
  });

  it("renders a plain Error without printing 'undefined' for the absent id", () => {
    const error = new Error("boom");
    const html = render(error);

    expect(html).toContain("<p>boom</p>");
    expect(html).toContain('<h3 class="text-xl">Error</h3>');
    expect(html).not.toContain("undefined");
  });

  it("renders a thrown string without printing 'undefined'", () => {
    const html = render("just a string");

    expect(html).toContain("<p>just a string</p>");
    expect(html).toContain('<h3 class="text-xl">Error</h3>');
    expect(html).not.toContain("undefined");
  });

  it("renders a thrown null as the string 'null', not as a missing message", () => {
    const html = render(null);

    expect(html).toContain("<p>null</p>");
    expect(html).not.toContain("undefined");
  });

  it("splits a stack into list items on 'at'", () => {
    const html = render({
      name: "Error",
      message: "boom",
      stack: ["Error: boom\n    at first (/a.js:1)\n    at second (/b.js:2)"],
    });

    expect(html).toContain('<h3 class="text-xl">Stack:</h3>');
    expect(html).toContain("first (/a.js:1)");
    expect(html).toContain("second (/b.js:2)");
  });

  it("omits the stack section when the stack has no frames", () => {
    const html = render({ name: "Error", message: "boom", stack: [] });

    expect(html).not.toContain("Stack:");
  });

  it("omits the stack section when the single frame has no 'at' to split on", () => {
    const html = render({ name: "Error", message: "boom", stack: ["opaque"] });

    expect(html).not.toContain("Stack:");
  });

  it("drops non-string entries from a SuiteScriptError stack array", () => {
    const html = render({ name: "Error", message: "boom", stack: [null, "at first (/a.js:1)"] });

    expect(html).toContain("first (/a.js:1)");
    expect(html).not.toContain("null");
  });

  it("ignores a non-string, non-array stack rather than throwing", () => {
    const html = render({ name: "Error", message: "boom", stack: { frames: 2 } });

    expect(html).toContain("<p>boom</p>");
    expect(html).not.toContain("Stack:");
  });

  it("defaults a non-string name to 'Error' and a non-string message to empty", () => {
    const html = render({ id: 7, name: 42, message: { text: "boom" } });

    expect(html).toContain('<h3 class="text-xl">Error</h3>');
    expect(html).not.toContain("42");
    expect(html).not.toContain("undefined");
  });

  it("always tells the user what to do next", () => {
    const html = render(new Error("boom"));

    expect(html).toContain("Oops. Something went wrong.");
    expect(html).toContain("contact your administrator");
  });
});
