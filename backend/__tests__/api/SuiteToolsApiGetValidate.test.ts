// SPDX-License-Identifier: GPL-3.0-or-later

import { SchemaValidationError } from "@suiteworks/suitetools-shared/errors";
import {
  GET_PAYLOAD_VALIDATED_ENDPOINTS,
  validateGetResponse,
} from "../../TypeScripts/SuiteTools/api/SuiteToolsApiGetValidate";

describe("validateGetResponse", () => {
  it("exports the incremental payload-validated endpoint list", () => {
    expect(GET_PAYLOAD_VALIDATED_ENDPOINTS).toEqual(
      expect.arrayContaining(["settings", "user", "users", "role", "roles", "job", "jobs"]),
    );
  });

  it("accepts a valid envelope for an unvalidated endpoint", () => {
    const response = validateGetResponse("files", {
      status: 200,
      data: [{ id: 1 }],
      message: "ok",
    });
    expect(response).toEqual({
      status: 200,
      data: [{ id: 1 }],
      message: "ok",
    });
  });

  it("rejects a broken envelope", () => {
    expect(() =>
      validateGetResponse("files", { status: 99, data: null }),
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
          isinactive: false,
          email: "a@example.com",
          name: "Ada",
          title: "Engineer",
        },
      }),
    ).toThrow(SchemaValidationError);
  });
});
