---
title: Upgrades & Rollback
doc_type: how-to
---

# Upgrade and Roll Back a Cluster

You end with controller and node daemons running a new Medios release while preserving running workloads, with a documented rollback path.

## Before you begin

- Back up `<work_dir>/registry-leveldb` on the controller (see [Persistence & Controller Restart](/operations/persistence)).
- Verify your new release binaries include matching helper binaries (`medios-executor`, `medios-docker-executor`, `medios-fetcher`, `medios-containerizer`) for `--launcher_dir`.

## 1. Upgrade the controller first

Replace the `medios-controller` binary and restart the service:

```sh
sudo systemctl restart medios-controller
curl -s http://<controller-ip>:5050/version
```

Nodes retain their running executors and automatically reregister with the restarted controller.

## 2. Upgrade nodes one at a time

How running tasks behave across a `medios-node` restart depends on the configured containerizer:

- **`--containerizers=medios`:** `medios-node` checkpoints executor state and recovers running containers after restart, so rolling upgrades can restart `medios-node` while tasks continue running (optional `DEACTIVATE_NODE` stops new offers during the restart).
- **`--containerizers=docker_shell`:** `docker_shell` is intentionally stateless across `medios-node` restarts and does **not** re-attach to running Docker containers. Tasks interrupted by a `medios-node` restart transition to `TASK_LOST` / `TASK_FAILED`. Drain `docker_shell` nodes first with `DRAIN_NODE` (see [Node Maintenance & Draining](/operations/maintenance)) before restarting `medios-node`.

For each node, deactivate or drain as appropriate, replace `medios-node` and the helper binaries in `--launcher_dir`, and restart `medios-node`:

```sh
sudo systemctl restart medios-node
curl -s http://<node-ip>:5051/version
```

Check that the node rejoined the controller:

```sh
curl -s http://<controller-ip>:5050/nodes
```

## Roll back an upgrade

1. Restore the previous binaries on the affected nodes and restart `medios-node`.
2. Restore the previous `medios-controller` binary. If the registry format changed, restore the pre-upgrade `registry-leveldb` backup before starting `medios-controller`.
3. Verify `/version` and `/nodes` on the controller.

## What's next

- [Node Maintenance & Draining](/operations/maintenance)
- [Release Notes](/release-notes/v1.0.x)
