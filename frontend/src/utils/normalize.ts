/**
 * SuiteTools Normalize Library
 *
 * This library validates and coerces raw input into a consistent shape.
 *
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 *
 * Copyright (C) 2025  Matthew Plant
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
 * Normalizes and validates an array response.
 *
 * Attempts to assert that the provided data is an array of type `T` using the given assertion function.
 * If the assertion passes, returns the data as an array of type `T`. If the assertion fails, logs the error and returns an empty array.
 *
 * @typeParam T - The expected type of array elements.
 * @param data - The raw data to normalize.
 * @param assertIsArrayofT - A type assertion function that verifies the data is an array of type `T`.
 * @returns An array of type `T` if validation succeeds, otherwise an empty array.
 */
export function normalizeArrayResponse<T>(
  data: unknown,
  assertIsArrayofT: (value: unknown) => asserts value is T[],
): T[] {
  try {
    assertIsArrayofT(data);
    return data as T[];
  } catch (error) {
    console.error('normalizeArrayResponse() error:', error);
    return [];
  }
}

/**
 * Normalizes a single record response.
 *
 * Attempts to assert that the provided data is of type `T` using the given assertion function.
 * If the assertion passes, returns the data as type `T`. If the assertion fails, logs the error and returns null.
 *
 * @typeParam T - The expected type of the record.
 * @param data - The raw data to normalize.
 * @param assertIsT - A type assertion function that verifies the data is of type `T`.
 * @returns An object of type `T` if validation succeeds, otherwise null.
 */
export function normalizeSingleRecord<T>(data: unknown, assertIsT: (value: unknown) => asserts value is T): T {
  try {
    assertIsT(data);
    return data as T;
  } catch (error) {
    console.error('normalizeSingleRecord() error:', error);
    return null as T;
  }
}
