---
title: Persistence & Controller Restart
doc_type: how-to
---

# Persistence & Controller Restart

A Medios controller restart is a reconnection flow: running tasks continue executing on nodes while the controller restarts, and live state is rebuilt as nodes reregister and frameworks resubscribe.

## What survives a controller restart

| State | Survives with `--registry=in_memory` | Survives with `--registry=leveldb` |
| --- | --- | --- |
| Running tasks on nodes | Yes (nodes reregister and report tasks) | Yes |
| Dynamic reservations | Yes (checkpointed on nodes) | Yes |
| Node admissions, quota, weights, maintenance schedules | No | Yes (`<work_dir>/registry-leveldb`) |
| Outstanding unaccepted offers (including gang grants) | No (frameworks re-request) | No (frameworks re-request) |

## Enable durable registry state

Start `medios-controller` with `--registry=leveldb` and a durable `--work_dir`:

```sh
medios-controller \
  --ip=<controller-ip> --port=5050 \
  --registry=leveldb \
  --work_dir=/var/lib/medios/controller
```

## Back up the LevelDB registry

Stop the controller briefly or take a filesystem snapshot of `<work_dir>/registry-leveldb`:

```sh
sudo systemctl stop medios-controller
sudo tar -czf /var/backups/medios-registry-$(date +%Y%m%d).tar.gz \
  -C /var/lib/medios/controller registry-leveldb
sudo systemctl start medios-controller
```

## Restore from backup

```sh
sudo systemctl stop medios-controller
sudo rm -rf /var/lib/medios/controller/registry-leveldb
sudo tar -xzf /var/backups/medios-registry-<date>.tar.gz \
  -C /var/lib/medios/controller
sudo systemctl start medios-controller
```

Verify nodes reregister cleanly:

```sh
curl -s http://<controller-ip>:5050/nodes
```

## What's next

- [Leader Election (etcd)](/operations/leader-election)
- [Upgrades & Rollback](/operations/upgrades)
