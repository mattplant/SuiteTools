#!/usr/bin/env bash
set -euo pipefail

# Resolve paths from this script's own location rather than the caller's cwd, so the
# output lands in the repository root whether it is invoked via `yarn`, from this
# directory, or from anywhere else.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Workspaces whose runtime dependencies ship in SuiteTools distributions.
WORKSPACES=("frontend" "backend")
OUT_FILE="$REPO_ROOT/THIRD_PARTY_NOTICES.md"
OVERRIDE_DIR="$SCRIPT_DIR/overrides"

cd "$REPO_ROOT"

echo "✅ Third-party notices generation started."

# `yarn licenses generate-disclaimer` does the scoping natively, without touching
# node_modules:
#
#   --recursive   transitive dependencies, not just direct ones (the default is
#                 direct only, which omits most of what actually ships)
#   --production  runtime dependencies only, excluding devDependencies
#   --focus WS    restrict to the given workspaces
#
# See docs/guides/third-party-notices.md for why --recursive is the right scope.
FOCUS_ARGS=()
for WS in "${WORKSPACES[@]}"; do
  FOCUS_ARGS+=(--focus "$WS")
done

echo ">>> Generating disclaimer for: ${WORKSPACES[*]} (recursive, production only) ..."

{
  echo "# SuiteTools - Third-Party Notices"
  echo
  echo "This document lists the third-party packages included in SuiteTools distributions with their license terms."
  echo
  echo "-----"
  echo

  yarn licenses generate-disclaimer --recursive --production "${FOCUS_ARGS[@]}"

  # Packages that declare a licence but ship no licence file are omitted silently by
  # the plugin -- no warning, just a quietly incomplete compliance document. Hand-written
  # entries covering those live in ./overrides; see docs/guides/third-party-notices.md.
  shopt -s nullglob
  OVERRIDES=("$OVERRIDE_DIR"/*.md)
  shopt -u nullglob
  for f in "${OVERRIDES[@]}"; do
    echo
    echo "-----"
    echo
    cat "$f"
  done
} > "$OUT_FILE"

# Guards. This file is a compliance artifact, so failing loudly beats shipping a
# document that is quietly wrong.
if [ ! -s "$OUT_FILE" ]; then
  echo "❌ $OUT_FILE is empty." >&2
  exit 1
fi

# `--focus` scopes to the workspaces' dependencies and does not list the workspaces
# themselves. Verify rather than assume: a regression here would assert that
# SuiteTools is third-party to itself, and pull its own GPL-3.0 text into the file.
OWN_PACKAGES=$(yarn workspaces list --json | sed -n 's/.*"name":"\([^"]*\)".*/\1/p' | paste -sd '|' -)
if [ -n "$OWN_PACKAGES" ] && grep -qE "included in this product: ($OWN_PACKAGES)[,.]" "$OUT_FILE"; then
  echo "❌ $OUT_FILE lists a SuiteTools workspace as third-party." >&2
  exit 1
fi
if grep -q "SuiteTools is licensed under the GNU" "$OUT_FILE"; then
  echo "❌ $OUT_FILE contains SuiteTools' own licence text." >&2
  exit 1
fi

echo "✅ Wrote $OUT_FILE"
grep -c "^The following software may be included in this product:" "$OUT_FILE" \
  | awk '{print "Packages:", $1}'
wc -l "$OUT_FILE" | awk '{print "Lines:", $1}'
echo "✅ Third-party notices generated successfully."
