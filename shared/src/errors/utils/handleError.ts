// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file handleError.ts
 * @description
 * Centralized error normalization, logging, and propagation for SuiteTools.
 *
 * **Error Lifecycle** (SPA, CLI, backend):
 * `throw` → `normalize` → `log` → (dev) surface to React → `rethrow`
 *
 * Architectural notes:
 * - Guarantees all thrown values become a {@link NormalizedError}.
 * - Logs with a `[SuiteTools]` prefix for grep‑friendly output.
 * - In dev mode, can surface errors to React boundaries/overlays via `reactTrigger`.
 * - Always rethrows to preserve upstream propagation.
 *
 * @see:
 * - {@link NormalizedError} for the thrown type.
 * - {@link https://github.com/mattplant/SuiteTools/blob/main/docs/errors.md Error Lifecycle docs}
 *   for full details.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://github.com/mattplant/SuiteTools/blob/main/LICENSE>
 */

import { SuiteError } from "../base/SuiteError";

/**
 * Represents an Error that has been normalized by {@link handleError}.
 * Always extends the built-in Error shape, and may carry the original
 * thrown value for debugging or inspection.
 */
export interface NormalizedError extends Error {
  /** The original thrown value, if it was not already an Error. */
  original?: unknown;
}

/**
 * Options for {@link handleError}.
 */
type HandleErrorOpts = {
  /** Called in dev mode to surface errors into React boundaries/overlays */
  reactTrigger?: (err: Error) => void;
};

/**
 * Normalize, log, optionally surface (dev‑only), and rethrow any thrown value.

 * ## Usage
 * Call `handleError()` in `catch` blocks for async flows or promise rejections
 * where you want:
 *   1. Rich, consistent console output
 *   2. Optional dev‑only UI surfacing
 *   3. Guaranteed rethrow for upstream handling
 *
 * ## Thrown Type
 * Always throws a {@link NormalizedError}, which extends `Error` and may include
 * an `original` property containing the raw thrown value (if it was not already an `Error`).
 * This allows upstream handlers to inspect the original value without unsafe casting.
 *
 * @param err - The error to handle, can be any type.
 * @param [opts] - Optional configuration for error handling behavior.
 * @param [opts.reactTrigger] - In dev mode, a callback to trigger React error overlays/boundaries.
 * @throws Always throws the normalized error after logging and optional surfacing.
 *
 * @example
 * try {
 *   await doSomethingAsync();
 * } catch (err) {
 *   handleError(err, { reactTrigger: triggerOverlay });
 * }
 */
export function handleError(err: unknown, opts: HandleErrorOpts = {}): never {
  const isDev = true; // TODO: replace with env/config getter

  // Normalize to a NormalizedError and attach original value for unknown types (non-Error)
  const normalized: NormalizedError =
    err instanceof Error
      ? (err as NormalizedError)
      : Object.assign(new Error(String(err), { cause: err }), {
          original: err,
        });
  if (!(err instanceof Error)) {
    (normalized as any).original = err;
  }

  // Log with consistent prefix
  if (normalized instanceof SuiteError) {
    console.error(`[SuiteTools] ${normalized.toString()}`);
  } else {
    console.error(
      `[SuiteTools] ${normalized.name}: ${normalized.message}`,
      normalized.stack
    );
  }
  // TODO: should SuiteErrors also include stack traces?

  // Dev-mode React overlay trigger
  if (isDev && opts.reactTrigger) {
    opts.reactTrigger(normalized);
  }

  throw normalized;
}
