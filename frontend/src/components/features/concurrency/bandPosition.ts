// SPDX-License-Identifier: GPL-3.0-or-later

import type * as d3 from "d3";

/**
 * Position of `value` on a d3 band scale.
 *
 * `scaleBand()` is typed to return `number | undefined` because a lookup outside the
 * domain has no position. Every chart here builds the scale's domain from the same array
 * it then looks up, so a miss is unreachable — this exists to keep the type honest
 * without a non-null assertion, not to paper over a real `undefined`.
 */
export function bandPosition(scale: d3.ScaleBand<string>, value: string): number {
  return scale(value) ?? 0;
}
