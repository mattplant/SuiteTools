// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file baseSchema.ts
 * @description
 * Minimal schema contract exposed to adapters.
 * Keeps frontend Zod-free while still allowing runtime validation.
 * Optional fields must be omitted when undefined to satisfy exactOptionalPropertyTypes.
 */

export interface BaseSchema<T> {
  parse: (input: unknown) => {
    data: T;
    status?: number;
    message?: string;
  };
}
