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
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { SuiteError } from "../base/SuiteError";
import { isErrorDevMode } from "./errorDevMode";

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
 *
 * @param err - The error to handle, can be any type.
 * @param opts - Optional configuration for error handling behavior.
 * @throws Always throws the normalized error after logging and optional surfacing.
 * @returns never
 */
export function handleError(err: unknown, opts: HandleErrorOpts = {}): never {
  // --- Normalize ---
  const normalized: SuiteError | NormalizedError =
    err instanceof SuiteError
      ? err
      : err instanceof Error
        ? (err as NormalizedError)
        : Object.assign(new Error(String(err), { cause: err }), { original: err });

  // --- Log ---
  const prefix = "[SuiteTools]";

  // Human‑friendly string (grep‑friendly in dev)
  console.error(`${prefix} ${normalized.toString()}`);

  // Structured log (better for telemetry/analysis)
  const isSuiteError = normalized instanceof SuiteError;
  console.error({
    code: isSuiteError ? normalized.code : "UNKNOWN",
    severity: isSuiteError ? normalized.severity : "error",
    context: isSuiteError ? normalized.context : undefined,
    stack: normalized.stack,
  });

  // --- Surface (Dev only) ---
  if (isErrorDevMode() && opts.reactTrigger) {
    opts.reactTrigger(normalized);
  }

  // --- Propagate ---
  throw normalized;
}
