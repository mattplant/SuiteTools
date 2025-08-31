import { SuiteError } from "../base";

export class NetSuiteApiError extends SuiteError {
  public readonly service = "NetSuite";
  public readonly endpoint: string;
  public readonly status: number | undefined;
  public readonly code?: string | undefined;

  constructor(
    message: string,
    opts: { endpoint: string; status?: number; code?: string; cause?: unknown }
  ) {
    super(message, { cause: opts?.cause });
    this.endpoint = opts.endpoint;
    this.status = opts.status;
    this.code = opts.code;
  }
}
