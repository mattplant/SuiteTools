// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Adapter for a single Integration record.
 *
 * @fileoverview
 * Integration applications are not reliably reachable over the RESTlet or SuiteQL, so a detail
 * view cannot simply fetch one by id. This module resolves a record from the Manage
 * Integrations list scrape, which is the only source carrying real internal ids, and stashes
 * the row so the detail route can read it back without a second scrape.
 *
 * @remarks
 * The stash is why this file exists at all — navigating list → detail must not re-scrape, and
 * `getIntegrationEnriched` depends on the stashed row being present. Treat the scrape as the
 * source of truth for ids; the RESTlet supplies last-login enrichment only, matched by name.
 *
 * @see ./integrations.ts – the list adapter that populates the stash
 * @see ./integrationsScrape.ts – the Manage Integrations scrape and its lookup key
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { IntegrationBundle } from "@suiteworks/suitetools-shared";
import type { Integration } from "@suiteworks/suitetools-shared";
import { handleNotFound } from "./adapterUtils";
import { adaptIntegration, isSyntheticIntegrationId } from "./integrationAdapt";
import { findScrapedIntegration, scrapeIntegrationApplicationId, scrapeIntegrations } from "./integrationsScrape";

export { adaptIntegration } from "./integrationAdapt";

const INTEGRATION_DETAIL_STORAGE_PREFIX = "suitetools:integration:";

/**
 * Cache integration row data for the detail route loader (same-tab navigation via openAppPage).
 * @param integration - Integration row from the list or modal.
 */
export function stashIntegrationDetail(integration: Integration): void {
  sessionStorage.setItem(`${INTEGRATION_DETAIL_STORAGE_PREFIX}${integration.id}`, JSON.stringify(integration));
}

/**
 * Read cached integration row data for the detail route.
 * @param id - Integration internal id.
 */
export function readStashedIntegrationDetail(id: number): Integration | null {
  const raw = sessionStorage.getItem(`${INTEGRATION_DETAIL_STORAGE_PREFIX}${id}`);
  if (!raw) {
    return null;
  }
  try {
    return IntegrationBundle.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

/**
 * Resolve an Integration using integrapplist scrape metadata (source of truth for real ids).
 * Does not call the RESTlet — SuiteQL/search cannot load Integration Application records.
 * @param id - Integration internal id (real NetSuite id).
 */
export async function getIntegration(id: number): Promise<Integration> {
  return getIntegrationEnriched(id);
}

/**
 * Resolve an Integration using integrapplist scrape metadata.
 * Synthetic LoginAudit ids cannot be opened as detail pages.
 * @param id - Integration internal id (real or LoginAudit synthetic).
 */
export async function getIntegrationEnriched(id: number): Promise<Integration> {
  if (!Number.isFinite(id) || id <= 0) {
    return handleNotFound("integration", id);
  }

  if (isSyntheticIntegrationId(id)) {
    return handleNotFound("integration", id);
  }

  let scrapeRows: readonly Integration[] = [];
  try {
    scrapeRows = await scrapeIntegrations({ active: "" });
  } catch (error) {
    console.warn("[integration:getIntegrationEnriched] scrape failed", error);
  }

  const fromScrapeById = scrapeRows.find((row) => row.id === id);
  if (fromScrapeById) {
    let integration = adaptIntegration(fromScrapeById);
    if (!integration.applicationId) {
      try {
        const applicationId = await scrapeIntegrationApplicationId(id);
        if (applicationId) {
          integration = { ...integration, applicationId };
        }
      } catch (error) {
        console.warn("[integration:getIntegrationEnriched] applicationId enrich failed", error);
      }
    }
    return integration;
  }

  const fromScrape = await findScrapedIntegration(id).catch(() => undefined);
  if (fromScrape) {
    return adaptIntegration(fromScrape);
  }

  return handleNotFound("integration", id);
}

/**
 * Resolve an Integration for the Integrations list modal.
 * Prefer the already-loaded grid row; enrich from scrape when metadata is incomplete.
 * @param id - Integration internal id.
 * @param lines - Optional rows from the current Integrations results grid.
 */
export async function getIntegrationModalData(id: number, lines?: readonly unknown[]): Promise<Integration> {
  if (lines?.length) {
    const match = lines.find((line) => {
      if (!line || typeof line !== "object" || !("id" in line)) return false;
      return Number((line as Integration).id) === id;
    }) as Integration | undefined;

    if (match && !isSyntheticIntegrationId(match.id)) {
      return adaptIntegration(match);
    }
  }

  return getIntegrationEnriched(id);
}
