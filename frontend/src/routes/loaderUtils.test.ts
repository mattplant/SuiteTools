// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it, vi } from "vitest";
import type { LoaderFunctionArgs } from "react-router-dom";
import { NotFoundError } from "@suiteworks/suitetools-shared";
import { makeEntityLoader } from "./loaderUtils";

function loaderArgs(id: string | undefined): LoaderFunctionArgs {
  return { params: { id }, request: new Request("http://local/test") } as LoaderFunctionArgs;
}

describe("makeEntityLoader", () => {
  it("returns a deferred promise by default", async () => {
    const fetchById = vi.fn().mockResolvedValue({ id: 1, name: "a" });
    const loader = makeEntityLoader("user", "User", fetchById);

    const data = await loader(loaderArgs("1"));

    expect(fetchById).toHaveBeenCalledWith(1);
    expect(data.user).toBeInstanceOf(Promise);
    await expect(data.user).resolves.toEqual({ id: 1, name: "a" });
  });

  it("awaits the record when awaitResult is true", async () => {
    const fetchById = vi.fn().mockResolvedValue({ id: 2 });
    const loader = makeEntityLoader("script", "Script", fetchById, {
      awaitResult: true,
    });

    const data = await loader(loaderArgs("2"));

    expect(data).toEqual({ script: { id: 2 } });
    expect(data.script).not.toBeInstanceOf(Promise);
  });

  it("maps fetch failures through mapLoaderError (deferred)", async () => {
    const fetchById = vi.fn().mockRejectedValue(new NotFoundError("User", 9));
    const loader = makeEntityLoader("user", "User", fetchById);

    const data = await loader(loaderArgs("9"));
    await expect(data.user).rejects.toBeInstanceOf(NotFoundError);
  });

  it("rejects non-positive ids when requirePositiveId is set", async () => {
    const fetchById = vi.fn();
    const loader = makeEntityLoader("job", "Job", fetchById, {
      requirePositiveId: true,
    });

    await expect(loader(loaderArgs("0"))).rejects.toBeInstanceOf(NotFoundError);
    await expect(loader(loaderArgs("undefined"))).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(fetchById).not.toHaveBeenCalled();
  });
});
