#!/bin/sh

# Copyright Red Hat
# Inserts the patch for the Insights client if it is not already present.

AWK_SCRIPT=$(dirname $0)/patchspec.awk
SPEC_FILE=~/rpmbuild/SPECS/nodejs.spec
PATCH_LINE="Patch100: 0100-Add-insights-client.patch"
# If the patch isn't already included in the spec file, add after other patches.
if ! grep -q "^${PATCH_LINE}" "${SPEC_FILE}"; then
  awk -i /usr/share/awk/inplace.awk -v "PATCH_LINE=${PATCH_LINE}" -f "${AWK_SCRIPT}" "${SPEC_FILE}"
fi
