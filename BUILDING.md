# Building

Container files are provided in `container` providing CentOS Stream 8 and 9
environments to patch Node.js with the Insights client code and rebuild.

## Building the containers

Build arguments | Description
---|---
`UID` | The userid of the non-root user in the container.
`GID` | The groupid of the non-root user in the container. 
`NODEJS_VERSION` | The major version of Node.js to use.

e.g. For Node.js 20 and CentOS Stream 9:

```console
docker build --build-arg UID=$(id -u) --build-arg GID=$(id -g) --build-arg NODEJS_VERSION=20 --tag nodejs-insights-client-centos-stream-9:nodejs-20 container/centos-stream-9
```

or with `podman`:

```console
podman build --build-arg UID=$(id -u) --build-arg GID=$(id -g) --build-arg NODEJS_VERSION=20 --tag nodejs-insights-client-centos-stream-9:nodejs-20 container/centos-stream-9
```

## Using the container

Run `script/rebuild.sh` inside the container to:
1. Extract the Node.js source RPM.
2. Patch in the Insights client.
3. Update the RPM spec file to include the Insights client patch.
4. Rebuild the RPM and source RPM.

e.g. For Node.js 20 and CentOS Stream 9 assuming the current directory is the
base directory of this git repository:

```console
docker run -it --user $(id -u) -v $(pwd):/insights-js-client:Z -v $(pwd)/rpmbuild:/home/mockbuild/rpmbuild:Z nodejs-insights-client-centos-stream-9:nodejs-20 /insights-js-client/scripts/rebuild.sh "/nodejs*.src.rpm"
```

or with `podman` (note use of the `--userns` option to prevent `podman` from
changing ownership of the mounted directories):

```console
podman run -it --user $(id -u) -v $(pwd):/insights-js-client:Z -v $(pwd)/rpmbuild:/home/mockbuild/rpmbuild:Z --userns=keep-id nodejs-insights-client-centos-stream-9:nodejs-20 /insights-js-client/scripts/rebuild.sh /node*.src.rpm
```

The `rpmbuild` directory should be created first. Mounting this directory will
allow access to the built RPMs outside of the container.
