// SPDX-License-Identifier: GPL-3.0-or-later

import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      // `text` for the job log, `cobertura` for GitLab's MR diff annotations, `html` to read
      // locally. Vitest 4 defaults to `clover` + `json`, which nothing here consumes.
      reporter: ["text", "cobertura", "html"],
      reportOnFailure: true,
      // Vitest 4 dropped `coverage.all`: without an explicit `include`, only files a test
      // already imports are measured, and the untested majority never reaches the
      // denominator. Vitest 4 also ships an empty default `exclude`, so tests and ambient
      // declarations have to be named here or they count as source.
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/**/*.d.ts"],
    },
  },
});
