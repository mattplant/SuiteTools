import type { ZodIssue } from "zod";

import { NetSuiteApiError } from "../integration/netsuite-api.error";
import { NotFoundError } from "../domain/not-found.error";
import { SchemaValidationError } from "../domain/schema-validation.error";

/**
 * Factory to create a NetSuiteApiError instance.
 */
export const makeNetSuiteApiError = (
  endpoint: string,
  message: string,
  opts?: { status?: number; code?: string; cause?: unknown }
): NetSuiteApiError => new NetSuiteApiError(message, { endpoint, ...opts });

/**
 * Factory to create a NotFoundError instance.
 */
export const makeNotFoundError = (
  resource: string,
  id: string | number
): NotFoundError => new NotFoundError(resource, id);

/**
 * Factory to create a SchemaValidationError instance.
 */

export function makeSchemaValidationError(schema: string, issues: ZodIssue[]) {
  return new SchemaValidationError(schema, issues);
}
