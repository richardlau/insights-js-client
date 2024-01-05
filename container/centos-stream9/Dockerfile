# Copyright Red Hat

# "common" takes no build args so it can be cached between different variants.
FROM quay.io/centos/centos:stream9 as common
RUN dnf install -y dnf-plugins-core rpm-build libicu-devel python-unversioned-command && \
  dnf config-manager -y --set-enabled crb && \
  dnf install -y epel-release epel-next-release && \
  dnf clean -y all

FROM common as builder
ARG BRANCH=stream-nodejs-20-rhel-9.3.0
RUN dnf install -y git centpkg && \
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
ARG CCACHE_COMPRESSION=true
COPY --from=builder /nodejs-*.src.rpm /
RUN groupadd -g $GID mock && \
  useradd -d /home/mockbuild -m -g $GID -u $UID -s /bin/bash mockbuild && \
  dnf install -y ccache dumb-init && \
  dnf module enable -y nodejs:$NODEJS_VERSION && \
  dnf builddep -y /nodejs*.src.rpm && \
  dnf clean -y all
ENV PATH "/usr/lib64/ccache:$PATH"
USER mockbuild
RUN ccache --set-config=cache_dir=/home/mockbuild/.cache/ccache && \
  ccache --set-config=compression=$CCACHE_COMPRESSION
ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]
