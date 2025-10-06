// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file errors/base/index.ts
 * @description
 * Barrel for base error classes.
 *
 * Curates and re‑exports the abstract {@link SuiteError} base class,
 * which provides the common contract for all SuiteTools errors.
 *
 * Consumers should import from this file rather than deep paths.
 */

export * from "./SuiteError";
