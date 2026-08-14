// SPDX-License-Identifier: GPL-3.0-or-later

import { describe, expect, it } from "vitest";
import type { Integration } from "@suiteworks/suitetools-shared";
import { SYNTHETIC_INTEGRATION_ID_MIN, adaptIntegration, isSyntheticIntegrationId } from "./integrationAdapt";

function baseIntegration(overrides: Partial<Integration> = {}): Integration {
  return {
    id: 42,
    name: "Example",
    applicationId: "app",
    state: "ENABLED",
    dateCreated: "2024-01-01",
    ...overrides,
  } as Integration;
}

describe("isSyntheticIntegrationId", () => {
  it("treats ids at or above the threshold as synthetic", () => {
    expect(isSyntheticIntegrationId(SYNTHETIC_INTEGRATION_ID_MIN)).toBe(true);
    expect(isSyntheticIntegrationId(SYNTHETIC_INTEGRATION_ID_MIN + 1)).toBe(true);
    expect(isSyntheticIntegrationId(SYNTHETIC_INTEGRATION_ID_MIN - 1)).toBe(false);
  });
});

describe("adaptIntegration", () => {
  it("adds NetSuite and detail URLs for real ids", () => {
    expect(adaptIntegration(baseIntegration({ id: 7 }))).toMatchObject({
      id: 7,
      urlNs: "/app/common/integration/integrapp.nl?id=7",
      urlDetail: "#/integration/7",
    });
  });

  it("preserves an existing urlNs for real ids", () => {
    expect(adaptIntegration(baseIntegration({ id: 7, urlNs: "/custom/ns/url" })).urlNs).toBe("/custom/ns/url");
  });

  it("does not invent integrapp.nl links for synthetic ids", () => {
    const adapted = adaptIntegration(baseIntegration({ id: SYNTHETIC_INTEGRATION_ID_MIN, urlNs: undefined }));
    expect(adapted.urlNs).toBeUndefined();
    expect(adapted.urlDetail).toBeUndefined();
  });
});
