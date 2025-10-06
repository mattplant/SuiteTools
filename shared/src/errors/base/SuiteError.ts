// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Base class for all SuiteTools errors.
 * Enforces a normalized taxonomy with code, severity, and context.
 *
 * Provides a consistent error contract across the system:
 * - `name`: always set to the subclass name
 * - `code`: stable taxonomy identifier (machine‑friendly, used in logs/telemetry)
 * - `severity`: classification of impact (`info`, `warning`, `error`, `fatal`)
 * - `message`: human‑readable, developer‑facing description
 * - `context`: optional structured metadata for debugging or logging
 * - `cause`: optional underlying error or value (aligned with standard ErrorOptions)
 *
 * Subclasses must extend this class to ensure uniform error handling,
 * serialization, and logging behavior.
 */
export abstract class SuiteError extends Error {
  /** Machine‑readable error code (e.g. "NOT_FOUND", "VALIDATION_ERROR"). */
  public abstract readonly code: string;

  /** Severity level for governance and logging. */
  public abstract readonly severity: "info" | "warning" | "error" | "fatal";

  /** Optional structured context for debugging or telemetry. */
  public readonly context: Record<string, unknown> | undefined;

  /** Optional underlying cause (native ErrorOptions.cause). */
  public readonly cause: unknown;

  /**
   * Creates a new SuiteError.
   *
   * @param message - Human-readable description of the error.
   * @param options - Optional metadata:
   *   - `context`: structured debugging info (ids, params, environment details)
   *   - `cause`: underlying error or value
   */
  constructor(
    message: string,
    opts?: { context?: Record<string, unknown>; cause?: unknown }
  ) {
    // Forward cause into the native Error constructor (Node 16+)
    super(message, { cause: opts?.cause });
    this.name = new.target.name;
    this.context = opts?.context;
    this.cause = opts?.cause;

    // Ensure instanceof works across transpilation boundaries
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture stack trace in V8/Node environments (no-op in NetSuite)
    if (typeof (Error as any).captureStackTrace === "function") {
      (Error as any).captureStackTrace(this, new.target);
    }
  }

  /**
   * JSON representation including all relevant fields.
   *
   * Safe for structured logging; circular references are replaced with "[Circular]".
   */
  public toJSON() {
    return {
      name: this.name,
      code: this.code,
      severity: this.severity,
      message: this.message,
      cause: SuiteError.safeStringify(this.cause),
      context: SuiteError.safeStringify(this.context),
      stack: this.stack,
    };
  }

  /**
   * Human-readable string representation.
   *
   * Includes code, severity, message, context, cause, and stack trace.
   * NetSuite `console.log` will automatically use this.
   */
  public toString(): string {
    return (
      `${this.name} [${this.code}] (${this.severity}): ${this.message}\n` +
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
