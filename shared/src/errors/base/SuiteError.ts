// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Abstract base class for all SuiteTools errors.
 *
 * Provides a consistent error contract across the system:
 * - `name`: always set to the subclass name
 * - `message`: human‑readable description of the error
 * - `cause`: optional underlying error or value (aligned with standard ErrorOptions)
 * - `context`: optional structured metadata for debugging or logging
 *
 * Subclasses should extend this class to ensure uniform error handling,
 * serialization, and logging behavior.
 *
 * @example
 * class NotFoundError extends SuiteError {
 *   constructor(resource: string, id: string) {
 *     super(`${resource} with ID ${id} was not found`, { context: { resource, id } });
 *   }
 * }
 */
export abstract class SuiteError extends Error {
  /** The error class name, automatically set to the subclass name. */
  public readonly name: string;

  /**
   * Optional underlying cause of the error.
   *
   * Follows the standard {@link ErrorOptions.cause} contract,
   * allowing error chaining. Included in both `toString()` and `toJSON()`.
   */
  public readonly cause?: unknown;

  /**
   * Optional structured context for debugging.
   *
   * Attach metadata such as IDs, parameters, or environment details.
   * Included in both `toString()` and `toJSON()` for human and machine logs.
   */
  protected readonly context: Record<string, unknown> | undefined;

  /**
   * Constructs a new SuiteError.
   *
   * @param message - Human-readable error message.
   * @param options - Optional cause and structured context.
   */
  constructor(
    message: string,
    options?: ErrorOptions & { context?: Record<string, unknown> }
  ) {
    super(message, options);

    // Ensure instanceof works across transpilation boundaries
    Object.setPrototypeOf(this, new.target.prototype);

    this.name = new.target.name;
    this.context = options?.context;

    // Capture stack trace in V8/Node environments (no-op in NetSuite)
    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, new.target);
    }
  }

  /* -------------------------------------------------------------------------- */
  /* Representations                                                            */
  /* -------------------------------------------------------------------------- */

  /**
   * JSON representation including all relevant fields.
   *
   * Safe for structured logging; circular references are replaced with "[Circular]".
   *
   * @returns An object with name, message, cause, context, and stack.
   */
  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      cause: SuiteError.safeStringify(this.cause),
      context: SuiteError.safeStringify(this.context),
      stack: this.stack,
    };
  }

  /**
   * Human-readable string representation.
   *
   * Includes message, context, cause, and stack trace.
   * NetSuite `console.log` will automatically use this.
   *
   * @returns A formatted string representation of the error.
   */
  public toString(): string {
    return (
      `${this.name}: ${this.message}\n` +
      (this.context
        ? `Context: ${SuiteError.safeStringify(this.context, 2)}\n`
        : ``) +
      (this.cause
        ? `Cause: ${SuiteError.safeStringify(this.cause, 2)}\n`
        : ``) +
      (this.stack ?? ``)
    );
  }

  /**
   * Safe JSON.stringify that won't blow up on circular references.
   *
   * @param value - Value to stringify.
   * @param spaces - Indentation spaces for formatting.
   * @returns A JSON string, replacing circular references with "[Circular]".
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
