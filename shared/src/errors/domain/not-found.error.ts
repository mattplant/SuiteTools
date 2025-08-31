import { SuiteError } from "../base";

export class NotFoundError extends SuiteError {
  constructor(
    public readonly resource: string,
    public readonly id: string | number
  ) {
    super(`${resource} with ID "${id}" was not found.`);
  }
}
