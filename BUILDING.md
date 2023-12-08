# Building

Container files are provided in `container` providing CentOS Stream 8 and 9
environments to patch Node.js with the Insights client code and rebuild.

## Building the containers

### Scripted

Run `scripts/buildcontainer.sh`, passing in the versions of CentOS Stream/RHEL
and Node.js to use.

e.g. For Node.js 20 and CentOS Stream/RHEL 9:

```console
./scripts/buildcontainer.sh 9 20
```

or to build multiple containers, wrap the versions in quotes and separate with
a space character, e.g. the following command will combine the arguments to
build four containers:

```console
./scripts/buildcontainer.sh "8 9" "18 20"
```

The built containers will be tagged as follows:
```console
insights-js-client-builder:nodejs-<nodejs_version>.el<centos_stream_version>`
```

### Manually

Alternatively, to manually build the container, use `docker build` with the
following arguments:

Build arguments | Description
---|---
`UID` | The userid of the non-root user in the container.
`GID` | The groupid of the non-root user in the container. 
`BRANCH` | The branch from https://gitlab.com/redhat/centos-stream/rpms/nodejs to use.
`NODEJS_VERSION` | The major version of Node.js to use.

e.g. For Node.js 20 and CentOS Stream 9:

```console
docker build --build-arg UID=$(id -u) --build-arg GID=$(id -g) --build-arg NODEJS_VERSION=20 --branch stream-nodejs-20-rhel-9.3.0 --tag insights-js-client-builder:nodejs-20.el9 container/centos-stream9
```

or with `podman`:

```console
podman build --build-arg UID=$(id -u) --build-arg GID=$(id -g) --build-arg NODEJS_VERSION=20 --branch stream-nodejs-20-rhel-9.3.0 --tag insights-js-client-builder:nodejs-20.el9 container/centos-stream9
```

## Using the containers

Run `script/rebuild.sh` inside the container to:
1. Extract the Node.js source RPM.
2. Patch in the Insights client.
3. Update the RPM spec file to include the Insights client patch.
4. Rebuild the RPM and source RPM.

e.g. For Node.js 20 and CentOS Stream 9 assuming the current directory is the
base directory of this git repository:

```console
docker run --rm -it --user $(id -u) -v $(pwd):/insights-js-client:Z -v $(pwd)/rpmbuild:/home/mockbuild/rpmbuild:Z insights-js-client-builder:nodejs-20.el9 /insights-js-client/scripts/rebuild.sh "/nodejs*.src.rpm"
```

or with `podman` (note use of the `--userns` option to prevent `podman` from
changing ownership of the mounted directories):

```console
podman run --rm -it --user $(id -u) -v $(pwd):/insights-js-client:Z -v $(pwd)/rpmbuild:/home/mockbuild/rpmbuild:Z --userns=keep-id insights-js-client-builder:nodejs-20.el9 /insights-js-client/scripts/rebuild.sh /node*.src.rpm
```

The `rpmbuild` directory should be created first. Mounting this directory will
allow access to the built RPMs outside of the container.
