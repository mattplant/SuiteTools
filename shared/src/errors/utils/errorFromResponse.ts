// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file errorFromResponse.ts
 * @description
 * Rehydrate a serialized {@link ErrorResponse} into a concrete {@link SuiteError}.
 */

import type { ZodIssue } from "zod";
import type { ErrorResponse } from "../contracts/ErrorResponse";
import type { SuiteError } from "../base/SuiteError";
import { InvalidParameterError } from "../domain/invalid-parameter.error";
import { NotFoundError } from "../domain/not-found.error";
import { SchemaValidationError } from "../domain/schema-validation.error";
import { UnexpectedError } from "../domain/unexpected.error";
import { NetSuiteApiError } from "../integration/netsuite-api.error";

function normalizeCode(code: string): string {
  if (code === "UNEXPECTED") {
    return "UNEXPECTED_ERROR";
  }
  return code;
}

/**
 * Rehydrate an API {@link ErrorResponse} into the matching SuiteError subclass.
 *
 * Unknown codes become {@link NetSuiteApiError} so the SPA still gets a SuiteError
 * with the original wire `code` preserved as `nsErrorCode`.
 */
export function errorFromResponse(res: ErrorResponse): SuiteError {
  const ctx = res.context ?? {};
  const code = normalizeCode(res.code);

  switch (code) {
    case "NOT_FOUND": {
      const resource = typeof ctx.resource === "string" ? ctx.resource : "Resource";
      const id = typeof ctx.id === "string" || typeof ctx.id === "number" ? ctx.id : "unknown";
      return new NotFoundError(resource, id);
    }

    case "INVALID_PARAMETER": {
      const parameterName = typeof ctx.parameterName === "string" ? ctx.parameterName : "unknown";
      const reason = typeof ctx.reason === "string" ? ctx.reason : res.message;
      return new InvalidParameterError(parameterName, ctx.value, reason);
    }

    case "SCHEMA_VALIDATION_ERROR": {
      const schema = typeof ctx.schema === "string" ? ctx.schema : "unknown";
      const issues = Array.isArray(ctx.issues) ? (ctx.issues as ZodIssue[]) : [];
      return new SchemaValidationError(schema, issues);
    }

    case "UNEXPECTED_ERROR": {
      const operation = typeof ctx.operation === "string" ? ctx.operation : "api";
      // Wire `message` already includes the UnexpectedError prefix — use it as the
      // cause text only when it does not already start with that prefix pattern.
      const causeText = res.message.startsWith("Unexpected error in ")
        ? res.message.replace(/^Unexpected error in [^:]+:\s*/, "")
        : res.message;
      return new UnexpectedError(operation, new Error(causeText), { ...ctx, status: res.status, rehydrated: true });
    }

    default:
      return new NetSuiteApiError(res.message, {
        endpoint: "api",
        status: res.status,
        nsErrorCode: res.code,
        // Preserve wire context (e.g. Zod issues) when code is not yet mapped.
        ...(Object.keys(ctx).length > 0 ? { context: ctx } : {}),
      });
  }
}
