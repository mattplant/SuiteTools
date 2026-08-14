// SPDX-License-Identifier: GPL-3.0-or-later

/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RecordCriteriaForm } from "./RecordCriteriaForm";

afterEach(() => {
  cleanup();
});

describe("RecordCriteriaForm", () => {
  it("renders submit label and passes register/control to children", () => {
    const setCriteria = vi.fn();
    const child = vi.fn(() => <span>fields</span>);

    render(
      <RecordCriteriaForm defaultCriteria={{ active: "T" }} setCriteria={setCriteria} submitLabel="Get Items">
        {child}
      </RecordCriteriaForm>,
    );

    expect(screen.getByRole("button", { name: "Get Items" })).toBeTruthy();
    expect(screen.getByText("fields")).toBeTruthy();
    expect(child).toHaveBeenCalledWith(
      expect.objectContaining({
        register: expect.any(Function),
        control: expect.any(Object),
        setValue: expect.any(Function),
      }),
    );
  });

  it("renders optional actions beside submit", () => {
    render(
      <RecordCriteriaForm
        defaultCriteria={{}}
        setCriteria={vi.fn()}
        submitLabel="Get Items"
        actions={<button type="button">Extra</button>}
      >
        {() => null}
      </RecordCriteriaForm>,
    );

    expect(screen.getByRole("button", { name: "Get Items" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Extra" })).toBeTruthy();
  });
});
