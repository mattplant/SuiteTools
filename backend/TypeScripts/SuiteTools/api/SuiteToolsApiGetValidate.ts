/**
 * SuiteTools API - GET response validation
 *
 * Validates RESTlet GET success envelopes (and selected entity payloads)
 * with shared Zod schemas before JSON leaves the account.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * @NApiVersion 2.1
 */

import type { z, ZodIssue } from 'zod';
import {
  makeRequestResponseSchema,
  requestResponse,
  isNotFound,
  SettingsSchema,
  userOrNotFoundSchema,
  usersOrNotFoundSchema,
  roleOrNotFoundSchema,
  rolesOrNotFoundSchema,
  jobOrNotFoundSchema,
  jobsOrNotFoundSchema,
} from '@suiteworks/suitetools-shared';
// Error classes from `/errors` so `instanceof SuiteError` matches SuiteToolsApiGet
// (main package vs `/errors` are separate Rollup bundles — do not mix).
import { SchemaValidationError } from '@suiteworks/suitetools-shared/errors';
import type { Response } from './types';

/** Zod failures from shared schemas — avoid brittle cross-bundle `instanceof ZodError`. */
function zodIssues(err: unknown): ZodIssue[] | null {
  if (
    err &&
    typeof err === 'object' &&
    'issues' in err &&
    Array.isArray((err as { issues: unknown }).issues)
  ) {
    return (err as { issues: ZodIssue[] }).issues;
  }
  return null;
}

/**
 * Endpoints that validate `data` with a shared domain schema (in addition to the envelope).
 * Documented for #27 — expand incrementally as cleaners/models align with schemas.
 */
export const GET_PAYLOAD_VALIDATED_ENDPOINTS = [
  'settings',
  'user',
  'users',
  'role',
  'roles',
  'job',
  'jobs',
] as const;

type PayloadValidatedEndpoint = (typeof GET_PAYLOAD_VALIDATED_ENDPOINTS)[number];

const GET_PAYLOAD_SCHEMAS: Record<PayloadValidatedEndpoint, z.ZodTypeAny> = {
  settings: SettingsSchema,
  user: userOrNotFoundSchema,
  users: usersOrNotFoundSchema,
  role: roleOrNotFoundSchema,
  roles: rolesOrNotFoundSchema,
  job: jobOrNotFoundSchema,
  jobs: jobsOrNotFoundSchema,
};

/**
 * Legacy soft-miss / empty object payloads that are not yet canonical NotFound.
 * Skip entity-schema validation so we do not turn these into SCHEMA_VALIDATION_ERROR noise.
 */
function shouldSkipPayloadValidation(data: unknown): boolean {
  if (data == null) {
    return true;
  }
  if (typeof data !== 'object' || Array.isArray(data)) {
    return false;
  }
  if (isNotFound(data)) {
    return false;
  }
  // Legacy soft-miss is an empty object only. Do not treat id-less payloads
  // (e.g. settings) as skips — those still need schema validation.
  return Object.keys(data as object).length === 0;
}

/**
 * Validate a GET response before returning it from the RESTlet.
 * - Always validates the `{ status, data, message? }` envelope.
 * - For selected endpoints, also validates `data` with shared domain schemas.
 * - Throws {@link SchemaValidationError} (via factory) on failure — maps to ErrorResponse.
 */
export function validateGetResponse(endpoint: string, response: unknown): Response {
  const envelope = requestResponse.safeParse(response);
  if (!envelope.success) {
    throw new SchemaValidationError(`get:${endpoint}:envelope`, envelope.error.issues);
  }

  const payloadSchema = GET_PAYLOAD_SCHEMAS[endpoint as PayloadValidatedEndpoint];
  if (!payloadSchema) {
    return envelope.data as Response;
  }

  if (shouldSkipPayloadValidation(envelope.data.data)) {
    return envelope.data as Response;
  }

  try {
    const parsed = makeRequestResponseSchema(payloadSchema).parse(envelope.data);
    const out: Response = {
      status: envelope.data.status,
      data: parsed.data,
    };
    const message = parsed.message ?? envelope.data.message;
    if (message !== undefined) {
      out.message = message;
    }
    return out;
  } catch (err) {
    const issues = zodIssues(err);
    if (issues) {
      throw new SchemaValidationError(`get:${endpoint}`, issues);
    }
    throw err;
  }
}
