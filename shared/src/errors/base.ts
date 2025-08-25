// /shared/errors/base.ts
export class SuiteToolsError extends Error {
  public readonly name: string;
  public readonly cause?: unknown;

  constructor(message: string, opts?: { cause?: unknown }) {
    super(message);
    this.name = this.constructor.name;
    this.cause = opts?.cause;
  }
}
