#!/usr/bin/env bash
set -euo pipefail

echo "🔄 Enabling Corepack…"
corepack enable

echo "📌 Ensuring Yarn 4.9.2 is active…"
yarn set version 4.9.2

echo "📦 Installing dependencies (with cache check)…"
yarn install --check-cache

echo "🛠 Rebuilding all workspaces…"
yarn workspaces foreach --all run build

echo "✅ Monorepo reset complete — Yarn $(yarn --version)"
