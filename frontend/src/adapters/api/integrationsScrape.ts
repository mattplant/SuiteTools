// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file Scrape Integration Application metadata from NetSuite UI.
 * @description
 * Integration Applications are not a SuiteScript search type. The Manage Integrations
 * list page (`integrapplist.nl`) is the reliable source for internal id, application id,
 * state, and date created when SuiteQL is unavailable to the RESTlet role.
 */

import { IntegrationBundle } from '@suiteworks/suitetools-shared';
import type { Integration, Integrations } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { adaptIntegration, isSyntheticIntegrationId, SYNTHETIC_INTEGRATION_ID_MIN } from './integrationAdapt';

export { isSyntheticIntegrationId, SYNTHETIC_INTEGRATION_ID_MIN };

const stripHtml = (value: string): string => value.replace(/<[^>]*>/g, '').trim();

const INTEGRAPP_HREF_RE = /integrapp\.nl\?(?:[^"'#]*&)?id=(\d+)/i;
const APPLICATION_ID_RE = /^[0-9A-Fa-f]{8}(?:-[0-9A-Fa-f]{4}){3}-[0-9A-Fa-f]{12}$|^[0-9A-Fa-f]{32}$/;
const DATE_CREATED_RE = /(?:\d{1,4}[-/]\d{1,2}[-/]\d{1,4})|(?:\d{1,2}\/\d{1,2}\/\d{2,4})|(?:[A-Za-z]{3,9}\s+\d{1,2},?\s+\d{4})/;

/**
 * Normalize a scraped integration display name: strip HTML and remap known NetSuite aliases
 * (e.g. "SuiteCloud IDE & CLI" → "SuiteCloud Development Integration").
 * @param name - Raw name from scrape or list UI text.
 * @returns Cleaned display name suitable for merge/lookup.
 */
export function normalizeIntegrationName(name: string): string {
  const cleaned = stripHtml(name);
  if (cleaned === 'SuiteCloud IDE & CLI') {
    return 'SuiteCloud Development Integration';
  }
  return cleaned;
}

/**
 * Case-insensitive lookup key for merging API and scrape rows by name.
 * @param name - Integration display name.
 */
export function integrationLookupKey(name: string): string {
  return normalizeIntegrationName(name).toLowerCase();
}

type ParsedIntegrationRow = {
  id: number;
  name: string;
  applicationId: string;
  state: string;
  dateCreated: string;
  urlNs: string;
};

/**
 * Decode common HTML entities found in NetSuite list markup.
 * @param value - Raw attribute or text value.
 */
function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/**
 * Extract integration internal id from an integrapp.nl href.
 * @param href - Anchor href from the integrations list.
 */
export function extractIntegrappId(href: string): number | null {
  const decoded = decodeHtmlEntities(href);
  const match = decoded.match(INTEGRAPP_HREF_RE);
  if (!match) {
    return null;
  }
  const id = Number(match[1]);
  if (!Number.isFinite(id) || id <= 0 || isSyntheticIntegrationId(id)) {
    return null;
  }
  return id;
}

/**
 * Parse one table row that contains an Integration Application link.
 * @param cells - Text content of each TD in the row.
 * @param href - Href of the integrapp.nl link in the row.
 * @param linkText - Visible link text (integration name).
 */
export function parseIntegrationCells(cells: string[], href: string, linkText: string): ParsedIntegrationRow | null {
  const id = extractIntegrappId(href);
  if (!id) {
    return null;
  }

  const applicationId = cells.find((cell) => APPLICATION_ID_RE.test(cell)) ?? '';
  const state = cells.find((cell) => cell === 'Enabled' || cell === 'Blocked') ?? '';
  const dateCreated = cells.find((cell) => DATE_CREATED_RE.test(cell)) ?? '';
  const name = normalizeIntegrationName(linkText || cells.find((cell) => cell && cell !== String(id)) || '');

  if (!name) {
    return null;
  }

  return {
    id,
    name,
    applicationId,
    state,
    dateCreated,
    urlNs: `/app/common/integration/integrapp.nl?id=${id}`,
  };
}

/**
 * DOM-parse Manage Integrations list HTML into Integration rows.
 * @param html - Full HTML document from integrapplist.nl.
 */
export function parseIntegrationsHtml(html: string): Integrations {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const looksLikeLogin =
    Boolean(doc.querySelector('form[name="login"], input#userName, input[name="email"]')) &&
    !doc.querySelector('a[href*="integrapp.nl"]');
  if (looksLikeLogin) {
    throw new Error('NetSuite returned a login page for integrapplist.nl. Refresh SuiteTools and try again.');
  }

  const anchors = Array.from(doc.querySelectorAll('a[href*="integrapp.nl"]')) as HTMLAnchorElement[];
  const byId = new Map<number, ParsedIntegrationRow>();

  for (const anchor of anchors) {
    const href = decodeHtmlEntities(anchor.getAttribute('href') || '');
    const row = anchor.closest('tr');
    const cells = row
      ? Array.from(row.querySelectorAll('td')).map((td) => (td.textContent || '').replace(/\s+/g, ' ').trim())
      : [];
    const parsed = parseIntegrationCells(cells, href, (anchor.textContent || '').trim());
    if (!parsed) {
      continue;
    }
    byId.set(parsed.id, parsed);
  }

  // Fallback: regex-scan the raw HTML if DOM anchors were not found (markup variants).
  if (byId.size === 0) {
    const linkRe = /href=["']([^"']*integrapp\.nl[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi;
    let match: RegExpExecArray | null;
    while ((match = linkRe.exec(html)) !== null) {
      const href = decodeHtmlEntities(match[1]);
      const linkText = stripHtml(match[2]);
      const id = extractIntegrappId(href);
      if (!id) {
        continue;
      }
      byId.set(id, {
        id,
        name: normalizeIntegrationName(linkText),
        applicationId: '',
        state: '',
        dateCreated: '',
        urlNs: `/app/common/integration/integrapp.nl?id=${id}`,
      });
    }
  }

  const mapped = Array.from(byId.values()).map((row) => ({
    id: row.id,
    name: row.name,
    applicationId: row.applicationId,
    state: row.state,
    dateCreated: row.dateCreated,
    urlNs: row.urlNs,
    urlDetail: `#/integration/${row.id}`,
  }));

  console.log('[integrationsScrape] parsed rows', {
    anchorCount: anchors.length,
    rowCount: mapped.length,
    sample: mapped[0],
  });

  return IntegrationBundle.parseMany(mapped).map(adaptIntegration);
}

function filterByActive(rows: Integrations, active: string | undefined): Integrations {
  if (active === 'T') {
    return rows.filter((row) => row.state === 'Enabled' || !row.state);
  }
  if (active === 'F') {
    return rows.filter((row) => row.state === 'Blocked');
  }
  return rows;
}

/**
 * Try to read Application ID from an integrapp.nl detail page.
 * NetSuite hides this for some partner/distributed integrations even on the detail form.
 * @param id - Integration internal id.
 */
export async function scrapeIntegrationApplicationId(id: number): Promise<string> {
  if (typeof window !== 'undefined' && window.location.href.includes('localhost')) {
    return '';
  }

  const response = await fetch(`/app/common/integration/integrapp.nl?id=${id}`, { credentials: 'same-origin' });
  if (!response.ok) {
    return '';
  }
  const html = await response.text();
  const match = html.match(/[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{4}-[0-9A-Fa-f]{12}/);
  return match?.[0] ?? '';
}

/**
 * Scrape Integration Applications from NetSuite's integrapplist page.
 * @param fields - Optional active-state filter (Enabled / Blocked / All).
 */
export async function scrapeIntegrations(fields: CriteriaFields): Promise<Integrations> {
  if (typeof window !== 'undefined' && window.location.href.includes('localhost')) {
    return IntegrationBundle.parseMany([
      {
        id: 1,
        name: 'Application 1',
        applicationId: 'ABCD12EF-456G-7890-HIJK-LMNOPQRSTUV',
        state: 'Enabled',
        dateCreated: '2024-12-06 13:02:03',
        urlNs: '/app/common/integration/integrapp.nl?id=1',
        urlDetail: '#/integration/1',
      },
    ]).map(adaptIntegration);
  }

  const url = '/app/common/integration/integrapplist.nl?showall=T';
  const response = await fetch(url, { credentials: 'same-origin' });
  if (!response.ok) {
    throw new Error(`Failed to load integrations list (${response.status}).`);
  }
  const html = await response.text();
  const parsed = parseIntegrationsHtml(html);
  if (parsed.length === 0) {
    throw new Error('No integration application links found on integrapplist.nl.');
  }
  return filterByActive(parsed, fields.active);
}

/**
 * Find a scraped integration by internal id or display name.
 * @param id - Integration internal id.
 * @param name - Optional display name for LoginAudit synthetic ids.
 */
export async function findScrapedIntegration(id: number, name?: string): Promise<Integration | undefined> {
  const scrapeRows = await scrapeIntegrations({ active: '' });
  if (id > 0) {
    const byId = scrapeRows.find((row) => row.id === id);
    if (byId) {
      return byId;
    }
  }
  if (name) {
    const key = integrationLookupKey(name);
    return scrapeRows.find((row) => integrationLookupKey(row.name) === key);
  }
  return undefined;
}
