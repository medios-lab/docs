---
title: Installation
slug: /installation
doc_type: concept
---

# Installation

Medios scales from a single workstation on loopback to a hardened multi-host cloud cluster by toggling daemon flags rather than swapping components. Choose the deployment mode that matches your network trust boundary before installing.

## Deployment modes

| Mode | Topology | Trust boundary | Key controls |
| --- | --- | --- | --- |
| **Mode 1: Standalone Laptop** | Controller and node on `127.0.0.1` under one OS user | Host OS user boundary | `--registry=in_memory`, `--switch_user=false`, `--http_executor_domain_sockets=true` |
| **Mode 2: Private Lab / Overlay** | One controller + Linux/macOS nodes on WireGuard or Tailscale | Encrypted overlay subnet + host firewall | `--registry=leveldb`, `--switch_user=true`, explicit `TaskInfo.principal` |
| **Mode 3: Cloud / Multi-Host** | Controller and nodes across untrusted networks or behind an edge gateway | mTLS + authenticated HTTP + ACLs + kernel isolators | `LIBPROCESS_SSL_ENABLED=true`, `--http_authenticators=basic` (or `trusted_header`), `--authorizers=local`, Linux hardening isolators |

## Installation paths

- [Requirements](/installation/requirements) — OS, runtime libraries, ports, and kernel support.
- [Install Binaries](/installation/install) — pre-built release archives for macOS `arm64` and Linux `x86_64` and `arm64`.
- [Docker Compose](/installation/docker) — run a networked controller and node inside containers.
- [Build from Source](/installation/build-from-source) — compile with CMake, Ninja, and ccache.
- [Uninstalling Medios](/installation/uninstall) — stop daemons and clean host state.

## What's next

- [Security](/security) — full flag templates for Modes 1, 2, and 3
