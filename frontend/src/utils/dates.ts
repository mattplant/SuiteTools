/**
 * SuiteTools Dates Library
 *
 * This library provides functions to support dates in SuiteTools.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * Copyright (C) 2024  Matthew Plant
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Format date object into a string with the format YYYY-MM-DD hh24:mi:ss.
 *
 * TODO replace with moment.js
 *
 * @param {Date} date - the date object to format
 * @returns {string} formattedDate - the formatted date string
 */
export function formatDate(date: number): string {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();
  let hour = '' + d.getHours();
  let minute = '' + d.getMinutes();
  let second = '' + d.getSeconds();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;
  if (hour.length < 2) hour = '0' + hour;
  if (minute.length < 2) minute = '0' + minute;
  if (second.length < 2) second = '0' + second;

  return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
}
