// SPDX-License-Identifier: GPL-3.0-or-later

/** @vitest-environment jsdom */

import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { Results } from "./Results";
import { ResultsTypes } from "./types";

// Minimal Modal so the test exercises this component's open/close logic rather than flowbite's.
vi.mock("flowbite-react", () => ({
  Modal: ({ show, children }: { show: boolean; children: React.ReactNode }) =>
    show ? <div data-testid="modal">{children}</div> : null,
}));

// Stand-in for the results grid: a button that selects a record and opens the modal.
vi.mock("./DynamicResultsRenderer", () => ({
  DynamicResultsRenderer: ({
    setId,
    setOpenModal,
  }: {
    setId: (id: number) => void;
    setOpenModal: (open: boolean) => void;
  }) => (
    <button
      type="button"
      onClick={() => {
        setId(901);
        setOpenModal(true);
      }}
    >
      open-record
    </button>
  ),
}));

// Bypass the schema assertions; this test is about modal lifecycle, not payload validation.
vi.mock("./ResultsModal", () => ({
  ResultsModal: ({ data }: { data: unknown }) => (
    <div>modal-content:{String((data as { id?: number } | undefined)?.id)}</div>
  ),
}));

afterEach(() => {
  cleanup();
});

/** Navigates to a caller-supplied path, standing in for a modal's navigation button. */
function NavButton({ to, label }: { to: string; label: string }): React.ReactElement {
  const navigate = useNavigate();
  return (
    <button type="button" onClick={() => navigate(to)}>
      {label}
    </button>
  );
}

async function openModal(getModalData = vi.fn(async () => ({ id: 901 }))) {
  render(
    <MemoryRouter initialEntries={["/job/1"]}>
      <NavButton to="/job/1" label="nav-same-path" />
      <NavButton to="/jobRun/901" label="nav-other-path" />
      <Results type={ResultsTypes.JOBRUN} lines={[]} getModalData={getModalData} />
    </MemoryRouter>,
  );

  act(() => {
    screen.getByText("open-record").click();
  });
  await waitFor(() => {
    expect(screen.getByText("modal-content:901")).toBeTruthy();
  });
}

describe("Results modal close-on-navigation", () => {
  it("closes when navigation targets a different route", async () => {
    await openModal();

    act(() => {
      screen.getByText("nav-other-path").click();
    });

    await waitFor(() => {
      expect(screen.queryByTestId("modal")).toBeNull();
    });
  });

  // Regression test for #88. The Job Executions modal is hosted on /job/:id and its "Job Details"
  // button navigates to /job/:id, so the path does not change. Keyed on location.pathname the
  // effect never fired, the modal stayed open over the page, and the click looked dead.
  it("closes when navigation targets the route it is already on", async () => {
    await openModal();

    act(() => {
      screen.getByText("nav-same-path").click();
    });

    await waitFor(() => {
      expect(screen.queryByTestId("modal")).toBeNull();
    });
  });
});
