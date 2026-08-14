// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple Integration entities for SuiteTools.
 * @description
 * Prefer Manage Integrations UI scrape for real ids / applicationId / dateCreated.
 * LoginAudit/RESTlet rows only supply last-login enrichment by name.
 * Pattern: Schema → Adapter → View
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import type { Integration, Integrations, Settings } from "@suiteworks/suitetools-shared";
import type { CriteriaFields } from "../../components/shared/criteria/types";
import { integrationLookupKey, scrapeIntegrations } from "./integrationsScrape";

/**
 * Fetch Integration records.
 * Scrape is required for real NetSuite ids — RESTlet LoginAudit fallbacks use synthetic ids
 * that break integrapp.nl links and leave applicationId / dateCreated empty.
 * @param fields - Criteria to filter the integrations list.
 * @returns A Promise resolving to an Integrations array.
 */
export async function getIntegrations(fields: CriteriaFields): Promise<Integrations> {
  return scrapeIntegrations(fields);
}

/**
 * Attach last-login timestamp from settings onto a single integration.
 * @param integration - Integration to enrich.
 * @param settings - App settings containing lastLogins cache.
 * @returns The same integration with lastLogin set when available.
 */
export function addIntegrationLastLogin(integration: Integration, settings: Settings | undefined): Integration {
  addIntegrationLastLogins([integration], settings);
  return integration;
}

/**
 * Attach last-login timestamps from settings onto integration rows.
 * @param integrations - Integration rows to enrich.
 * @param settings - App settings containing lastLogins cache.
 * @returns The same array with lastLogin set when available.
 */
export function addIntegrationLastLogins(
  integrations: readonly Integration[],
  settings: Settings | undefined,
): readonly Integration[] {
  if (settings?.lastLogins?.data && Array.isArray(settings.lastLogins.data) && settings.lastLogins.data.length > 0) {
    const lastLogins = settings.lastLogins.data.filter((lastLogin) => lastLogin.name.type === "integration");
    integrations.forEach((integration) => {
      const lastLogin = lastLogins.find(
        (entry) => integrationLookupKey(entry.name.name) === integrationLookupKey(integration.name),
      );
      if (lastLogin) {
        integration.lastLogin = lastLogin.lastLogin;
      }
    });
  }

  return integrations;
}
