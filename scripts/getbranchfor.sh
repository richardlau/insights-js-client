#!/bin/sh

# Copyright Red Hat
# Retrieve the most recent branch for the given CentOS Stream/RHEL and Node.js
# major versions.

NODEJS_GIT_URL=https://gitlab.com/redhat/centos-stream/rpms/nodejs.git
if [ $# -lt 2 ]; then
  echo Usage: $(basename $0) RHEL_VERSION NODEJS_VERSION
  exit -1;
fi
RHEL_VERSION=$1
NODEJS_VERSION=$2
git ls-remote --heads --sort=-version:refname "${NODEJS_GIT_URL}" "stream-nodejs-${NODEJS_VERSION}-rhel-${RHEL_VERSION}.*" | head -1 | cut -d '/' -f 3
