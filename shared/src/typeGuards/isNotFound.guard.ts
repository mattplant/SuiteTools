import type { NotFound } from "../schema/api/notFound";

/**
 * Runtime check for a NotFound payload.
 */
export const isNotFound = <T>(
  data: T | { message: string; code: "NOT_FOUND" }
): data is { message: string; code: "NOT_FOUND" } =>
  (data as any)?.code === "NOT_FOUND";
