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

type GridProps = {
  rows: Row[];
  bottomSummaryRows: SummaryRow[];
  defaultColumnOptions: { sortable?: boolean; resizable?: boolean; minWidth?: number };
  className: string;
  "aria-label": string;
  onCellClick: (cell: { row: Row }) => void;
  onCellKeyDown: (args: KeyDownArgs, event: KeyEvent) => void;
};

type KeyDownArgs = { mode: "ACTIVE" | "EDIT"; row?: Row };
type KeyEvent = { key: string; preventGridDefault: () => void; preventDefault: () => void };

// The real grid is not mounted, so what a test can check here is the handler's own logic, not that
// react-data-grid invokes it on Enter — see the note in #109. `lastProps` is how the keyboard test
// reaches `onCellKeyDown`, which has no rendered trigger the way the click handler does.
const lastProps = vi.hoisted(() => ({ current: null as GridProps | null }));

vi.mock("react-data-grid", () => ({
  DataGrid: (props: GridProps) => {
    lastProps.current = props;
    return (
      <div
        data-testid="grid"
        data-sortable={String(props.defaultColumnOptions.sortable)}
        data-resizable={String(props.defaultColumnOptions.resizable)}
        data-minwidth={props.defaultColumnOptions.minWidth ?? ""}
        data-summary={String(props.bottomSummaryRows[0]?.totalCount)}
        data-class={props.className}
        data-label={props["aria-label"]}
      >
        <button type="button" onClick={() => props.onCellClick({ row: props.rows[0] })}>
          cell
        </button>
      </div>
    );
  },
}));

/** Fires the grid's `onCellKeyDown` with a stand-in for react-data-grid's cell keyboard event. */
function pressKey(key: string, args: KeyDownArgs): { preventedGridDefault: boolean; preventedDefault: boolean } {
  const prevented = { preventedGridDefault: false, preventedDefault: false };
  const event: KeyEvent = {
    key,
    preventGridDefault: () => {
      prevented.preventedGridDefault = true;
    },
    preventDefault: () => {
      prevented.preventedDefault = true;
    },
  };
  lastProps.current?.onCellKeyDown(args, event);
  return prevented;
}

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
  it("wires export, summary count, sortable/resizable defaults, accessible name, and row-click", () => {
    const setId = vi.fn();
    const setOpenModal = vi.fn();

    render(
      <ResultsGrid
        label="Widget"
        columns={columns}
        rows={[{ id: 42, name: "alpha" }]}
        setId={setId}
        setOpenModal={setOpenModal}
      />,
    );

    expect(screen.getByText("Export to CSV")).toBeTruthy();
    const grid = screen.getByTestId("grid");
    expect(grid.getAttribute("data-summary")).toBe("1");
    expect(grid.getAttribute("data-sortable")).toBe("true");
    expect(grid.getAttribute("data-resizable")).toBe("true");
    expect(grid.getAttribute("data-class")).toBe("fill-grid");
    expect(grid.getAttribute("data-label")).toBe("Widget");

    screen.getByText("cell").click();
    expect(setId).toHaveBeenCalledWith(42);
    expect(setOpenModal).toHaveBeenCalledWith(true);
  });

  it("keeps sortable/resizable when extra defaultColumnOptions are passed", () => {
    render(
      <ResultsGrid
        label="Widget"
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

// #109: the grid was mouse-only — `onCellClick` was the sole way into a record, a WCAG 2.1.1
// failure across all sixteen call sites. These cover the handler's own branching; that
// react-data-grid actually calls it on Enter is verified by keyboard smoke, not here.
describe("ResultsGrid keyboard activation", () => {
  const row = { id: 42, name: "alpha" };

  function renderGrid(): { setId: ReturnType<typeof vi.fn>; setOpenModal: ReturnType<typeof vi.fn> } {
    const setId = vi.fn();
    const setOpenModal = vi.fn();
    render(<ResultsGrid label="Widget" columns={columns} rows={[row]} setId={setId} setOpenModal={setOpenModal} />);
    return { setId, setOpenModal };
  }

  it.each(["Enter", " "])("opens the record on %s, the same as a click", (key) => {
    const { setId, setOpenModal } = renderGrid();

    const prevented = pressKey(key, { mode: "ACTIVE", row });

    expect(setId).toHaveBeenCalledWith(42);
    expect(setOpenModal).toHaveBeenCalledWith(true);
    // Without both, the grid moves the active cell and the browser scrolls on Space.
    expect(prevented).toEqual({ preventedGridDefault: true, preventedDefault: true });
  });

  it("leaves navigation keys to the grid", () => {
    const { setId, setOpenModal } = renderGrid();

    const prevented = pressKey("ArrowDown", { mode: "ACTIVE", row });

    expect(setId).not.toHaveBeenCalled();
    expect(setOpenModal).not.toHaveBeenCalled();
    expect(prevented.preventedGridDefault).toBe(false);
  });

  // `row` is undefined when the active cell is a header or the "N records" summary footer.
  it("ignores Enter on a cell with no row", () => {
    const { setId, setOpenModal } = renderGrid();

    pressKey("Enter", { mode: "ACTIVE" });

    expect(setId).not.toHaveBeenCalled();
    expect(setOpenModal).not.toHaveBeenCalled();
  });

  it("ignores Enter while a cell editor is open", () => {
    const { setId, setOpenModal } = renderGrid();

    pressKey("Enter", { mode: "EDIT", row });

    expect(setId).not.toHaveBeenCalled();
    expect(setOpenModal).not.toHaveBeenCalled();
  });
});
