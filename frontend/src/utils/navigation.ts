// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Navigation utilities for SuiteTools.
 * @file navigation.ts
 * @description Provides helper functions for constructing URLs and handling navigation
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

/**
 * Gets the base URL of the current SuiteTools app instance.
 * Reads the app URL from the data-app-url attribute on the root element,
 * which is set by the backend using url.resolveScript with script identifiers.
 * @returns Base URL with script and deploy parameters
 */
export function getAppBaseUrl(): string {
  // Get the app URL from the data attribute set by the backend
  const rootElement = document.getElementById('root');
  const appUrl = rootElement?.getAttribute('data-app-url');

  if (appUrl) {
    // If it's a relative URL, convert to absolute using current origin
    if (appUrl.startsWith('/')) {
      const { origin } = window.location;
      return `${origin}${appUrl}`;
    }
    return appUrl;
  }

  // If data-app-url is not found, return empty string
  return '';
}

/**
 * Opens a SuiteTools app page in a new tab.
 * @param path - The hash path to navigate to (e.g., "#/user/123" or "/user/123")
 */
export function openAppPage(path: string): void {
  const baseUrl = getAppBaseUrl();
  const hashPath = path.startsWith('#') ? path : `#${path}`;
  window.open(`${baseUrl}${hashPath}`, '_blank', 'noopener,noreferrer');
}

/**
 * Opens a NetSuite native UI page in a new tab.
 * @param url - The NetSuite page URL (relative or absolute)
 */
export function openNetSuitePage(url: string): void {
  window.open(url, '_blank', 'noopener,noreferrer');
}
