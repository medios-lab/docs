---
title: Node Maintenance & Draining
doc_type: how-to
---

# Drain and Maintain a Node

You end with a node cleanly deactivated or drained through `/api/v1` (the controller Operator API) so you can patch, reboot, or reconfigure hardware without disrupting scheduling.

## Before you begin

- A reachable controller at `http://<controller>:5050`.
- The target `<node-id>` from `GET /nodes`.

## 1. Stop new offers on a node (`DEACTIVATE_NODE`)

Deactivating a node prevents the controller from offering its resources to frameworks while letting existing tasks finish:

```sh
curl -s -X POST http://<controller>:5050/api/v1 \
  -H 'Content-Type: application/json' \
  -d '{"type":"DEACTIVATE_NODE","deactivate_node":{"node_id":{"value":"<node-id>"}}}'
```

## 2. Drain running tasks (`DRAIN_NODE`)

To actively drain a node before maintenance, send `DRAIN_NODE` with a grace period:

```sh
curl -s -X POST http://<controller>:5050/api/v1 \
  -H 'Content-Type: application/json' \
  -d '{
    "type": "DRAIN_NODE",
    "drain_node": {
      "node_id": {"value": "<node-id>"},
      "max_grace_period": {"seconds": 60}
    }
  }'
```

## 3. Return the node to service (`REACTIVATE_NODE`)

After maintenance finishes, reactivate the node so offers resume:

```sh
curl -s -X POST http://<controller>:5050/api/v1 \
  -H 'Content-Type: application/json' \
  -d '{"type":"REACTIVATE_NODE","reactivate_node":{"node_id":{"value":"<node-id>"}}}'
```

## Clean up

Confirm the node appears active in `GET_NODES` and resumes emitting offers.

## What's next

- [Operator HTTP API](/api/operator)
- [Upgrades & Rollback](/operations/upgrades)
