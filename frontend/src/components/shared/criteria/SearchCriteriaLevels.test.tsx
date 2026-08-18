// SPDX-License-Identifier: GPL-3.0-or-later

/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { afterEach, describe, expect, it } from "vitest";
import { SearchCriteriaLevels } from "./SearchCriteriaLevels";
import type { CriteriaFields } from "./types";

afterEach(() => {
  cleanup();
});

function Harness() {
  const { register } = useForm<CriteriaFields>();
  return <SearchCriteriaLevels register={register} />;
}

describe("SearchCriteriaLevels", () => {
  it("associates the Levels label with the select", () => {
    render(<Harness />);

    // Resolves only when htmlFor matches the select's id.
    expect(screen.getByLabelText("Levels")).toBe(screen.getByRole("listbox"));
  });
});
