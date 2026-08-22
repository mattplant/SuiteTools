// SPDX-License-Identifier: GPL-3.0-or-later

/**
 * The one per-entity table behind the shared results grid and detail modal.
 *
 * @fileoverview
 * Maps each `ResultsTypes` member to its modal title, feature grid, and bundle-asserting detail
 * renderer. Replaces four hand-matched lists (the `resultsMap`, the `modalTitles` record, and the
 * `ResultsModal` switch) that previously had to be edited in lockstep.
 *
 * @remarks
 * `ResultsTypes` is the only part of this directory with callers outside it; the registry and its
 * consumers are private implementation. Keyed as `Record<ResultsTypes, …>` so a missing entity is
 * a compile error — do not widen the key to `string`, which is what previously forced the runtime
 * fallbacks in `DynamicResultsRenderer` and `ResultsModal`.
 *
 * @see docs/guides/add-an-entity.md – adding an entity is one row here plus an enum member
 * @copyright Matthew Plant <i@idev.systems>
 * @license GPL-3.0-or-later
 * See the LICENSE file at <https://gitlab.com/idev-systems/labs/SuiteTools/-/blob/main/LICENSE>
 */

import {
  FileBundle,
  IntegrationBundle,
  JobBundle,
  JobRunBundle,
  LoginBundle,
  RoleBundle,
  ScriptBundle,
  ScriptLogBundle,
  SoapLogBundle,
  TokenBundle,
  UserBundle,
} from "@suiteworks/suitetools-shared";
import { FileResult as FileDetail } from "../../features/file/RecordResult";
import { RecordResults as FileGrid } from "../../features/file/RecordResults";
import { IntegrationResult as IntegrationDetail } from "../../features/integration/RecordResult";
import { RecordResults as IntegrationGrid } from "../../features/integration/RecordResults";
import { JobResult as JobDetail } from "../../features/job/RecordResult";
import { RecordResults as JobGrid } from "../../features/job/RecordResults";
import { JobRunResult as JobRunDetail } from "../../features/job/run/RecordResult";
import { RecordResults as JobRunGrid } from "../../features/job/run/RecordResults";
import { LoginResult as LoginDetail } from "../../features/login/RecordResult";
import { RecordResults as LoginGrid } from "../../features/login/RecordResults";
import { RoleResult as RoleDetail } from "../../features/role/RecordResult";
import { RecordResults as RoleGrid } from "../../features/role/RecordResults";
import { ScriptResult as ScriptDetail } from "../../features/script/RecordResult";
import { RecordResults as ScriptGrid } from "../../features/script/RecordResults";
import { ScriptLogResult as ScriptLogDetail } from "../../features/scriptLog/RecordResult";
import { RecordResults as ScriptLogGrid } from "../../features/scriptLog/RecordResults";
import { SoapLogResult as SoapLogDetail } from "../../features/soapLog/RecordResult";
import { RecordResults as SoapLogGrid } from "../../features/soapLog/RecordResults";
import { TokenResult as TokenDetail } from "../../features/token/RecordResult";
import { RecordResults as TokenGrid } from "../../features/token/RecordResults";
import { UserResult as UserDetail } from "../../features/user/RecordResult";
import { RecordResults as UserGrid } from "../../features/user/RecordResults";
import { ResultsTypes, type ResultsProps } from "./types";

/**
 * Renders one entity's detail view from an unvalidated modal payload. The bundle assertion happens
 * inside, which is what lets entries of eleven different entity types sit in one uniform table.
 */
type DetailRenderer = (data: unknown) => React.JSX.Element;

/** Everything the shared results machinery needs to know about one entity type. */
type ResultsEntry = {
  /** Heading shown above the detail modal. */
  title: string;
  /** Feature grid — asserts its own rows and renders the shared `ResultsGrid`. */
  Grid: React.FC<ResultsProps>;
  /** Bundle-asserting detail renderer, built by {@link detail}. */
  renderDetail: DetailRenderer;
};

/**
 * Pairs a bundle with the detail component that consumes its type, erasing the entity type so the
 * result can sit in a homogeneous table.
 *
 * `assert` rather than `parse` is deliberate: `Job` and `SoapLog` normalize on parse, so `parse`
 * would hand those two components a different value than they receive today.
 *
 * `LoginDetail` declines the `modal` prop — it is the one entity with no detail route and no
 * `urlNs` / `urlDetail` from the backend, so it has no navigation actions to gate. Passing it
 * anyway typechecks (a component accepting fewer props satisfies the wider signature) and the
 * prop is ignored, so the registry does not need a special case for it.
 * @param bundle - The entity bundle whose `assert` narrows the payload.
 * @param Component - The feature detail component for that entity.
 * @returns A renderer that validates, then renders.
 */
function detail<T>(
  bundle: { assert: (input: unknown) => asserts input is T },
  Component: React.ComponentType<{ data: T; modal?: boolean }>,
): DetailRenderer {
  return (data) => {
    bundle.assert(data);
    return <Component data={data} modal={true} />;
  };
}

/**
 * The single per-entity table. Adding an entity is one row here plus a {@link ResultsTypes} member;
 * `Record<ResultsTypes, …>` makes a missed row a compile error rather than a runtime fallback.
 */
export const resultsRegistry: Record<ResultsTypes, ResultsEntry> = {
  [ResultsTypes.FILE]: { title: "File", Grid: FileGrid, renderDetail: detail(FileBundle, FileDetail) },
  [ResultsTypes.INTEGRATION]: {
    title: "Integration",
    Grid: IntegrationGrid,
    renderDetail: detail(IntegrationBundle, IntegrationDetail),
  },
  [ResultsTypes.JOB]: { title: "Job", Grid: JobGrid, renderDetail: detail(JobBundle, JobDetail) },
  [ResultsTypes.JOBRUN]: { title: "Job Execution", Grid: JobRunGrid, renderDetail: detail(JobRunBundle, JobRunDetail) },
  [ResultsTypes.LOGIN]: { title: "Login", Grid: LoginGrid, renderDetail: detail(LoginBundle, LoginDetail) },
  [ResultsTypes.ROLE]: { title: "Role", Grid: RoleGrid, renderDetail: detail(RoleBundle, RoleDetail) },
  [ResultsTypes.SCRIPT]: { title: "Script", Grid: ScriptGrid, renderDetail: detail(ScriptBundle, ScriptDetail) },
  [ResultsTypes.SCRIPTLOG]: {
    title: "Script Log Details",
    Grid: ScriptLogGrid,
    renderDetail: detail(ScriptLogBundle, ScriptLogDetail),
  },
  [ResultsTypes.SOAPLOG]: {
    title: "SOAP Log Details",
    Grid: SoapLogGrid,
    renderDetail: detail(SoapLogBundle, SoapLogDetail),
  },
  [ResultsTypes.TOKEN]: { title: "Token", Grid: TokenGrid, renderDetail: detail(TokenBundle, TokenDetail) },
  [ResultsTypes.USER]: { title: "User", Grid: UserGrid, renderDetail: detail(UserBundle, UserDetail) },
};
