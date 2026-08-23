// SPDX-License-Identifier: GPL-3.0-or-later

/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DynamicResultsRenderer } from "./DynamicResultsRenderer";
import { resultsRegistry } from "./registry";
import { ResultsTypes } from "./types";

// Stand-in for react-data-grid that surfaces only the accessible name, so this file can sweep all
// eleven entity grids without mounting eleven real grids.
vi.mock("react-data-grid", () => ({
  DataGrid: (props: { "aria-label": string }) => <div data-testid="grid" data-label={props["aria-label"]} />,
}));

vi.mock("flowbite-react", () => ({
  Button: ({ children }: { children: React.ReactNode }) => <button type="button">{children}</button>,
}));

afterEach(() => {
  cleanup();
});

const ENTITY_TYPES = Object.values(ResultsTypes);

// #109: none of the eleven grids had an accessible name. The name is threaded from the registry
// rather than written at each grid, so this asserts the whole path — registry title, through
// DynamicResultsRenderer, through the feature RecordResults, onto the grid — for every entity. A
// grid added without forwarding `label` fails here rather than shipping nameless.
describe("DynamicResultsRenderer accessible name", () => {
  it.each(ENTITY_TYPES)("names the %s grid with its registry title", (type) => {
    render(<DynamicResultsRenderer type={type} rows={[]} setId={vi.fn()} setOpenModal={vi.fn()} />);

    expect(screen.getByTestId("grid").getAttribute("data-label")).toBe(resultsRegistry[type].title);
  });
});
