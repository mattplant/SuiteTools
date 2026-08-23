// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Root of the SuiteTools error taxonomy.
 *
 * @fileoverview
 * Every thrown SuiteTools error extends this class, which is what lets callers catch one type
 * and still read a stable `code` and `severity`. Seven modules under `errors/` import it
 * directly, plus the `base` barrel, and it ships through the `/errors` subpath that backend
 * NetSuite scripts rely on.
 *
 * @remarks
 * `code` and `severity` are abstract on purpose: a subclass that forgets them fails to compile
 * rather than producing an error nobody can classify. `name` is assigned from `new.target` so
 * it survives minification of the subclass. Changing the severity vocabulary is a breaking
 * change for anything filtering logs on it.
 *
 * @see ../../errors-entry.ts – the Zod-free subpath this ships through
 * @see ../domain/not-found.error.ts – a representative subclass
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

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
  constructor(message: string, opts?: { context?: Record<string, unknown>; cause?: unknown }) {
    // Forward cause into the native Error constructor (Node 16+)
    super(message, { cause: opts?.cause });
    this.name = new.target.name;
    this.context = opts?.context;
    this.cause = opts?.cause;

    // Ensure instanceof works across transpilation boundaries
    Object.setPrototypeOf(this, new.target.prototype);

    // Capture stack trace in V8/Node environments (no-op in NetSuite)
    const errorCtor = Error as ErrorConstructor & {
      captureStackTrace?: (targetObject: object, constructorOpt?: abstract new (...args: never[]) => unknown) => void;
    };
    if (typeof errorCtor.captureStackTrace === "function") {
      errorCtor.captureStackTrace(this, new.target);
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
      (this.context ? `Context: ${SuiteError.safeStringify(this.context, 2)}\n` : ``) +
      (this.cause ? `Cause: ${SuiteError.safeStringify(this.cause, 2)}\n` : ``) +
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
      (_key, val) => {
        if (typeof val === "object" && val !== null) {
          if (seen.has(val)) return "[Circular]";
          seen.add(val);
        }
        return val;
      },
      spaces,
    );
  }
}
