// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from "vitest";
import { UserBundle } from "./user";

describe("UserBundle schema", () => {
  const validUser = {
    id: 1,
    isInactive: false,
    email: "a@example.com",
    name: "Ada Lovelace",
    title: "Engineer",
  };

  it("parses a valid user", () => {
    expect(UserBundle.schema.parse(validUser)).toMatchObject(validUser);
  });

  it("coerces NetSuite T/F flags and rejects bad ids", () => {
    expect(
      UserBundle.schema.parse({ ...validUser, isInactive: "T" }),
    ).toMatchObject({ isInactive: true });
    expect(() =>
      UserBundle.schema.parse({ ...validUser, id: -1 }),
    ).toThrow();
  });

  it("coerces null SuiteQL string fields to empty string", () => {
    expect(
      UserBundle.schema.parse({
        ...validUser,
        email: null,
        name: null,
        title: null,
      }),
    ).toMatchObject({ email: "", name: "", title: "" });
  });
});
