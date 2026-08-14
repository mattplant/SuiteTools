// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * @file API adapter for retrieving multiple User entities for SuiteTools.
 * @description
 * Fetches and validates an array of User records based on optional criteria.
 * Pattern: Schema → Adapter → View
 * @copyright Matthew Plant
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import { makeRequestResponseSchema, usersOrNotFoundSchema } from "@suiteworks/suitetools-shared";
import type { Users } from "@suiteworks/suitetools-shared";
import type { CriteriaFields } from "../../components/shared/criteria/types";
import { makeListAdapter } from "./adapterUtils";

const usersRequestResponseSchema = makeRequestResponseSchema(usersOrNotFoundSchema);

/**
 * Fetch and validate a list of `User` records using optional criteria.
 * Always returns a `Users` array, empty if none found.
 */
export const getUsers = makeListAdapter<Users[number], CriteriaFields, "active" | "roles" | "owners">(
  "users",
  usersRequestResponseSchema,
  ["active", "roles", "owners"] as const,
);
