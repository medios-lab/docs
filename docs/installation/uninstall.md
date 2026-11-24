---
title: Uninstalling Medios
doc_type: how-to
---

# Uninstalling Medios

You end with all Medios daemons stopped and all local controller, node, and sandbox state removed from a host.

## Before you begin

- Drain or stop any running workloads on the node so tasks exit cleanly (see [Node Maintenance & Draining](/operations/maintenance)).

## 1. Stop the daemons

If running under `systemd`:

```sh
sudo systemctl stop medios-node medios-controller
sudo systemctl disable medios-node medios-controller
```

If running in the foreground, send `SIGTERM` (`Ctrl-C`) to `medios-node` and `medios-controller`.

## 2. Remove state and runtime directories

Remove the directories you configured with `--work_dir` and `--runtime_dir`:

```sh
sudo rm -rf /var/lib/medios /var/run/medios
```

For Mode 1 loopback setups:

```sh
rm -rf "$HOME/.medios" /tmp/medios-controller /tmp/medios-node
```

## 3. Remove binaries and unit files

Remove the installed binaries from `<install-prefix>` and any service unit files under `/etc/systemd/system/medios-*.service` (Linux) or `~/Library/LaunchAgents/dev.medios.*.plist` (macOS), then reload the service manager:

```sh
sudo systemctl daemon-reload
```

## What's next

- [Installation](/installation)
