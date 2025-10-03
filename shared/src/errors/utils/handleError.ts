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
 *
 * @param err - The error to handle, can be any type.
 * @param opts - Optional configuration for error handling behavior.
 * @throws Always throws the normalized error after logging and optional surfacing.
 * @returns never
 */
export function handleError(err: unknown, opts: HandleErrorOpts = {}): never {
  const isDev = true; // TODO: adapt for NetSuite env (config getter)

  // --- Normalize ---
  let normalized: SuiteError | NormalizedError;
  if (err instanceof SuiteError) {
    normalized = err;
  } else if (err instanceof Error) {
    normalized = err as NormalizedError;
  } else {
    normalized = Object.assign(new Error(String(err), { cause: err }), {
      original: err,
    });
  }

  // --- Log ---
  const prefix = "[SuiteTools]";

  // Human‑friendly string (grep‑friendly in dev)
  console.error(`${prefix} ${normalized.toString()}`);

  // Structured log (better for telemetry/analysis)
  console.error({
    code: (normalized as any).code ?? "UNKNOWN",
    severity: (normalized as any).severity ?? "error",
    context: (normalized as any).context,
    stack: normalized.stack,
  });

  // --- Surface (Dev only) ---
  if (isDev && opts.reactTrigger) {
    opts.reactTrigger(normalized);
  }

  // --- Propagate ---
  throw normalized;
}
