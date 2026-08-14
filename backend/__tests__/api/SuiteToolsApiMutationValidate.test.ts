// SPDX-License-Identifier: GPL-3.0-or-later

import { SchemaValidationError } from "@suiteworks/suitetools-shared/errors";
import { validateMutationResponse } from "../../TypeScripts/SuiteTools/api/SuiteToolsApiMutationValidate";

describe("validateMutationResponse", () => {
  it("accepts a valid post initiateJob ack envelope", () => {
    const response = validateMutationResponse("post", "initiateJob", {
      status: 200,
      data: {},
      message: "InitiateJob() initiated with with id of 1",
    });
    expect(response).toEqual({ status: 200, data: {}, message: "InitiateJob() initiated with with id of 1" });
  });

  it("accepts a valid put settings ack envelope", () => {
    const response = validateMutationResponse("put", "settings", {
      status: 200,
      data: {},
      message: "Settings updated",
    });
    expect(response.status).toBe(200);
    expect(response.message).toBe("Settings updated");
  });

  it("throws SchemaValidationError for a broken envelope", () => {
    expect(() => validateMutationResponse("put", "settings", { status: 99, data: null })).toThrow(
      SchemaValidationError,
    );
  });
});
