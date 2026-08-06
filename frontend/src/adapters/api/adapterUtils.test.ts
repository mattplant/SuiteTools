// SPDX-License-Identifier: GPL-3.0-or-later

import { afterEach, describe, expect, it, vi } from "vitest";
import type { NotFound } from "@suiteworks/suitetools-shared";
import { makeListAdapter, pickCriteria, toEntityArray } from "./adapterUtils";
import { getData } from "./netSuiteClient";

vi.mock("./netSuiteClient", () => ({
  getData: vi.fn(),
}));

const getDataMock = vi.mocked(getData);

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

describe("makeListAdapter", () => {
  afterEach(() => {
    getDataMock.mockReset();
  });

  type Row = { id: number; name: string };
  type Criteria = { active?: string; roles?: string[] };

  const schema = {
    parse: (input: unknown) => input as { data: Row[] | NotFound; status?: number },
  };

  it("fetches, validates, and returns rows with picked criteria", async () => {
    getDataMock.mockResolvedValue({
      status: 200,
      data: [{ id: 1, name: "a" }],
    });

    const getRows = makeListAdapter<Row, Criteria, "active" | "roles">(
      "users",
      schema,
      ["active", "roles"] as const,
    );

    const result = await getRows({ active: "T", roles: undefined });

    expect(getDataMock).toHaveBeenCalledWith("users", { active: "T" });
    expect(result).toEqual([{ id: 1, name: "a" }]);
  });

  it("returns [] on NotFound data", async () => {
    getDataMock.mockResolvedValue({
      status: 404,
      data: { code: "NOT_FOUND", message: "gone" },
    });

    const getRows = makeListAdapter<Row, Criteria, "active">(
      "users",
      schema,
      ["active"] as const,
    );

    await expect(getRows({ active: "T" })).resolves.toEqual([]);
  });

  it("returns [] on nullish data", async () => {
    getDataMock.mockResolvedValue({ status: 200, data: null as unknown as Row[] });

    const getRows = makeListAdapter<Row, Criteria, "active">(
      "users",
      schema,
      ["active"] as const,
    );

    await expect(getRows({ active: "T" })).resolves.toEqual([]);
  });

  it("applies adaptItem and mapParams when provided", async () => {
    getDataMock.mockResolvedValue({
      status: 200,
      data: [{ id: 1, name: "a" }],
    });

    const getRows = makeListAdapter<Row, Criteria, "active" | "roles">(
      "users",
      schema,
      ["active", "roles"] as const,
      {
        mapParams: (picked) => ({ active: picked.active, joined: "x" }),
        adaptItem: (row) => ({ ...row, name: row.name.toUpperCase() }),
      },
    );

    const result = await getRows({ active: "T", roles: ["1"] });

    expect(getDataMock).toHaveBeenCalledWith("users", { active: "T", joined: "x" });
    expect(result).toEqual([{ id: 1, name: "A" }]);
  });
});
