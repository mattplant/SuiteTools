import { isNotFound } from "../../../typeGuards/isNotFound.guard";
import type { NotFound } from "../notFound";

/**
 * Converts a `T[] | NotFound` result into a plain `T[]`.
 * Always returns an array, empty if `NotFound`.
 */
export function toArray<T>(res: readonly T[] | NotFound): T[] {
  return isNotFound(res) ? [] : [...res];
}
