#!/usr/bin/env bash
set -euo pipefail

# Workspaces to include in the scan
WORKSPACES=("frontend" "backend")
TMP_DIR=".license-tmp"
OUT_FILE="THIRD_PARTY_LICENSES.md"

# Ensure temp dir is fresh
rm -rf "$TMP_DIR"
mkdir "$TMP_DIR"

echo "✅ Generate third-party licenses script started."

# 1. Loop workspaces → focus, generate, restore
for WS in "${WORKSPACES[@]}"; do
  echo ">>> Focusing runtime dependencies for $WS ..."
  YARN_ENABLE_SCRIPTS=false yarn workspaces focus "$WS" --production

  echo ">>> Generating license disclaimer for $WS ..."
  (
    cd "$WS"
    yarn licenses generate-disclaimer > "../$TMP_DIR/${WS}.md"
  )

  echo ">>> Restoring full install ..."
  yarn install
done

# 2. Combine and deduplicate identical blocks
echo ">>> Deduplicating licenses ..."
{
  echo "# SuiteTools - Third-Party Licenses"
  echo
  echo "This document lists the third-party packages included in SuiteTools distributions with their license terms."
  echo
  echo "-----"
  echo

  awk '
    BEGIN { RS="---\n"; ORS="---\n" }
    !seen[$0]++ { print }
  ' "$TMP_DIR"/*.md
} > "$OUT_FILE"

# 3. Summary
echo "✅ Wrote $OUT_FILE"
wc -l "$OUT_FILE" | awk '{print "Lines:", $1}'

# 4. Cleanup
rm -rf "$TMP_DIR"
echo "🧹 Cleaned up temporary files."
echo "✅ Generate third-party licenses generated successfully."
