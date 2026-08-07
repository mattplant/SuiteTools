// SPDX-License-Identifier: GPL-3.0-or-later

/** @vitest-environment jsdom */

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useEntityList } from "./useEntityList";

const triggerError = vi.fn();

vi.mock("./useErrorBoundaryTrigger", () => ({
  useErrorBoundaryTrigger: () => triggerError,
}));

vi.mock("@suiteworks/suitetools-shared", async () => {
  const actual = await vi.importActual<typeof import("@suiteworks/suitetools-shared")>(
    "@suiteworks/suitetools-shared",
  );
  return {
    ...actual,
    handleError: vi.fn((err: unknown, opts?: { reactTrigger?: (e: unknown) => void }) => {
      opts?.reactTrigger?.(err);
      return err;
    }),
  };
});

import { handleError } from "@suiteworks/suitetools-shared";

const handleErrorMock = vi.mocked(handleError);

describe("useEntityList", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("loads and normalizes results when criteria is set", async () => {
    const fetchList = vi.fn().mockResolvedValue([{ id: 1 }, { id: 2 }]);

    const { result } = renderHook(() =>
      useEntityList({
        defaultCriteria: { active: "T" },
        fetchList,
      }),
    );

    await waitFor(() => {
      expect(result.current.results).toEqual([{ id: 1 }, { id: 2 }]);
    });
    expect(fetchList).toHaveBeenCalledWith({ active: "T" });
  });

  it("clears results and triggers error handling on failure", async () => {
    const err = new Error("boom");
    const fetchList = vi.fn().mockRejectedValue(err);

    const { result } = renderHook(() =>
      useEntityList({
        defaultCriteria: { active: "" },
        fetchList,
      }),
    );

    await waitFor(() => {
      expect(handleErrorMock).toHaveBeenCalled();
    });
    expect(result.current.results).toEqual([]);
    expect(triggerError).toHaveBeenCalledWith(err);
  });

  it("refetches when criteria changes", async () => {
    const fetchList = vi
      .fn()
      .mockResolvedValueOnce([{ id: 1 }])
      .mockResolvedValueOnce([{ id: 2 }]);

    const { result } = renderHook(() =>
      useEntityList({
        defaultCriteria: { active: "T" },
        fetchList,
      }),
    );

    await waitFor(() => {
      expect(result.current.results).toEqual([{ id: 1 }]);
    });

    act(() => {
      result.current.setCriteria({ active: "F" });
    });

    await waitFor(() => {
      expect(result.current.results).toEqual([{ id: 2 }]);
    });
    expect(fetchList).toHaveBeenLastCalledWith({ active: "F" });
  });
});
