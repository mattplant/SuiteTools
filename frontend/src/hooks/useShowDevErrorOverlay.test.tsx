// SPDX-License-Identifier: GPL-3.0-or-later

/** @vitest-environment jsdom */

import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useShowDevErrorOverlay } from "./useShowDevErrorOverlay";

vi.mock("./useAppSettingsContext", () => ({ useAppSettingsContext: vi.fn() }));

import { useAppSettingsContext } from "./useAppSettingsContext";

const mockedSettings = vi.mocked(useAppSettingsContext);

describe("useShowDevErrorOverlay", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
  });

  it("always shows the overlay in Vite DEV", () => {
    vi.stubEnv("DEV", true);
    mockedSettings.mockReturnValue({ settings: { devMode: false }, loading: false } as never);

    expect(renderHook(() => useShowDevErrorOverlay()).result.current).toBe(true);
  });

  it("hides the overlay while settings are loading outside DEV", () => {
    vi.stubEnv("DEV", false);
    mockedSettings.mockReturnValue({ settings: null, loading: true } as never);

    expect(renderHook(() => useShowDevErrorOverlay()).result.current).toBe(false);
  });

  it("follows settings.devMode outside DEV", () => {
    vi.stubEnv("DEV", false);
    mockedSettings.mockReturnValue({ settings: { devMode: true }, loading: false } as never);
    expect(renderHook(() => useShowDevErrorOverlay()).result.current).toBe(true);

    mockedSettings.mockReturnValue({ settings: { devMode: false }, loading: false } as never);
    expect(renderHook(() => useShowDevErrorOverlay()).result.current).toBe(false);
  });
});
