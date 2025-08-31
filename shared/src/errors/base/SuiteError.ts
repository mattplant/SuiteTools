// Abstract base class for all SuiteTools errors
export abstract class SuiteError extends Error {
  public readonly name: string;
  public readonly cause?: unknown;
  protected readonly context?: Record<string, unknown> | undefined;

  constructor(
    message: string,
    options?: { cause?: unknown; context?: Record<string, unknown> }
  ) {
    super(message);
    this.name = new.target.name;
    this.cause = options?.cause;
    this.context = options?.context;
  }

  /**
   * Produces a detailed, human‑readable string representation
   * that includes any structured context and cause.
   */
  public toString(): string {
    // NetSuite console.log will use this return value automatically
    return (
      `${this.name}: ${this.message}\n` +
      (this.context
        ? `Context: ${JSON.stringify(this.context, null, 2)}\n`
        : ``) +
      (this.cause ? `Cause: ${JSON.stringify(this.cause, null, 2)}\n` : ``) +
      (this.stack ?? ``)
    );
  }

  /**
   * Safe JSON.stringify that won't blow up on circular references.
   */
  private static safeStringify(value: unknown, spaces = 0): string {
    const seen = new WeakSet();
    return JSON.stringify(
      value,
      (key, val) => {
        if (typeof val === "object" && val !== null) {
          if (seen.has(val)) return "[Circular]";
          seen.add(val);
        }
        return val;
      },
      spaces
    );
  }
}
