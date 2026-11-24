---
title: Metrics & Diagnostics Endpoints
doc_type: reference
---

# Metrics & Diagnostics Endpoints

HTTP inspection endpoints exposed by both `medios-controller` (default port `5050`) and `medios-node` (default port `5051`).

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/health` | `GET` | Liveness check (`200 OK`). |
| `/version` | `GET` | JSON build version, git SHA, and build metadata. |
| `/state` | `GET` | Full JSON state snapshot of the daemon (including `flags`). |
| `/flags` | `GET` | Active startup flags as JSON. |
| `/metrics/snapshot` | `GET` | Flat JSON map of all current daemon counters and gauges for Prometheus or custom scrapers. |
| `/system/stats.json` | `GET` | Host CPU, load average, and memory statistics. |
| `/logging/toggle` | `GET` / `POST` | Temporarily raise verbosity (`?level=1&duration=60secs`). |
| `/openapi.json` | `GET` | Embedded OpenAPI 3.x specification (`/.well-known/openapi.json` alias). |

## Example: read metrics snapshot

```sh
curl -s http://<controller>:5050/metrics/snapshot
```

## Key controller metrics (`medios-controller`)

| Metric key | Type | Description |
| --- | --- | --- |
| `controller/elected` | Gauge (`0` or `1`) | `1` if this controller is the active elected leader. |
| `controller/uptime_secs` | Gauge | Seconds since `medios-controller` started. |
| `controller/nodes_connected` / `controller/nodes_disconnected` | Gauge | Number of connected vs. disconnected nodes. |
| `controller/nodes_active` / `controller/nodes_inactive` / `controller/nodes_unreachable` | Gauge | Active, deactivated, and unreachable node counts. |
| `controller/frameworks_connected` / `controller/frameworks_active` | Gauge | Connected and active framework counts. |
| `controller/outstanding_offers` | Gauge | Unaccepted offers currently held by frameworks. |
| `controller/tasks_staging` / `controller/tasks_starting` / `controller/tasks_running` / `controller/tasks_killing` / `controller/tasks_unreachable` | Gauge | Current live task counts by non-terminal state. |
| `controller/tasks_finished` / `controller/tasks_failed` / `controller/tasks_killed` / `controller/tasks_error` / `controller/tasks_dropped` / `controller/tasks_lost` / `controller/tasks_gone` / `controller/tasks_gone_by_operator` | Counter | Cumulative terminal task counts by state. |
| `controller/valid_status_updates` / `controller/invalid_status_updates` | Counter | Valid vs. invalid status updates processed by the controller. |
| `controller/invalid_task_progress_reports` / `controller/invalid_task_finish_outcomes` | Counter | Dropped malformed `TaskStatus.progress` or `TaskStatus.finish` payloads. |
| `controller/dropped_messages` | Counter | Messages dropped by the controller actor. |
| `controller/event_queue_messages` / `controller/event_queue_dispatches` / `controller/event_queue_http_requests` | Gauge | Pending actor event queue depth by category. |
| `controller/node_registrations` / `controller/node_reregistrations` / `controller/node_removals` | Counter | Cumulative node lifecycle transitions. |

## Key node metrics (`medios-node`)

| Metric key | Type | Description |
| --- | --- | --- |
| `node/registered` | Gauge (`0` or `1`) | `1` if this node is registered with the leading controller. |
| `node/uptime_secs` | Gauge | Seconds since `medios-node` started. |
| `node/recovery_errors` | Counter | Container or state recovery errors encountered at startup. |
| `node/frameworks_active` | Gauge | Active frameworks with tasks or executors on this node. |
| `node/tasks_staging` / `node/tasks_starting` / `node/tasks_running` / `node/tasks_killing` | Gauge | Current live tasks on this node. |
| `node/tasks_finished` / `node/tasks_failed` / `node/tasks_killed` / `node/tasks_lost` / `node/tasks_gone` | Counter | Cumulative terminal tasks on this node. |
| `node/executors_registering` / `node/executors_running` / `node/executors_terminating` / `node/executors_terminated` | Gauge / Counter | Executor lifecycle counts on this node. |
| `node/container_launch_errors` | Counter | Containers that failed to launch or were rejected by the containerizer. |
| `node/valid_status_updates` / `node/invalid_status_updates` | Counter | Valid vs. invalid status updates handled by the node. |
| `node/invalid_task_progress_reports` / `node/invalid_task_finish_outcomes` | Counter | Dropped malformed progress reports or finish-hook outcomes. |
| `node/cpus_total` / `node/cpus_used` / `node/cpus_percent` | Gauge | Declared, allocated, and utilization percentage for `cpus` (same pattern for `gpus`, `mem`, and `disk`). |

## What's next

- [OpenAPI Discovery & Specs](/api/openapi)
- [Security](/security) — protecting diagnostic endpoints with `--authenticate_http_readonly=true`
