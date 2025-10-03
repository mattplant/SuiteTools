// SPDX-License-Identifier: GPL-3.0-or-later

// shared/src/amd-globals.d.ts
declare function define(
  moduleName: string,
  deps: string[],
  factory: (...args: any[]) => void
): void;
