#!/bin/sh

# Copyright Red Hat
# Builds containers for building the Insights client.

SCRIPTS_DIR=$(dirname $0)
if [ $# -lt 2 ]; then
  echo Usage: $(basename $0) RHEL_VERSIONS NODEJS_VERSIONS
  echo  e.g. $(basename $0) \"8 9\" \"18 20\"
  exit -1;
fi

build_container() {
  RHEL_VERSION=$1
  NODEJS_VERSION=$2
  BRANCH_NAME=$("${SCRIPTS_DIR}/getbranchfor.sh" "${RHEL_VERSION}" "${NODEJS_VERSION}")
  if [ -z "${BRANCH_NAME}" ]; then
    echo Could not find a branch for CentOS Stream/RHEL version \"${RHEL_VERSION}\" and Node.js version \"${NODEJS_VERSION}\".
    exit -2;
  fi
  TAG=insights-js-client-builder:nodejs-${NODEJS_VERSION}.el${RHEL_VERSION}
  docker build --build-arg "UID=$(id -u)" --build-arg "GID=$(id -g)" --build-arg "NODEJS_VERSION=${NODEJS_VERSION}" --build-arg "BRANCH=${BRANCH_NAME}" --tag "${TAG}" "container/centos-stream${RHEL_VERSION}"
}

RHEL_VERSIONS=$1
NODEJS_VERSIONS=$2
for RHEL_VERSION in ${RHEL_VERSIONS}; do
  for NODEJS_VERSION in ${NODEJS_VERSIONS}; do
    build_container "${RHEL_VERSION}" "${NODEJS_VERSION}"
  done
done
