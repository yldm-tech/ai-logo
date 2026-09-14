#!/usr/bin/env bash
#
# Publishes the four static asset packages at the version that was just released as @yldm-tech/ai-logo.
#
# These carry the rendered SVG, PNG, WebP and avatar files that getLobeIconCDN's `unpkg` and `aliyun`
# hosts resolve. Both hosts serve npm, so those two branches of a public API only work if these are
# actually published — before this they pointed at the upstream project's packages, which do not
# contain any icon this fork added.
#
# The versions in the repository are 0.0.0 placeholders. Publishing at the root version keeps every
# name in the set on one number, which is what lets the CDN helper hardcode `@latest` and what lets a
# consumer pin all of them together.
#
# Call it only for a version that has just been published under the main name; it does not verify that
# itself. It is idempotent: a package already published at this version is skipped, so a rerun after a
# partial failure completes the set rather than erroring.
#
# Usage:
#   scripts/publish-static.sh              # CI: auth comes from NPM_TOKEN
#   scripts/publish-static.sh --otp=123456 # local: account has 2FA on writes

set -euo pipefail

FORMATS=(svg png webp avatar)

VERSION=$(node -p "require('./package.json').version")

published=0
skipped=0

for format in "${FORMATS[@]}"; do
  name="@yldm-tech/ai-logo-static-${format}"
  dir="packages/static-${format}"

  if npm view "${name}@${VERSION}" version >/dev/null 2>&1; then
    echo "${name}@${VERSION} is already published."
    skipped=$((skipped + 1))
    continue
  fi

  echo "Publishing ${name}@${VERSION}"

  (
    cd "${dir}"
    # Restore the placeholder however this subshell exits, so a failed publish cannot leave a real
    # version number committed into the working tree.
    trap 'npm pkg set version="0.0.0" >/dev/null 2>&1 || true' EXIT
    npm pkg set version="${VERSION}"
    # These packages have no build and no scripts; --ignore-scripts keeps it that way if one is ever added.
    npm publish --ignore-scripts --access public "$@"
  )

  published=$((published + 1))
done

echo "Static packages: ${published} published, ${skipped} already at ${VERSION}."
