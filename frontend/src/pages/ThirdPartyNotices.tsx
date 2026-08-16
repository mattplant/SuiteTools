// SPDX-License-Identifier: GPL-3.0-or-later

// The generated compliance artifact lives at the repository root, outside frontend/.
// Importing it with ?raw inlines it into app-bundle.js at build time. Changing a dependency
// already forces a frontend rebuild, so the notices cannot drift from the shipped bundle --
// which a runtime fetch from the File Cabinet would reintroduce.
import thirdPartyNotices from "../../../THIRD_PARTY_NOTICES.md?raw";

/**
 * ThirdPartyNotices component displays the generated per-package third-party compliance record.
 * @returns The rendered ThirdPartyNotices component.
 */
export function ThirdPartyNotices(): React.ReactElement {
  return (
    <div className="p-4">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-2xl text-slate-900">THIRD-PARTY NOTICES</h1>
        <p className="text-slate-600 mt-2 text-sm">
          <a className="underline hover:text-slate-900" href="#/licenses">
            SuiteTools is licensed under GPL-3.0-or-later
          </a>
        </p>
        <pre className="text-slate-600 mt-4 text-left whitespace-pre-wrap">{thirdPartyNotices}</pre>
      </div>
    </div>
  );
}
