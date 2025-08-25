import { SuiteToolsError } from "../base";

export class NotFoundError extends SuiteToolsError {
  constructor(
    public readonly resource: string,
    public readonly id: string | number
  ) {
    super(`${resource} with ID "${id}" was not found.`);
  }
}
