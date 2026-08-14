#!/usr/bin/env bash
set -euo pipefail

echo "🔄 Enabling Corepack…"
corepack enable

# No pinned version here: `packageManager` in package.json and `yarnPath` in
# .yarnrc.yml are the single source of truth. A hardcoded `yarn set version`
# went stale when #73 moved 4.9.2 -> 4.18.0 and silently downgraded Yarn.

echo "🧹 Removing installed dependencies…"
find . -name node_modules -maxdepth 3 -type d -prune -exec rm -rf {} +

echo "📦 Installing dependencies (with cache check)…"
yarn install --check-cache

echo "🛠 Rebuilding all workspaces…"
yarn workspaces foreach --all run build

echo "✅ Monorepo reset complete — Yarn $(yarn --version)"
