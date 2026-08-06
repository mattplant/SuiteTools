/**
 * SuiteTools API - GET soft NotFound helpers
 *
 * Canonical singular miss shape in the success envelope:
 * `{ status: 404, data: { code: 'NOT_FOUND', message }, message }`
 *
 * Distinct from throwing `NotFoundError` (hard ErrorResponse path, e.g. Role).
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import type { NotFound } from '@suiteworks/suitetools-shared';
import type { Response } from './types';

/**
 * Legacy model soft-miss: empty object (or null) without an entity `id`
 * and without a NotFound `code`.
 */
export function isLegacyEmptySoftMiss(data: unknown): boolean {
  if (data == null) {
    return true;
  }
  if (typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }
  const record = data as Record<string, unknown>;
  if (record.code === 'NOT_FOUND') {
    return false;
  }
  return !('id' in record);
}

/** Build the canonical soft-NotFound GET response. */
export function softNotFoundResponse(message: string): Response {
  const data: NotFound = { code: 'NOT_FOUND', message };
  return {
    status: 404,
    data,
    message,
  };
}

/**
 * If `result.data` is a legacy empty soft-miss, return canonical NotFound.
 * Otherwise return a 200 success with the entity payload.
 */
export function ensureEntityOrSoftNotFound(result: Response, fallbackMessage: string): Response {
  if (isLegacyEmptySoftMiss(result?.data)) {
    return softNotFoundResponse(result.message || fallbackMessage);
  }
  const out: Response = {
    status: 200,
    data: result.data,
  };
  if (result.message !== undefined) {
    out.message = result.message;
  }
  return out;
}
