// SPDX-License-Identifier: GPL-3.0-or-later

import { afterEach, describe, expect, it, vi } from "vitest";
import { ApmUnavailableError } from "./ApmUnavailableError";
import { getDataFromPageContent } from "./collectData";

describe("getDataFromPageContent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("returns a successful JSON envelope", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            success: true,
            message: "ok",
            data: { rows: 1 },
          }),
      }),
    );

    await expect(
      getDataFromPageContent("https://example.test/apm"),
    ).resolves.toEqual({
      success: true,
      message: "ok",
      data: { rows: 1 },
    });
  });

  it("throws ApmUnavailableError on non-OK HTTP", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        text: async () => "<html>Notice</html>",
      }),
    );

    await expect(
      getDataFromPageContent("https://example.test/apm"),
    ).rejects.toBeInstanceOf(ApmUnavailableError);
  });

  it("throws ApmUnavailableError when the body is HTML", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () => "<html><body>Notice</body></html>",
      }),
    );

    await expect(
      getDataFromPageContent("https://example.test/apm"),
    ).rejects.toBeInstanceOf(ApmUnavailableError);
  });

  it("throws when success is false with a message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        text: async () =>
          JSON.stringify({
            success: false,
            message: "APM disabled",
            data: {},
          }),
      }),
    );

    await expect(
      getDataFromPageContent("https://example.test/apm"),
    ).rejects.toThrow(/APM disabled/);
  });
});
