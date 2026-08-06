// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from "vitest";
import type { NotFound } from "@suiteworks/suitetools-shared";
import { pickCriteria, toEntityArray } from "./adapterUtils";

describe("pickCriteria", () => {
  it("keeps defined whitelist keys and drops undefined", () => {
    const fields: {
      active?: string | undefined;
      roles?: string | undefined;
      extra?: string | undefined;
    } = {
      active: "T",
      roles: undefined,
      extra: "x",
    };
    expect(pickCriteria(fields, ["active", "roles"] as const)).toEqual({
      active: "T",
    });
  });


  it("throws when a key is not present on the criteria object", () => {
    const fields: { active?: string; missing?: string } = { active: "T" };
    expect(() => pickCriteria(fields, ["missing"] as const)).toThrow(
      /Invalid criteria key/,
    );
  });
});

describe("toEntityArray", () => {
  it("returns arrays unchanged", () => {
    const rows = [{ id: 1 }, { id: 2 }];
    expect(toEntityArray(rows)).toEqual(rows);
  });

  it("normalizes NotFound to an empty array", () => {
    const notFound: NotFound = { code: "NOT_FOUND", message: "gone" };
    expect(toEntityArray(notFound)).toEqual([]);
  });
});
