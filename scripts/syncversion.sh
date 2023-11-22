#!/bin/bash

# Copyright Red Hat
# Update the version embedded in the client source code to match what is in
# package.json.

source_root=$(dirname $0)/..
source_file=lib/internal/redhat/insights.js
if [ -z "$npm_new_version" ]; then
  client_version=$(jq .version "${source_root}"/package.json)
else
  client_version=\"$npm_new_version\"
fi

sed -E "s/^(const RH_INSIGHTS_VERSION = )(.*)$/\1${client_version};/g" <<FILE >"${source_root}"/"${source_file}"
$(cat "${source_root}"/"${source_file}")
FILE

if [ "$npm_lifecycle_event" = "preversion" ]; then
  git add "${source_file}"
fi
