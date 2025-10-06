// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file Root barrel for @suiteworks/suitetools-shared
 * @description
 * Exposes curated exports from domain, schema, errors, typeGuards, and api.
 * Each sub-barrel is responsible for curating its own public surface.
 *
 * Example usage:
 *   import { NotFound, NotFoundBundle, toArray, orNotFoundSchema, isNotFound }
 *     from "@suiteworks/suitetools-shared";
 */

// -------------------- Domain primitives --------------------
export * from "./domain";

// -------------------- Schema layer --------------------
export * from "./schema";

// -------------------- Type guards --------------------
export * from "./typeGuards";

// -------------------- Errors --------------------
export * from "./errors";

// -------------------- API --------------------
export * from "./api";
