---
title: Requirements
doc_type: reference
---

# Requirements

Host prerequisites for running `medios-controller` and `medios-node`.

## Supported operating systems

| Platform | Support level | Notes |
| --- | --- | --- |
| Linux (`x86_64`, `arm64`) | Full production support | Supports `linux` launcher, cgroups v1/v2, namespaces, capabilities, seccomp, GPU module, and bind-mounted stores. |
| macOS (`arm64`, Apple Silicon) | Local development & node | Uses `posix` launcher; Linux cgroups and mount namespaces are not available. |

Windows is not supported.

## Runtime dependencies

- **OpenSSL 3 runtime library:** Required on every host running `medios-node` (used by `medios-fetcher` for `https://` URIs) and for TLS-enabled builds.
- **Docker CLI and reachable daemon (optional):** Required only on nodes configured with `--containerizers=docker_shell`. Not required for `--containerizers=medios`.
- **Linux kernel features (Mode 3 hardening):** cgroups v1 or v2, mount/PID/IPC namespaces, `no_new_privs`, and seccomp.

## Network ports

| Port (default) | Daemon | Direction | Purpose |
| --- | --- | --- | --- |
| `5050/tcp` | `medios-controller` | Inbound from nodes, frameworks, operators | Scheduler API, Operator API, OpenAPI, node registration |
| `5051/tcp` | `medios-node` | Inbound from controller, frameworks (sandbox reads) | Executor API, `/files/read`, `/stores/<name>`, `/state` |
| Ephemeral TCP (`LIBPROCESS_PORT`) | Both | Daemon-to-daemon | Internal libprocess transport when not pinned |
| `31000-32000/tcp` (default `ports` resource) | `medios-node` | Inbound to tasks | Host ports reserved by frameworks for listening tasks |

## Helper binaries on every node

The directory passed to `medios-node --launcher_dir=<dir>` must contain:

- `medios-executor` — required for bare command tasks
- `medios-docker-executor` — required when `--containerizers=docker_shell`
- `medios-default-executor` — required for `LAUNCH_GROUP` task groups
- `medios-fetcher` — required for tasks using `command.uris`
- `medios-containerizer` — required when `--containerizers=medios`

## What's next

- [Install Binaries & Images](/installation/install)
- [Build from Source](/installation/build-from-source)
