import { SuiteToolsError } from "../base";

export class SchemaValidationError extends SuiteToolsError {
  constructor(
    public readonly schema: string,
    public readonly issues: string[]
  ) {
    super(`Response did not match ${schema} schema.`);
  }
}
