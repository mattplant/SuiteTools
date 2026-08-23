// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * Date formatters for the concurrency and APM views.
 *
 * @fileoverview
 * Two formatters over the native `Date`, deliberately without moment/dayjs/date-fns. These
 * views render many timestamps per chart, and the formatting they need is narrow enough that a
 * date library would be pure bundle weight in a FileCabinet-served app.
 *
 * @remarks
 * Formats in local wall-clock time, matching what NetSuite's APM screens show — do not switch
 * to UTC without checking the concurrency charts, whose axes assume account-local hours.
 * Keeping this dependency-free is the point; reach for a library only if genuine timezone
 * arithmetic is ever needed.
 *
 * @see ./concurrency.ts – the main consumer
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value);
}

/**
 * Format a timestamp as `YYYY-MM-DD HH:mm:ss` (local time).
 * @param date - Milliseconds since epoch.
 * @returns Formatted date-time string.
 */
export function formatDate(date: number): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  const hour = pad2(d.getHours());
  const minute = pad2(d.getMinutes());
  const second = pad2(d.getSeconds());
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

/**
 * Format a timestamp as `mm:ss` (local time).
 * @param date - Milliseconds since epoch.
 * @returns Formatted minute:second string.
 */
export function formatMinuteSecond(date: number): string {
  const d = new Date(date);
  return `${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}
