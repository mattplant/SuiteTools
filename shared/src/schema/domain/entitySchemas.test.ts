// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from "vitest";
import { requestResponse } from "../api/requestResponse";
import { JobBundle } from "./job";
import { RoleBundle } from "./role";
import { ScriptBundle } from "./script";
import { ScriptLogBundle } from "./scriptLog";
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
        isInactive: "F",
        name: "Administrator",
        centerType: "ACCOUNTCENTER",
        isSalesRole: "F",
        isSupportRole: "F",
        isWebServiceOnlyRole: "F",
      }),
    ).toMatchObject({
      id: 3,
      isInactive: false,
      name: "Administrator",
      centerType: "ACCOUNTCENTER",
    });
  });

  it("coerces null centerType to empty string", () => {
    expect(
      RoleBundle.schema.parse({
        id: 4,
        isInactive: "F",
        name: "Custom Role",
        centerType: null,
        isSalesRole: "F",
        isSupportRole: "F",
        isWebServiceOnlyRole: "F",
      }),
    ).toMatchObject({
      id: 4,
      centerType: "",
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

  it("parses a valid script", () => {
    expect(
      ScriptBundle.schema.parse({
        id: 12,
        apiVersion: "2.1",
        isInactive: "F",
        scriptType: "SCHEDULED",
        name: "Nightly Cleanup",
        scriptId: "customscript_cleanup",
        owner: "Ada (7)",
        scriptFile: "cleanup.js (99)",
        notifyEmails: "",
        description: "runs nightly",
      }),
    ).toMatchObject({
      id: 12,
      apiVersion: "2.1",
      isInactive: false,
      scriptType: "SCHEDULED",
      scriptId: "customscript_cleanup",
    });
  });

  it("parses a valid script log", () => {
    expect(
      ScriptLogBundle.schema.parse({
        id: 100,
        timestamp: "2026-08-05T12:00:00.000Z",
        type: "ERROR",
        scriptType: "SCHEDULED",
        owner: "Ada (7)",
        scriptName: "Nightly Cleanup (12)",
        title: "Failed",
        detail: "boom",
      }),
    ).toMatchObject({
      id: 100,
      scriptType: "SCHEDULED",
      scriptName: "Nightly Cleanup (12)",
      title: "Failed",
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
