# Copyright Red Hat

# "common" takes no build args so it can be cached between different variants.
FROM quay.io/centos/centos:stream8 as common
RUN dnf install -y dnf-plugins-core rpm-build libicu-devel && \
  dnf config-manager -y --set-enabled powertools && \
  dnf install -y epel-release epel-next-release && \
  dnf clean -y all

FROM common as builder
ARG BRANCH=stream-nodejs-20-rhel-8.9.0
RUN dnf install -y centpkg && \
  dnf clean -y all && \
  cd /tmp && \
  git clone https://gitlab.com/redhat/centos-stream/rpms/nodejs.git -b $BRANCH && \
  cd /tmp/nodejs && \
  centpkg srpm -- --with=bundled && \
  mv nodejs-*.src.rpm / && \
  rm -rf /tmp/nodejs

FROM common
ARG UID=1000
ARG GID=1000
ARG NODEJS_VERSION=20
COPY --from=builder /nodejs-*.src.rpm /
RUN groupadd -g $GID mock && \
  useradd -d /home/mockbuild -m -g $GID -u $UID -s /bin/bash mockbuild && \
  dnf install -y dumb-init && \
  dnf module enable -y nodejs:$NODEJS_VERSION && \
  dnf builddep -y /nodejs*.src.rpm && \
  dnf clean -y all
ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]
