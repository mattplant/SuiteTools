// Runtime: required for instanceof checks in backend or anywhere Zod is actually present
export { ZodError } from "zod";

// Type-only: safe to import anywhere (frontend, backend)
// TODO: replace with following: export type { $ZodIssue as ZodIssue } from "@zod/core";
export type { ZodIssue } from "zod";
