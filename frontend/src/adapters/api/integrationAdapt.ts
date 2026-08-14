// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file Shared Integration view-model helpers.
 */

import type { Integration } from "@suiteworks/suitetools-shared";

/** LoginAudit-only RESTlet ids — not valid integrapp.nl record ids. */
export const SYNTHETIC_INTEGRATION_ID_MIN = 900_000_000;

/**
 * True when `id` is a LoginAudit-only synthetic id (≥ {@link SYNTHETIC_INTEGRATION_ID_MIN}),
 * not a real NetSuite integrapp.nl record id.
 * @param id - Candidate integration id.
 * @returns Whether the id is synthetic.
 */
export function isSyntheticIntegrationId(id: number): boolean {
  return Number.isFinite(id) && id >= SYNTHETIC_INTEGRATION_ID_MIN;
}

/**
 * Enrich a validated Integration with navigation URLs.
 * Preserves scraped NetSuite URLs; never builds integrapp.nl links for synthetic ids.
 * @param integration - Validated integration payload.
 * @returns Integration with urlNs and urlDetail.
 */
export function adaptIntegration(integration: Integration): Integration {
  const hasRealId = !isSyntheticIntegrationId(integration.id);

  return {
    ...integration,
    urlNs: integration.urlNs ?? (hasRealId ? `/app/common/integration/integrapp.nl?id=${integration.id}` : undefined),
    urlDetail: hasRealId ? `#/integration/${integration.id}` : undefined,
  };
}
