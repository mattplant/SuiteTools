/**
 * SuiteTools API - POST/PUT response validation
 *
 * Validates mutation success envelopes with the shared Zod requestResponse
 * schema before JSON leaves the account. Domain payload allowlists can be
 * added later when mutation `data` shapes are richer than ack stubs.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import { requestResponse } from '@suiteworks/suitetools-shared';
import { SchemaValidationError } from '@suiteworks/suitetools-shared/errors';
import type { Response } from './types';

/**
 * Validate a POST/PUT success response envelope.
 * @param method - HTTP-style method label (`post` / `put`) for error context.
 * @param endpoint - Mutation endpoint name.
 * @param response - Candidate success envelope.
 */
export function validateMutationResponse(
  method: 'post' | 'put',
  endpoint: string,
  response: unknown,
): Response {
  const envelope = requestResponse.safeParse(response);
  if (!envelope.success) {
    throw new SchemaValidationError(`${method}:${endpoint}:envelope`, envelope.error.issues);
  }
  return envelope.data as Response;
}
