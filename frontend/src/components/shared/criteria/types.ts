// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The criteria vocabulary every search screen and adapter shares.
 *
 * @fileoverview
 * `CriteriaFields` is the widest-reaching type in the frontend — 43 modules outside this
 * directory reference it. It is the single shape a search form fills in, a criteria component
 * registers against, and an API adapter whitelists from, which is what keeps those three
 * layers agreeing without a translation step.
 *
 * @remarks
 * Every field is optional by design: a submitted form returns only the controls that screen
 * rendered, so a partial object is the normal case, not an error. Adding a field here does not
 * make it reach the API — `pickCriteria` whitelists per adapter, so a new field is inert until
 * that adapter names it. `OptionValuesTypes` must stay in step with the server's option-value
 * endpoints.
 *
 * @see ../../../adapters/api/adapterUtils.ts – the pickCriteria whitelist
 * @see ./RecordCriteriaForm.tsx – the form shell these fields are registered into
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

export type CriteriaFields = {
  active?: string;
  completed?: string;
  dateCreated?: string;
  detail?: string;
  files?: string[];
  fileTypes?: string[];
  integrations?: string[];
  integrationName?: string;
  job?: string;
  lastModifiedDate?: string;
  levels?: string[];
  owners?: string[];
  roleName?: string;
  roles?: string[];
  rows?: number;
  scriptNames?: string[];
  scriptTypes?: string[];
  title?: string;
  tokenName?: string;
  userName?: string;
  users?: string[];
  versions?: string[];
  // fields for advanced time picker
  timeMode?: string; // 'now' or 'custom'
  /** SuiteQL-friendly `YYYY-MM-DD HH24:MI:SS` (local wall clock), set by advanced time picker */
  customDateTime?: string | undefined;
  /** Lookback window in minutes (`1`, `15`, `60`, `1440`, …) */
  customDuration?: string;
};

export interface OptionValues {
  value: string;
  text: string;
}

// the option values types that we get from the server
export enum OptionValuesTypes {
  FILE = "file",
  FILETYPE = "fileType",
  INTEGRATION = "integration",
  JOB = "job",
  OWNER = "owner",
  ROLE = "role",
  SCRIPT = "script",
  SCRIPTTYPE = "scriptType",
  USER = "user",
}
