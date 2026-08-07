// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it, vi } from "vitest";
import type { LoaderFunctionArgs } from "react-router-dom";
import { NotFoundError } from "@suiteworks/suitetools-shared";
import { makeEntityLoader } from "./loaderUtils";

function loaderArgs(id: string | undefined): LoaderFunctionArgs {
  return { params: { id }, request: new Request("http://local/test") } as LoaderFunctionArgs;
}

describe("makeEntityLoader", () => {
  it("awaits the record and returns it under the key", async () => {
    const fetchById = vi.fn().mockResolvedValue({ id: 1, name: "a" });
    const loader = makeEntityLoader("user", "User", fetchById);

    const data = await loader(loaderArgs("1"));

    expect(fetchById).toHaveBeenCalledWith(1);
    expect(data).toEqual({ user: { id: 1, name: "a" } });
    expect(data.user).not.toBeInstanceOf(Promise);
  });

  it("maps fetch failures through mapLoaderError", async () => {
    const fetchById = vi.fn().mockRejectedValue(new NotFoundError("User", 9));
    const loader = makeEntityLoader("user", "User", fetchById);

    await expect(loader(loaderArgs("9"))).rejects.toBeInstanceOf(NotFoundError);
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
