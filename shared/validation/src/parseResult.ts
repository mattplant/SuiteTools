import { ZodError } from "zod";

export type ParseResult<T> =
  | { valid: true; data: T }
  | { valid: false; issues: ZodError<T>["issues"] };
