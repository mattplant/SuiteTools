// SPDX-License-Identifier: GPL-3.0-or-later

import { SchemaValidationError } from "@suiteworks/suitetools-shared/errors";
import {
  GET_PAYLOAD_VALIDATED_ENDPOINTS,
  validateGetResponse,
} from "../../TypeScripts/SuiteTools/api/SuiteToolsApiGetValidate";

describe("validateGetResponse", () => {
  it("exports the incremental payload-validated endpoint list", () => {
    expect(GET_PAYLOAD_VALIDATED_ENDPOINTS).toEqual(
      expect.arrayContaining([
        "settings",
        "user",
        "users",
        "role",
        "roles",
        "job",
        "jobs",
        "file",
        "files",
        "script",
        "scripts",
        "scriptLog",
        "scriptLogs",
        "jobRun",
        "jobRuns",
        "logins",
        "token",
        "tokens",
      ]),
    );
  });

  it("accepts a valid envelope for an unvalidated endpoint", () => {
    const response = validateGetResponse("optionValues", {
      status: 200,
      data: [{ value: "1", text: "PDF" }],
      message: "ok",
    });
    expect(response).toEqual({
      status: 200,
      data: [{ value: "1", text: "PDF" }],
      message: "ok",
    });
  });

  it("rejects a broken envelope", () => {
    expect(() =>
      validateGetResponse("optionValues", { status: 99, data: null }),
    ).toThrow(SchemaValidationError);
  });

  it("validates a settings payload", () => {
    const data = {
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
    };
    const response = validateGetResponse("settings", { status: 200, data });
    expect(response.status).toBe(200);
    expect(response.data).toMatchObject({
      devMode: true,
      userId: 7,
      processorCount: 2,
    });
  });

  it("skips entity validation for legacy empty-object soft misses", () => {
    const response = validateGetResponse("user", { status: 200, data: {} });
    expect(response).toEqual({ status: 200, data: {} });
  });

  it("throws SchemaValidationError for an invalid user payload", () => {
    expect(() =>
      validateGetResponse("user", {
        status: 200,
        data: {
          id: -1,
          isInactive: false,
          email: "a@example.com",
          name: "Ada",
          title: "Engineer",
        },
      }),
    ).toThrow(SchemaValidationError);
  });

  it("validates a jobRuns list payload", () => {
    const response = validateGetResponse("jobRuns", {
      status: 200,
      data: [
        {
          id: 9,
          created: "2026-08-05T12:00:00.000Z",
          jobId: 3,
          jobName: "Cleanup",
          completed: "T",
          results: "ok",
        },
      ],
    });
    expect(response.status).toBe(200);
    expect(response.data).toEqual([
      expect.objectContaining({
        id: 9,
        jobId: 3,
        jobName: "Cleanup",
        completed: true,
      }),
    ]);
  });

  it("throws SchemaValidationError for an invalid jobRuns payload", () => {
    expect(() =>
      validateGetResponse("jobRuns", {
        status: 200,
        data: [{ id: 9, created: "not-a-date" }],
      }),
    ).toThrow(SchemaValidationError);
  });
});
