---
title: Leader Election (etcd)
doc_type: how-to
---

# Configure Controller Leader Election with etcd

You end with two or more `medios-controller` instances contending for leadership through etcd v3 over HTTP/JSON, with nodes automatically following the active leader.

## Before you begin

- A reachable etcd v3 cluster exposing its HTTP/JSON gateway (for example `http://<etcd-host>:2379`).
- At least two controller hosts and one node host.

## 1. Start contending controllers

Start each controller with the same `--etcd` election URL:

```sh
medios-controller \
  --ip=<controller-1-ip> --port=5050 \
  --registry=leveldb \
  --work_dir=/var/lib/medios/controller \
  --etcd=etcd://<etcd-host>:2379/medios-prod
```

One controller wins the short-TTL lease and serves requests; standbys wait on the campaign. A deposed leader that loses its lease exits rather than split-braining.

:::warning Election coordinates leadership, not registry replication
Each `medios-controller` writes `--registry=leveldb` to its own local `--work_dir`; Medios does **not** replicate LevelDB state across standbys. After a failover to a different host, live node registrations and running tasks rebuild as nodes reregister and frameworks resubscribe, and frameworks reconcile task state with `RECONCILE`. However, registry-only records written on the former leader — such as operator maintenance schedules, dynamic role quotas/weights, or marked-gone node records — are not automatically mirrored to the standby's local LevelDB.
:::

## 2. Point nodes at the election URL

Start each `medios-node` with `--controller=etcd://<etcd-host>:2379/medios-prod`:

```sh
medios-node \
  --controller=etcd://<etcd-host>:2379/medios-prod \
  --ip=<node-ip> --port=5051 \
  --work_dir=/var/lib/medios/node \
  --launcher_dir=<medios-bin-dir>
```

## 3. Verify failover

Stop the active leader and verify that the standby returns HTTP `200` on `/health` and reports itself as the elected leader on `/state`:

```sh
curl -s -o /dev/null -w '%{http_code}\n' http://<standby-ip>:5050/health
```

```text
200
```

```sh
curl -s http://<standby-ip>:5050/state | jq '{leader, elected_time}'
```

## Clean up

Stop standby controllers and remove the election key prefix in etcd if retiring the cluster.

## What's next

- [Persistence & Controller Restart](/operations/persistence)
- [Upgrades & Rollback](/operations/upgrades)
