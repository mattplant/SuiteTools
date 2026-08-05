// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from "vitest";
import { endpointMap, endpointNames } from "./endpointMap";

describe("endpointMap", () => {
  it("is frozen and exposes a stable name list", () => {
    expect(Object.isFrozen(endpointMap)).toBe(true);
    expect(endpointNames).toEqual(Object.keys(endpointMap));
    expect(endpointNames.length).toBeGreaterThan(0);
  });

  it("includes core entity endpoints used by FE/BE", () => {
    for (const name of [
      "settings",
      "user",
      "users",
      "role",
      "roles",
      "job",
      "jobs",
    ] as const) {
      expect(endpointMap[name]).toEqual(expect.any(String));
      expect(endpointMap[name].length).toBeGreaterThan(0);
    }
  });

  it("keeps every description non-empty", () => {
    for (const name of endpointNames) {
      expect(endpointMap[name].trim().length).toBeGreaterThan(0);
    }
  });
});
