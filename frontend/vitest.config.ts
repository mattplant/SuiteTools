// SPDX-License-Identifier: GPL-3.0-or-later

import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { shared: path.resolve(import.meta.dirname, "../shared/src") } },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
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
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.d.ts",
        // Bootstrap, not logic: it mounts the tree into a DOM that only exists in NetSuite.
        "src/main.tsx",
      ],
      // Explicit because of the `shared` alias above: it resolves into ../shared/src, which
      // `shared`'s own suite already measures. The `include` glob keeps those files out
      // today; this is what keeps them out if that glob is ever broadened.
      allowExternal: false,
    },
  },
});
