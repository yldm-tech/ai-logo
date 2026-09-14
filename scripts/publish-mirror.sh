#!/usr/bin/env bash
#
# Publishes the tarball that was just released as ai-logo a second time under the scoped name.
#
# semantic-release only knows about one package name, so the scoped copy is published separately from the same working tree. The version is whatever package.json holds after semantic-release has bumped it, which keeps the two names in lockstep.
#
# Usage:
#   scripts/publish-mirror.sh              # CI: auth comes from NPM_TOKEN
#   scripts/publish-mirror.sh --otp=123456 # local: account has 2FA on writes

set -euo pipefail

MIRROR_NAME='@yldm-tech/ai-logo'
PRIMARY_NAME='ai-logo'

VERSION=$(node -p "require('./package.json').version")

# A run where semantic-release decided not to release leaves package.json at the previous version, which is already on the registry under both names. Checking the primary name is what tells the two cases apart.
if ! npm view "${PRIMARY_NAME}@${VERSION}" version >/dev/null 2>&1; then
  echo "${PRIMARY_NAME}@${VERSION} is not on the registry — nothing was released, so there is nothing to mirror."
  exit 0
fi

if npm view "${MIRROR_NAME}@${VERSION}" version >/dev/null 2>&1; then
  echo "${MIRROR_NAME}@${VERSION} is already published."
  exit 0
fi

echo "Mirroring ${PRIMARY_NAME}@${VERSION} to ${MIRROR_NAME}"

# Restore package.json however this exits, so a failed publish cannot leave the tree renamed.
cleanup() {
  npx clean-package restore >/dev/null 2>&1 || true
  npm pkg set name="${PRIMARY_NAME}" >/dev/null 2>&1 || true
}
trap cleanup EXIT

npm pkg set name="${MIRROR_NAME}"

# clean-package strips scripts, devDependencies and publishConfig exactly as the prepack hook does for the primary package, so both tarballs carry the same manifest. --ignore-scripts then keeps prepack from running it a second time and from triggering another full build.
npx clean-package

# publishConfig is one of the fields clean-package removes, so access has to be passed explicitly — scoped packages default to restricted otherwise.
npm publish --ignore-scripts --access public "$@"

echo "Published ${MIRROR_NAME}@${VERSION}"
