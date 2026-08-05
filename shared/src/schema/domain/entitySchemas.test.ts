// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from "vitest";
import { requestResponse } from "../api/requestResponse";
import { JobBundle } from "./job";
import { RoleBundle } from "./role";
import { SettingsSchema } from "./settings";

describe("requestResponse envelope", () => {
  it("accepts a valid success envelope", () => {
    const parsed = requestResponse.parse({
      status: 200,
      data: { ok: true },
      message: "ok",
    });
    expect(parsed).toEqual({
      status: 200,
      data: { ok: true },
      message: "ok",
    });
  });

  it("rejects invalid status codes", () => {
    expect(() =>
      requestResponse.parse({ status: 99, data: null }),
    ).toThrow();
  });
});

describe("RoleBundle / JobBundle schemas", () => {
  it("parses a valid role", () => {
    expect(
      RoleBundle.schema.parse({
        id: 3,
        isinactive: "F",
        name: "Administrator",
        centertype: "ACCOUNTCENTER",
        issalesrole: "F",
        issupportrole: "F",
        iswebserviceonlyrole: "F",
      }),
    ).toMatchObject({
      id: 3,
      isinactive: false,
      name: "Administrator",
      centertype: "ACCOUNTCENTER",
    });
  });

  it("parses a valid job", () => {
    const job = JobBundle.schema.parse({
      id: 9,
      name: "Cleanup",
      isinactive: false,
      config: "{}",
      description: "nightly",
      scheduled: true,
      notify: false,
    });
    expect(job).toMatchObject({
      id: 9,
      name: "Cleanup",
      scheduled: true,
      notify: false,
    });
  });
});

describe("SettingsSchema", () => {
  it("parses a minimal settings payload", () => {
    const settings = SettingsSchema.parse({
      cssUrl: "",
      jsUrl: "",
      devMode: true,
      notifyEmail: "",
      accountId: "TSTDRV123",
      envType: "SANDBOX",
      version: "1.0.0",
      processorCount: "2",
      queueCount: "1",
      appBundle: "",
      userId: "7",
      userName: "Ada",
      userEmail: "a@example.com",
      userLocation: "1",
      userDepartment: "2",
      userRole: "Administrator",
      userRoleId: "3",
      userSubsidiary: "1",
      isAdmin: true,
    });
    expect(settings.devMode).toBe(true);
    expect(settings.userId).toBe(7);
    expect(settings.processorCount).toBe(2);
  });
});
