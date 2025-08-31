import type { ZodIssue } from "zod";
import { SuiteError } from "../base/SuiteError";

export class SchemaValidationError extends SuiteError {
  constructor(
    schema: string,
    public readonly issues: ZodIssue[]
  ) {
    super(`Response did not match "${schema}" schema.`, {
      cause: issues, // raw array for structured logging or programmatic inspection
      context: { schema, issues }, // human-friendly pretty-print in base class output
    });
  }
}
