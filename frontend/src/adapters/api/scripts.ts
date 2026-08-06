// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple Script entities for SuiteTools.
 * @description
 * Fetches and validates an array of Script records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, scriptsOrNotFoundSchema } from '@suiteworks/suitetools-shared';
import type { Scripts } from '@suiteworks/suitetools-shared';
import type { CriteriaFields } from '../../components/shared/criteria/types';
import { makeListAdapter } from './adapterUtils';
import { adaptScript } from './script';

const scriptsRequestResponseSchema = makeRequestResponseSchema(scriptsOrNotFoundSchema);

/**
 * Fetch and validate a list of `Script` records using optional criteria.
 * Always returns a `Scripts` array, empty if none found.
 */
export const getScripts = makeListAdapter<
  Scripts[number],
  CriteriaFields,
  'active' | 'versions' | 'scriptTypes' | 'scriptNames' | 'owners' | 'files'
>('scripts', scriptsRequestResponseSchema, ['active', 'versions', 'scriptTypes', 'scriptNames', 'owners', 'files'] as const, {
  adaptItem: adaptScript,
});
