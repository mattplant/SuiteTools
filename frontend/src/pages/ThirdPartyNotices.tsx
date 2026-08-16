// SPDX-License-Identifier: GPL-3.0-or-later

import { useEffect, useState } from "react";
import { useAppSettingsContext } from "../hooks/useAppSettingsContext";

/** One notice entry, as emitted by scripts/third-party-notices/to-json.mjs. */
type NoticeEntry = { packages: string[]; source: string; text: string; kind: "generated" | "override" };

type NoticesPayload = { source: string; entryCount: number; packageCount: number; entries: NoticeEntry[] };

type LoadState =
  | { status: "loading" }
  | { status: "ready"; payload: NoticesPayload }
  | { status: "error"; message: string };

/**
 * Third-party notices, fetched rather than bundled.
 *
 * The payload is derived at build time from the committed `THIRD_PARTY_NOTICES.md` and deployed
 * beside the app bundle, so it cannot drift from what ships. Inlining it instead cost ~60 KB raw
 * on every page load for a page most users never open.
 *
 * @returns the rendered notices page.
 */
export function ThirdPartyNotices(): React.ReactElement {
  const { settings } = useAppSettingsContext();
  const noticesUrl = settings?.noticesUrl;
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [query, setQuery] = useState("");

  useEffect(() => {
    // Settings arrive asynchronously; stay in the loading state until we know either way.
    if (!settings) {
      return;
    }
    if (!noticesUrl) {
      setState({
        status: "error",
        message: "The notices file is not available on this account. It deploys with the app assets.",
      });
      return;
    }

    let ignore = false;
    async function load(url: string): Promise<void> {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const payload = (await response.json()) as NoticesPayload;
        if (!ignore) {
          setState({ status: "ready", payload });
        }
      } catch (err) {
        if (!ignore) {
          setState({ status: "error", message: err instanceof Error ? err.message : "Unknown error" });
        }
      }
    }

    void load(noticesUrl);
    return (): void => {
      ignore = true;
    };
  }, [settings, noticesUrl]);

  const entries =
    state.status === "ready"
      ? state.payload.entries.filter((entry) =>
          query ? entry.packages.some((name) => name.toLowerCase().includes(query.toLowerCase())) : true,
        )
      : [];

  return (
    <div className="p-4">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl text-slate-900 text-center">THIRD-PARTY NOTICES</h1>
        <p className="text-slate-600 mt-2 text-sm text-center">
          <a className="underline hover:text-slate-900" href="#/licenses">
            SuiteTools itself is licensed under GPL-3.0-or-later
          </a>
        </p>

        {state.status === "loading" && <p className="text-slate-600 mt-6 text-center">Loading notices…</p>}

        {state.status === "error" && (
          <div className="mt-6 rounded border border-amber-300 bg-amber-50 p-4">
            <p className="text-amber-900">Could not load the third-party notices.</p>
            <p className="text-amber-800 mt-1 text-sm">{state.message}</p>
            <p className="text-amber-800 mt-2 text-sm">
              The authoritative record is <code>THIRD_PARTY_NOTICES.md</code> in the SuiteTools repository.
            </p>
          </div>
        )}

        {state.status === "ready" && (
          <>
            <p className="text-slate-600 mt-4 text-center text-sm">
              {state.payload.packageCount} packages across {state.payload.entryCount} entries
            </p>
            <input
              className="mt-4 w-full rounded border border-slate-300 p-2 text-slate-900"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter by package name…"
              type="search"
              value={query}
            />
            {entries.length === 0 ? (
              <p className="text-slate-600 mt-6 text-center">No packages match “{query}”.</p>
            ) : (
              <ul className="mt-4 space-y-2">
                {entries.map((entry) => (
                  <li className="rounded border border-slate-200" key={entry.packages.join(",")}>
                    <details>
                      <summary className="cursor-pointer p-3 text-slate-900">
                        {entry.packages.join(", ")}
                        {entry.kind === "override" && (
                          <span className="text-slate-500 text-sm"> — no licence text shipped upstream</span>
                        )}
                      </summary>
                      {entry.source && (
                        <p className="text-slate-600 px-3 pb-2 text-sm break-all">Source: {entry.source}</p>
                      )}
                      {/* Verbatim licence text: exactness is the point, so no reflowing or markdown. */}
                      <pre className="text-slate-600 border-slate-100 border-t px-3 py-2 text-sm whitespace-pre-wrap">
                        {entry.text}
                      </pre>
                    </details>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
