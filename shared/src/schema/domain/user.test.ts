// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from "vitest";
import { UserBundle } from "./user";

describe("UserBundle schema", () => {
  const validUser = {
    id: 1,
    isinactive: false,
    email: "a@example.com",
    name: "Ada Lovelace",
    title: "Engineer",
  };

  it("parses a valid user", () => {
    expect(UserBundle.schema.parse(validUser)).toMatchObject(validUser);
  });

  it("coerces NetSuite T/F flags and rejects bad ids", () => {
    expect(
      UserBundle.schema.parse({ ...validUser, isinactive: "T" }),
    ).toMatchObject({ isinactive: true });
    expect(() =>
      UserBundle.schema.parse({ ...validUser, id: -1 }),
    ).toThrow();
  });
});
