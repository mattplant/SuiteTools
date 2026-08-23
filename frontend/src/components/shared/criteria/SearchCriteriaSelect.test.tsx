// SPDX-License-Identifier: GPL-3.0-or-later

/** @vitest-environment jsdom */

import { cleanup, render, screen } from "@testing-library/react";
import { useForm } from "react-hook-form";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { OptionValues } from "@suiteworks/suitetools-shared";
import { SearchCriteriaSelect } from "./SearchCriteriaSelect";
import { OptionValuesTypes } from "./types";
import type { CriteriaFields } from "./types";

const getOptionValues = vi.hoisted(() => vi.fn());
vi.mock("./getOptionValues", () => ({ getOptionValues }));

const OPTIONS: OptionValues = [
  { value: "17", text: "Administrator" },
  { value: "3", text: "Bookkeeper" },
];

afterEach(() => {
  cleanup();
  getOptionValues.mockReset();
});

function Harness(props: Omit<React.ComponentProps<typeof SearchCriteriaSelect>, "register">) {
  const { register } = useForm<CriteriaFields>();
  return <SearchCriteriaSelect register={register} {...props} />;
}

function optionPairs(): Array<[string, string]> {
  return Array.from(screen.getByRole("listbox").querySelectorAll("option"), (option) => [
    option.getAttribute("value") ?? "",
    option.textContent ?? "",
  ]);
}

describe("SearchCriteriaSelect", () => {
  it("labels the select and registers under the same name", () => {
    render(<Harness name="roles" label="Roles" options={OPTIONS} multiple />);

    const select = screen.getByLabelText("Roles");
    // Resolving by label at all proves htmlFor matches the id.
    expect(select).toBe(screen.getByRole("listbox"));
    expect(select.getAttribute("name")).toBe("roles");
    expect((select as HTMLSelectElement).multiple).toBe(true);
  });

  it("submits record ids by default", () => {
    render(<Harness name="roles" label="Roles" options={OPTIONS} />);

    expect(optionPairs()).toEqual([
      ["", "All"],
      ["17", "Administrator"],
      ["3", "Bookkeeper"],
    ]);
  });

  it('submits display text when valueBy is "text"', () => {
    // The *Name pickers filter by name, not id — normalising this away breaks their searches.
    render(<Harness name="roleName" label="Role" options={OPTIONS} valueBy="text" />);

    expect(optionPairs()).toEqual([
      ["", "All"],
      ["Administrator", "Administrator"],
      ["Bookkeeper", "Bookkeeper"],
    ]);
  });

  it("uses the given catch-all value, and omits the entry when null", () => {
    render(<Harness name="rows" label="Rows" options={[{ value: "50", text: "50" }]} allValue="0" />);
    expect(optionPairs()[0]).toEqual(["0", "All"]);

    cleanup();
    render(<Harness name="timeMode" label="Time Mode" options={[{ value: "now", text: "Now" }]} allValue={null} />);
    expect(optionPairs()).toEqual([["now", "Now"]]);
  });

  it("fills the list from the fetched type", async () => {
    getOptionValues.mockResolvedValue(OPTIONS);

    render(<Harness name="roles" label="Roles" optionsType={OptionValuesTypes.ROLE} multiple />);

    expect(await screen.findByRole("option", { name: "Administrator" })).toBeTruthy();
    expect(getOptionValues).toHaveBeenCalledWith(OptionValuesTypes.ROLE);
  });
});
