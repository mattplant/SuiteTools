// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from "vitest";
import { requestResponse } from "../api/requestResponse";
import { FileBundle } from "./file";
import { JobBundle } from "./job";
import { JobRunBundle, jobRunOrNotFoundSchema } from "./jobRun";
import { LoginBundle } from "./login";
import { RoleBundle } from "./role";
import { ScriptBundle } from "./script";
import { ScriptLogBundle } from "./scriptLog";
import { SettingsSchema } from "./settings";

describe("requestResponse envelope", () => {
  it("accepts a valid success envelope", () => {
    const parsed = requestResponse.parse({ status: 200, data: { ok: true }, message: "ok" });
    expect(parsed).toEqual({ status: 200, data: { ok: true }, message: "ok" });
  });

  it("rejects invalid status codes", () => {
    expect(() => requestResponse.parse({ status: 99, data: null })).toThrow();
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
    ).toMatchObject({ id: 3, isInactive: false, name: "Administrator", centerType: "ACCOUNTCENTER" });
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
    ).toMatchObject({ id: 4, centerType: "" });
  });

  it("parses a valid job", () => {
    const job = JobBundle.schema.parse({
      id: 9,
      name: "Cleanup",
      isInactive: false,
      config: "{}",
      description: "nightly",
      scheduled: true,
      notify: false,
    });
    expect(job).toMatchObject({ id: 9, name: "Cleanup", isInactive: false, scheduled: true, notify: false });
  });

  it("coerces Job isInactive T/F flags", () => {
    expect(
      JobBundle.schema.parse({
        id: 10,
        name: "Nightly",
        isInactive: "T",
        config: "{}",
        description: "nightly",
        scheduled: "F",
        notify: "F",
      }),
    ).toMatchObject({ id: 10, isInactive: true, scheduled: false, notify: false });
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
    ).toMatchObject({ id: 100, scriptType: "SCHEDULED", scriptName: "Nightly Cleanup (12)", title: "Failed" });
  });

  it("parses a valid file", () => {
    expect(
      FileBundle.schema.parse({
        id: 5,
        folder: 1,
        dateCreated: "2026-08-05T12:00:00.000Z",
        lastModifiedDate: "2026-08-05T13:00:00.000Z",
        fileTypeName: "PLAINTEXT",
        name: "readme.txt (5)",
        fileSize: 128,
        description: null,
        url: null,
      }),
    ).toMatchObject({ id: 5, fileTypeName: "PLAINTEXT", fileSize: 128, description: "", url: "" });
  });

  it("coerces null File SuiteQL string fields to empty string", () => {
    expect(
      FileBundle.schema.parse({
        id: 6,
        folder: "2",
        dateCreated: "2026-08-05 12:00:00",
        lastModifiedDate: "2026-08-05 13:00:00",
        fileTypeName: null,
        name: null,
        fileSize: "256",
        description: null,
        url: null,
      }),
    ).toMatchObject({ id: 6, folder: 2, fileTypeName: "", name: "", fileSize: 256, description: "", url: "" });
  });

  it("coerces null ScriptLog SuiteQL string fields to empty string", () => {
    expect(
      ScriptLogBundle.schema.parse({
        id: 101,
        timestamp: "2026-08-05T12:00:00.000Z",
        type: "ERROR",
        scriptType: null,
        owner: null,
        scriptName: null,
        title: null,
        detail: null,
      }),
    ).toMatchObject({ id: 101, type: "ERROR", scriptType: "", owner: "", scriptName: "", title: "", detail: null });
  });

  it("parses a valid login", () => {
    expect(
      LoginBundle.schema.parse({
        id: 1,
        date: "2026-08-05 12:00:00",
        status: "Success",
        oauthAppName: "SuiteCloud IDE & CLI",
        oauthAccessTokenName: "token-1",
        user: 7,
        userName: "Ada Lovelace",
        role: 3,
        roleName: "Administrator",
        emailAddress: "a@example.com",
        ipAddress: "1.2.3.4",
        requestUri: "/app/center/card.nl",
        detail: null,
        secChallenge: "",
        userAgent: "Mozilla",
      }),
    ).toMatchObject({
      id: 1,
      oauthAppName: "SuiteCloud IDE & CLI",
      userName: "Ada Lovelace",
      roleName: "Administrator",
      emailAddress: "a@example.com",
    });
  });

  it("coerces null Login SuiteQL string fields to empty string", () => {
    expect(
      LoginBundle.schema.parse({
        id: 2,
        date: "2026-08-05 12:00:00",
        status: "Failure",
        oauthAppName: null,
        oauthAccessTokenName: null,
        userName: null,
        roleName: null,
        emailAddress: null,
        ipAddress: null,
        requestUri: null,
        secChallenge: null,
        userAgent: null,
      }),
    ).toMatchObject({
      id: 2,
      oauthAppName: "",
      oauthAccessTokenName: "",
      userName: "",
      roleName: "",
      emailAddress: "",
      ipAddress: "",
      requestUri: "",
      secChallenge: "",
      userAgent: "",
    });
  });

  it("parses a valid job run", () => {
    expect(
      JobRunBundle.schema.parse({
        id: 9,
        created: "2026-08-05T12:00:00.000Z",
        jobId: 3,
        jobName: "Cleanup",
        completed: "T",
        results: "ok",
      }),
    ).toMatchObject({ id: 9, jobId: 3, jobName: "Cleanup", completed: true });
  });

  it("coerces null JobRun jobName on camelCase wire keys", () => {
    expect(
      jobRunOrNotFoundSchema.parse({
        id: 10,
        created: "2026-08-05T12:00:00.000Z",
        jobId: "4",
        jobName: null,
        completed: "F",
        results: null,
      }),
    ).toMatchObject({ id: 10, jobId: 4, jobName: "", completed: false });
  });

  it("rejects legacy flat JobRun keys", () => {
    expect(() =>
      jobRunOrNotFoundSchema.parse({
        id: 10,
        created: "2026-08-05T12:00:00.000Z",
        jobid: "4",
        jobname: "Cleanup",
        completed: "F",
        results: null,
      }),
    ).toThrow();
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
