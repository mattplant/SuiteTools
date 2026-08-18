// SPDX-License-Identifier: GPL-3.0-or-later

/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Column } from "react-data-grid";
import { ResultsGrid, summaryColumn } from "./ResultsGrid";
import type { SummaryRow } from "./types";

afterEach(() => {
  cleanup();
});

type Row = { id: number; name: string };

vi.mock("react-data-grid", () => ({
  DataGrid: (props: {
    rows: Row[];
    bottomSummaryRows: SummaryRow[];
    defaultColumnOptions: { sortable?: boolean; resizable?: boolean; minWidth?: number };
    className: string;
    onCellClick: (cell: { row: Row }) => void;
  }) => (
    <div
      data-testid="grid"
      data-sortable={String(props.defaultColumnOptions.sortable)}
      data-resizable={String(props.defaultColumnOptions.resizable)}
      data-minwidth={props.defaultColumnOptions.minWidth ?? ""}
      data-summary={String(props.bottomSummaryRows[0]?.totalCount)}
      data-class={props.className}
    >
      <button type="button" onClick={() => props.onCellClick({ row: props.rows[0] })}>
        cell
      </button>
    </div>
  ),
}));

vi.mock("flowbite-react", () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

const columns: Column<Row, SummaryRow>[] = [
  summaryColumn({ key: "id", name: "ID" }, "total"),
  summaryColumn({ key: "name", name: "Name" }, "count"),
];

describe("summaryColumn", () => {
  it("renders Total in a strong tag", () => {
    const col = summaryColumn<Row>({ key: "id", name: "ID" }, "total");
    render(<div>{col.renderSummaryCell?.({ row: { id: "total_0", totalCount: 3 } } as never)}</div>);
    expect(screen.getByText("Total").tagName).toBe("STRONG");
  });

  it("renders the record count from the summary row", () => {
    const col = summaryColumn<Row>({ key: "name", name: "Name" }, "count");
    render(<div>{col.renderSummaryCell?.({ row: { id: "total_0", totalCount: 3 } } as never)}</div>);
    expect(screen.getByText("3 records")).toBeTruthy();
  });
});

describe("ResultsGrid", () => {
  it("wires export, summary count, sortable/resizable defaults, and row-click", () => {
    const setId = vi.fn();
    const setOpenModal = vi.fn();

    render(
      <ResultsGrid columns={columns} rows={[{ id: 42, name: "alpha" }]} setId={setId} setOpenModal={setOpenModal} />,
    );

    expect(screen.getByText("Export to CSV")).toBeTruthy();
    const grid = screen.getByTestId("grid");
    expect(grid.getAttribute("data-summary")).toBe("1");
    expect(grid.getAttribute("data-sortable")).toBe("true");
    expect(grid.getAttribute("data-resizable")).toBe("true");
    expect(grid.getAttribute("data-class")).toBe("fill-grid");

    screen.getByText("cell").click();
    expect(setId).toHaveBeenCalledWith(42);
    expect(setOpenModal).toHaveBeenCalledWith(true);
  });

  it("keeps sortable/resizable when extra defaultColumnOptions are passed", () => {
    render(
      <ResultsGrid
        columns={columns}
        rows={[]}
        setId={vi.fn()}
        setOpenModal={vi.fn()}
        defaultColumnOptions={{ minWidth: 110 }}
      />,
    );

    const grid = screen.getByTestId("grid");
    expect(grid.getAttribute("data-sortable")).toBe("true");
    expect(grid.getAttribute("data-resizable")).toBe("true");
    expect(grid.getAttribute("data-minwidth")).toBe("110");
  });
});
