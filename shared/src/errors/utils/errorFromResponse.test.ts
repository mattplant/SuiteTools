// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from "vitest";
import type { ZodIssue } from "zod";
import { errorFromResponse } from "./errorFromResponse";
import {
  isInvalidParameterError,
  isNetSuiteApiError,
  isNotFoundError,
  isSchemaValidationError,
  isUnexpectedError,
} from "./guards";
import { makeNotFoundError, makeSchemaValidationError } from "./factories";

describe("errorFromResponse", () => {
  it("rehydrates NOT_FOUND", () => {
    const err = errorFromResponse({
      status: 404,
      code: "NOT_FOUND",
      message: "User 7 not found",
      severity: "error",
      context: { resource: "User", id: 7 },
    });
    expect(isNotFoundError(err)).toBe(true);
    expect(err.code).toBe("NOT_FOUND");
  });

  it("rehydrates SCHEMA_VALIDATION_ERROR with issues", () => {
    const issues: ZodIssue[] = [
      { code: "invalid_type", expected: "number", path: ["id"], message: "Expected number, received string" },
    ];
    const err = errorFromResponse({
      status: 500,
      code: "SCHEMA_VALIDATION_ERROR",
      message: 'Validation failed for schema "user".',
      severity: "error",
      context: { schema: "user", issues },
    });
    expect(isSchemaValidationError(err)).toBe(true);
    if (isSchemaValidationError(err)) {
      expect(err.issues).toEqual(issues);
      expect(err.context?.schema).toBe("user");
    }
  });

  it("rehydrates INVALID_PARAMETER and UNEXPECTED_ERROR", () => {
    const invalid = errorFromResponse({
      status: 400,
      code: "INVALID_PARAMETER",
      message: "bad",
      severity: "error",
      context: { parameterName: "id", value: "x", reason: "must be numeric" },
    });
    expect(isInvalidParameterError(invalid)).toBe(true);

    const unexpected = errorFromResponse({
      status: 500,
      code: "UNEXPECTED",
      message: "Unexpected error in getUser: boom",
      severity: "error",
      context: { operation: "getUser" },
    });
    expect(isUnexpectedError(unexpected)).toBe(true);
  });

  it("maps unknown codes to NetSuiteApiError", () => {
    const err = errorFromResponse({
      status: 502,
      code: "SSS_CONNECTION_TIME_OUT",
      message: "timeout",
      severity: "error",
    });
    expect(isNetSuiteApiError(err)).toBe(true);
  });
});

describe("factories", () => {
  it("builds NotFoundError and SchemaValidationError", () => {
    expect(makeNotFoundError("Role", 3).code).toBe("NOT_FOUND");
    const err = makeSchemaValidationError("settings", []);
    expect(isSchemaValidationError(err)).toBe(true);
  });
});
