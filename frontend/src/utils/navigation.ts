// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * URL construction for a frontend served from inside NetSuite.
 *
 * @fileoverview
 * The app runs at a NetSuite-assigned Suitelet URL that is not known at build time, so no route
 * can be hardcoded. `getAppBaseUrl` reads the `data-app-url` attribute the backend writes onto
 * the root element, and `openAppPage` / `openNetSuitePage` build on it. Eleven modules use it.
 *
 * @remarks
 * The whole file depends on the backend having set `data-app-url` — if that attribute is ever
 * dropped from the Suitelet's HTML, every in-app link breaks at runtime rather than at build.
 * `openNetSuitePage` targets NetSuite's own UI rather than the app, so its argument is an
 * account-relative URL, not an app route.
 *
 * @see ../../../backend/TypeScripts/SuiteTools/app/SuiteToolsAppView.ts – where data-app-url is written
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

/**
 * Gets the base URL of the current SuiteTools app instance.
 * Reads the app URL from the data attribute set by the backend using url.resolveScript.
 * @returns Base URL with script and deploy parameters
 */
export function getAppBaseUrl(): string {
  const rootElement = document.getElementById("root");
  const appUrl = rootElement?.getAttribute("data-app-url");

  if (appUrl) {
    if (appUrl.startsWith("/")) {
      const { origin } = window.location;
      return `${origin}${appUrl}`;
    }
    return appUrl;
  }

  return "";
}

/**
 * Normalize an in-app path to a hash path that always starts with `#/`.
 * @param path - Hash or path such as "#/user/123" or "/user/123"
 * @returns Hash path such as `#/user/123`
 */
function toHashPath(path: string): string {
  if (path.startsWith("#/")) {
    return path;
  }
  if (path.startsWith("#")) {
    return `#/${path.slice(1).replace(/^\/+/, "")}`;
  }
  if (path.startsWith("/")) {
    return `#${path}`;
  }
  return `#/${path}`;
}

/**
 * Opens a SuiteTools app page.
 * Uses same-tab hash navigation when already inside the SuiteTools suitelet so the
 * current JS bundle is reused (new tabs can load a stale File Cabinet asset).
 * @param path - The hash path to navigate to (e.g., "#/user/123" or "/user/123")
 */
export function openAppPage(path: string): void {
  const hashPath = toHashPath(path);
  const baseUrl = getAppBaseUrl();
  const suiteletBase = baseUrl.split("#")[0];

  if (suiteletBase) {
    try {
      const current = new URL(window.location.href);
      const target = new URL(suiteletBase, window.location.origin);
      if (current.pathname === target.pathname) {
        // Assign fragment without the leading '#'; never concatenate `#` + `#/...`.
        window.location.hash = hashPath.slice(1);
        return;
      }
    } catch {
      // Fall through to new-tab navigation.
    }

    window.open(`${suiteletBase}${hashPath}`, "_blank", "noopener,noreferrer");
    return;
  }

  window.location.hash = hashPath.slice(1);
}

/**
 * Opens a NetSuite native UI page in a new tab.
 * @param url - The NetSuite page URL (relative or absolute)
 */
export function openNetSuitePage(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
