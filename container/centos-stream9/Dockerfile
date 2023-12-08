FROM quay.io/centos/centos:stream9
ARG UID=1000
ARG GID=1000
ARG NODEJS_VERSION=20
ARG BRANCH=stream-nodejs-20-rhel-9.3.0
RUN groupadd -g $GID mock
RUN useradd -d /home/mockbuild -m -g $GID -u $UID -s /bin/bash mockbuild
RUN dnf install -y dnf-plugins-core git rpm-build libicu-devel python-unversioned-command
RUN dnf config-manager -y --set-enabled crb && \
  dnf install -y epel-release epel-next-release && \
  dnf install -y centpkg dumb-init
RUN dnf module enable -y nodejs:$NODEJS_VERSION
RUN cd /tmp && \
  git clone https://gitlab.com/redhat/centos-stream/rpms/nodejs.git -b $BRANCH && \
  cd /tmp/nodejs && \
  centpkg srpm -- --with=bundled && \
  mv nodejs-*.src.rpm / && \
  dnf builddep -y /nodejs*.src.rpm && \
  rm -rf /tmp/nodejs
ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]
