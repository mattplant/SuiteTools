// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * SuiteTools Dates Library — native `Date` formatters for concurrency / APM views.
 * No moment.js / dayjs / date-fns dependency — keep formatting local and tiny.
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
