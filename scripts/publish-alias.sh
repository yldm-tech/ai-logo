#!/usr/bin/env bash
#
# Publishes packages/alias under the unscoped name `ai-logo`, at the version that was just released as @yldm-tech/ai-logo.
#
# The alias is a few hundred bytes: one `export * from "@yldm-tech/ai-logo"` and a dependency on that exact version. It exists so the unscoped name stays installable and keeps pointing at the real package, rather than being a second copy of the build that drifts from it.
#
# semantic-release only knows about the root package, so this runs after it, from the same working tree. The version comes from the root package.json after semantic-release has bumped it, which keeps the two names in lockstep.
#
# Call it only for a version that has just been published under the scoped name; it does not verify that itself.
#
# Usage:
#   scripts/publish-alias.sh              # CI: auth comes from NPM_TOKEN
#   scripts/publish-alias.sh --otp=123456 # local: account has 2FA on writes

set -euo pipefail

ALIAS_NAME='ai-logo'
PRIMARY_NAME='@yldm-tech/ai-logo'
ALIAS_DIR='packages/alias'

VERSION=$(node -p "require('./package.json').version")

# Whether a release happened is decided by the caller — the workflow compares package.json before and after semantic-release. It deliberately is not decided by asking the registry whether the primary name has this version: this runs seconds after the publish that puts it there, and npm takes longer than that to make a new version visible, so such a check reports "no release" for every real release.
if npm view "${ALIAS_NAME}@${VERSION}" version >/dev/null 2>&1; then
  echo "${ALIAS_NAME}@${VERSION} is already published."
  exit 0
fi

echo "Publishing ${ALIAS_NAME}@${VERSION} as an alias for ${PRIMARY_NAME}@${VERSION}"

cd "${ALIAS_DIR}"

# Restore the manifest however this exits, so a failed publish cannot leave the workspace link rewritten as a fixed version.
cleanup() {
  npm pkg set version="0.0.0" >/dev/null 2>&1 || true
  npm pkg set "dependencies.${PRIMARY_NAME}"="workspace:*" >/dev/null 2>&1 || true
}
trap cleanup EXIT

npm pkg set version="${VERSION}"

# In the repository this is `workspace:*` so pnpm links the local build. npm publish would ship that protocol verbatim and the published package would be uninstallable, so pin it to the exact version that just went out. Exact, not a range: the alias promises to be that build and nothing else.
npm pkg set "dependencies.${PRIMARY_NAME}"="${VERSION}"

# publishConfig already carries access: public, but pass it explicitly so the command does not depend on that field surviving.
npm publish --ignore-scripts --access public "$@"

echo "Published ${ALIAS_NAME}@${VERSION}"
