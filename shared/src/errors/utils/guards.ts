import { SuiteToolsError } from "../base";
import { NetSuiteApiError } from "../integration/netsuite-api.error";
import { NotFoundError } from "../domain/not-found.error";
import { SchemaValidationError } from "../domain/schema-validation.error";

/**
 * Runtime check for any SuiteTools-defined error.
 */
export const isSuiteToolsError = (err: unknown): err is SuiteToolsError =>
  err instanceof SuiteToolsError;

/**
 * Runtime check for NetSuiteApiError.
 */
export const isNetSuiteApiError = (err: unknown): err is NetSuiteApiError =>
  err instanceof NetSuiteApiError;

/**
 * Runtime check for NotFoundError.
 */
export const isNotFoundError = (err: unknown): err is NotFoundError =>
  err instanceof NotFoundError;

/**
 * Runtime check for SchemaValidationError.
 */
export const isSchemaValidationError = (
  err: unknown
): err is SchemaValidationError => err instanceof SchemaValidationError;
