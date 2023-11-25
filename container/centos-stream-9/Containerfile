FROM quay.io/centos/centos:stream9
ARG UID=1000
ARG GID=1000
ARG NODEJS_VERSION=20
RUN groupadd -g $GID mock
RUN useradd -d /home/mockbuild -m -g $GID -u $UID -s /bin/bash mockbuild
RUN dnf install -y dnf-plugins-core rpm-build libicu-devel python-unversioned-command
RUN dnf config-manager -y --set-enabled crb && \
  dnf install -y epel-release epel-next-release && \
  dnf install -y dumb-init
RUN dnf module enable -y nodejs:$NODEJS_VERSION && \
  dnf download -y --source nodejs && \
  dnf builddep -y nodejs
ENTRYPOINT [ "/usr/bin/dumb-init", "--" ]
