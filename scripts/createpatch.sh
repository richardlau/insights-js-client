#!/bin/bash

# Copyright Red Hat
# Unpack nodejs SRPM and generate/update patch for Insights client.

source_root=$(dirname $0)/..
rpmbuild_root=${HOME}/rpmbuild
spec_file=${rpmbuild_root}/SPECS/nodejs.spec

usage() {
  echo "Usage: $(basename $0) <srpm> <input patch file> <output patch file>"
  exit
}

if [ -z "$1" -o -z "$2" -o -z "$3" ]; then
  usage
fi

srpm=$1
patch_file=$2
output_file=$3
rpm -i $1
rpmbuild -bp "${spec_file}"
build_dir=$(awk -f "${source_root}/scripts/getbuilddir.awk" "${spec_file}")
base_build_dir=${build_dir}.orig

pushd "${rpmbuild_root}/BUILD/${build_dir}"
# If the Insights client is already in the source, remove it.
# First attempt to reverse the patch (if it already exists).
patch -p1 -s -f -R --merge -i "${patch_file}" || true
# Remove the Insights client files.
# For now, assumes all files in the "redhat" directory are for the client.
rm -rf "${rpmbuild_root}/BUILD/${build_dir}/lib/internal/redhat/"
popd

# Copy the "cleaned" source tree so we can diff against it later on.
rm -rf "${rpmbuild_root}/BUILD/${base_build_dir}"
cp -R "${rpmbuild_root}/BUILD/${build_dir}" "${rpmbuild_root}/BUILD/${base_build_dir}"

# Patch source and copy Insight client.
pushd "${rpmbuild_root}/BUILD/${build_dir}"
patch -p1 -s -f --merge -i "${patch_file}"
popd
cp -R "${source_root}/lib" "${rpmbuild_root}/BUILD/${build_dir}"

# Generate patch.
pushd "${rpmbuild_root}/BUILD"
diff -Npru "${base_build_dir}" "${build_dir}" >"${output_file}"
popd

