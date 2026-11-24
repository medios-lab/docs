---
title: Operator HTTP API
doc_type: reference
---

# Operator HTTP API

`POST /api/v1` on `medios-controller` and `medios-node` provides cluster inspection and maintenance operations. Medios keeps this surface intentionally minimal; observability dashboards and automation build externally on these calls.

## Controller operator calls

| Call `type` | Purpose |
| --- | --- |
| `GET_HEALTH` | Returns `200 OK` when the controller is healthy. |
| `GET_VERSION` | Returns build version and git revision. |
| `GET_FLAGS` | Returns active controller startup flags. |
| `GET_METRICS` | Returns current controller metric counters and gauges. |
| `GET_LOGGING_LEVEL` / `SET_LOGGING_LEVEL` | Reads or temporarily adjusts verbosity level. |
| `GET_STATE` | Returns full cluster snapshot (nodes, frameworks, tasks, executors). |
| `GET_NODES` | Lists registered, drained, and unreachable nodes. |
| `GET_FRAMEWORKS` | Lists connected and completed frameworks. |
| `GET_TASKS` | Lists active and completed tasks. |
| `GET_EXECUTORS` | Lists active executors across nodes. |
| `GET_ROLES` | Lists active roles, weights, and allocations. |
| `GET_QUOTA` / `UPDATE_QUOTA` | Reads or updates role resource guarantees/limits. |
| `GET_WEIGHTS` / `UPDATE_WEIGHTS` | Reads or updates allocator role weights. |
| `RESERVE_RESOURCES` / `UNRESERVE_RESOURCES` | Manages dynamic role reservations on a node. |
| `GET_MAINTENANCE_STATUS` / `GET_MAINTENANCE_SCHEDULE` / `UPDATE_MAINTENANCE_SCHEDULE` / `START_MAINTENANCE` / `STOP_MAINTENANCE` | Manages planned maintenance windows. |
| `DRAIN_NODE` / `DEACTIVATE_NODE` / `REACTIVATE_NODE` / `MARK_NODE_GONE` | Controls node draining and lifecycle state. |

## Example: query cluster nodes

```sh
curl -s -X POST http://<controller>:5050/api/v1 \
  -H 'Content-Type: application/json' \
  -d '{"type": "GET_NODES"}'
```

Response: `200 OK` with JSON `{"type": "GET_NODES", "get_nodes": {"nodes": [...]}}`.

## What's next

- [OpenAPI Discovery & Specs](/api/openapi)
- [Node Maintenance & Draining](/operations/maintenance)
