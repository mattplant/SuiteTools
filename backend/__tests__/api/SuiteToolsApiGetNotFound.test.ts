// SPDX-License-Identifier: GPL-3.0-or-later

import {
  ensureEntityOrSoftNotFound,
  isLegacyEmptySoftMiss,
  softNotFoundResponse,
} from "../../TypeScripts/SuiteTools/api/SuiteToolsApiGetNotFound";
import { validateGetResponse } from "../../TypeScripts/SuiteTools/api/SuiteToolsApiGetValidate";

describe("SuiteToolsApiGetNotFound", () => {
  it("detects legacy empty soft-misses", () => {
    expect(isLegacyEmptySoftMiss({})).toBe(true);
    expect(isLegacyEmptySoftMiss(null)).toBe(true);
    expect(isLegacyEmptySoftMiss(undefined)).toBe(true);
    expect(isLegacyEmptySoftMiss({ id: 1, name: "x" })).toBe(false);
    expect(isLegacyEmptySoftMiss({ code: "NOT_FOUND", message: "gone" })).toBe(false);
    expect(isLegacyEmptySoftMiss([])).toBe(false);
  });

  it("builds a canonical soft NotFound response", () => {
    expect(softNotFoundResponse("No file found with id of 9")).toEqual({
      status: 404,
      data: { code: "NOT_FOUND", message: "No file found with id of 9" },
      message: "No file found with id of 9",
    });
  });

  it("normalizes legacy model misses and passes payload validation", () => {
    const normalized = ensureEntityOrSoftNotFound(
      { status: 200, data: {}, message: "No file found with id of 9" },
      "No file found with id of 9",
    );
    expect(normalized).toEqual({
      status: 404,
      data: { code: "NOT_FOUND", message: "No file found with id of 9" },
      message: "No file found with id of 9",
    });
    expect(validateGetResponse("file", normalized)).toEqual(normalized);
  });

  it("passes through entity payloads", () => {
    const entity = {
      status: 200 as const,
      data: {
        id: 1,
        folder: 2,
        dateCreated: "2026-08-05T12:00:00.000Z",
        lastModifiedDate: "2026-08-05T12:00:00.000Z",
        fileTypeName: "PDF",
        name: "a.pdf",
        fileSize: 10,
        description: "",
        url: "/core/media/media.nl",
      },
    };
    expect(ensureEntityOrSoftNotFound(entity, "fallback")).toEqual({ status: 200, data: entity.data });
  });
});
