#!/bin/bash

# Copyright Red Hat
# Update Insights client into nodejs package and rebuild.

script_root=$(dirname $0)
source_root=${script_root}/..
rpmbuild_root=${HOME}/rpmbuild
out_patch_file="${rpmbuild_root}/SOURCES/0100-Add-insights-client.patch"
spec_file=${rpmbuild_root}/SPECS/nodejs.spec

usage() {
  echo "Usage: $(basename $0) <srpm>"
  exit
}

if [ -z "$1" ]; then
  usage
fi

srpm=$1
major=$(rpm -qp --queryformat="%{VERSION}" "${srpm}" | cut -d "." -f 1)
patch_file=${source_root}/patches/v${major}.x.patch

# Create the patch to insert the Insights client.
"${script_root}/createpatch.sh" "${srpm}" "${patch_file}" "${out_patch_file}"

# Patch the spec file to include the patch for the Insights client.
"${script_root}/patchspec.sh"

# Rebuild the RPM and SRPM.
rpmbuild -ba --with=bundled "${spec_file}"
