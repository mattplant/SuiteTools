// SPDX-License-Identifier: GPL-3.0-or-later

import { afterEach, describe, expect, it, vi } from "vitest";
import { InvalidParameterError } from "@suiteworks/suitetools-shared";
import { getData } from "./netSuiteClient";

describe("getData reserved params", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("rejects reserved keys before fetch", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getData("users", { script: "x" })).rejects.toBeInstanceOf(
      InvalidParameterError,
    );
    await expect(getData("users", { deploy: "x" })).rejects.toBeInstanceOf(
      InvalidParameterError,
    );
    await expect(getData("users", { compid: "x" })).rejects.toBeInstanceOf(
      InvalidParameterError,
    );
    await expect(getData("users", { endpoint: "users" })).rejects.toBeInstanceOf(
      InvalidParameterError,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("mentions additional reserved conflicts in the reason", async () => {
    vi.stubGlobal("fetch", vi.fn());

    await expect(
      getData("users", { script: "a", deploy: "b" }),
    ).rejects.toMatchObject({
      message: expect.stringContaining("also: deploy"),
    });
  });

  it("omits nullish and empty-string params from the request URL", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ status: 200, data: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await getData("users", {
      active: "T",
      roles: undefined,
      title: null,
      q: "",
      page: 0,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const url = String(fetchMock.mock.calls[0]?.[0]);
    expect(url).toContain("endpoint=users");
    expect(url).toContain("active=T");
    expect(url).toContain("page=0");
    expect(url).not.toContain("roles=");
    expect(url).not.toContain("title=");
    expect(url).not.toContain("q=");
  });
});
