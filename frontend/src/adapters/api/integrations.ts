// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Adapter for the Integrations list.
 *
 * @fileoverview
 * Builds the list from the Manage Integrations UI scrape rather than the RESTlet, because only
 * the scrape carries real internal ids, `applicationId` and `dateCreated`. RESTlet and
 * LoginAudit rows contribute last-login enrichment, joined by name.
 *
 * @remarks
 * The name-based join is the fragile part: integrations whose display name differs between the
 * scrape and LoginAudit will silently miss enrichment, which is what `integrationLookupKey`
 * normalises against. Prefer scrape fields whenever the two sources disagree.
 *
 * @see ./integrationsScrape.ts – the scrape and its lookup key
 * @see ./integration.ts – the singular adapter and the detail stash
 * @copyright Matthew Plant <i@idev.systems>
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
