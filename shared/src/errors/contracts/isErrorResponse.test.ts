// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from "vitest";
import { isErrorResponse, parseErrorResponse } from "./isErrorResponse";

describe("isErrorResponse", () => {
  it("accepts a minimal error payload", () => {
    expect(
      isErrorResponse({
        status: 404,
        code: "NOT_FOUND",
        message: "User not found",
      }),
    ).toBe(true);
  });

  it("rejects success envelopes that carry data", () => {
    expect(
      isErrorResponse({
        status: 200,
        code: "OK",
        message: "ok",
        data: {},
      }),
    ).toBe(false);
  });

  it("rejects non-objects and incomplete shapes", () => {
    expect(isErrorResponse(null)).toBe(false);
    expect(isErrorResponse("NOT_FOUND")).toBe(false);
    expect(isErrorResponse({ status: 500, code: "X" })).toBe(false);
  });

  it("rejects invalid severity or non-object context", () => {
    expect(
      isErrorResponse({
        status: 500,
        code: "UNEXPECTED_ERROR",
        message: "boom",
        severity: "critical",
      }),
    ).toBe(false);
    expect(
      isErrorResponse({
        status: 500,
        code: "UNEXPECTED_ERROR",
        message: "boom",
        context: ["not-an-object"],
      }),
    ).toBe(false);
  });
});

describe("parseErrorResponse", () => {
  it("normalizes severity and preserves context", () => {
    expect(
      parseErrorResponse({
        status: 400,
        code: "INVALID_PARAMETER",
        message: "bad id",
        context: { parameterName: "id" },
      }),
    ).toEqual({
      status: 400,
      code: "INVALID_PARAMETER",
      message: "bad id",
      severity: "error",
      context: { parameterName: "id" },
    });
  });

  it("returns null for non-error payloads", () => {
    expect(parseErrorResponse({ status: 200, data: [] })).toBeNull();
  });
});
