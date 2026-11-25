---
title: Install Binaries
doc_type: how-to
---

# Install Binaries

Each Medios release on [GitHub Releases](https://github.com/medios-lab/medios/releases) carries one archive per platform, each with a `.sha256` file:

| Platform | Archive |
| --- | --- |
| macOS `arm64` | `medios-<commit>-darwin-arm64.tar.gz` |
| Linux `x86_64` | `medios-<commit>-linux-amd64.tar.gz` |
| Linux `arm64` | `medios-<commit>-linux-arm64.tar.gz` |

`<commit>` is the full commit the release was built from; the release page lists the exact names. No container images are published; to run Medios in containers, see [Docker Compose](/installation/docker).

## Download and verify

```sh
VERSION=v0.1.14
COMMIT=51a5f22e95d35ea56d3faead48be5d41ccbfbbf1
PLATFORM=linux-amd64         # or linux-arm64, darwin-arm64
NAME=medios-$COMMIT-$PLATFORM
BASE=https://github.com/medios-lab/medios/releases/download/$VERSION

curl -fsSLO $BASE/$NAME.tar.gz
curl -fsSLO $BASE/$NAME.tar.gz.sha256
shasum -a 256 -c $NAME.tar.gz.sha256      # or: sha256sum -c $NAME.tar.gz.sha256
```

Stop if the check does not print `OK`.

## Unpack

Unpack into any directory you own; nothing needs root:

```sh
mkdir -p <install-prefix>
tar -xzf $NAME.tar.gz -C <install-prefix> --strip-components 1
```

The archive unpacks to:

```text
<install-prefix>/
├── bin/                      # pass as --launcher_dir
│   ├── medios-controller
│   ├── medios-node
│   ├── medios-execute
│   ├── medios-executor
│   ├── medios-default-executor
│   ├── medios-docker-executor
│   ├── medios-containerizer
│   ├── medios-fetcher
│   ├── medios-io-switchboard
│   └── medios-tcp-connect
├── lib/                      # shared libraries the binaries load
└── medios-build.json         # commit, platform, compiler and build host
```

The binaries find `lib/` relative to their own location, so keep the two directories together. `medios-node` needs the helper executors, so pass `--launcher_dir=<install-prefix>/bin`.

## Verify

```sh
<install-prefix>/bin/medios-controller --version
cat <install-prefix>/medios-build.json
```

Then follow the [Quick-Start Guide](/quick-start) from step 2.

## What's next

- [Docker Compose](/installation/docker)
- [Build from Source](/installation/build-from-source)
- [Uninstalling Medios](/installation/uninstall)
