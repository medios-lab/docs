---
title: Cluster Operations
slug: /operations
doc_type: concept
---

# Cluster Operations

Day-1 and Day-2 procedures for operating a Medios controller and node fleet.

## Operational guides

- [Persistence & Controller Restart](/operations/persistence) — `in_memory` vs. `leveldb`, restart reconnection semantics, and registry backup/restore.
- [Leader Election (etcd)](/operations/leader-election) — run standby controllers with automatic lease-based failover.
- [Upgrades & Rollback](/operations/upgrades) — upgrade controller, node, and executor binaries safely.
- [Node Maintenance & Draining](/operations/maintenance) — schedule maintenance windows, drain nodes, and control node allowlists.
- [Declaring GPUs & Hardware](/operations/gpus) — configure operator-declared GPU units with `libmedios_gpu` or `docker_shell`.
- [Shared Dataset Stores](/operations/stores) — declare shared `store/<name>` dataset resources with reader/writer units.
