---
title: Scheduler HTTP API
doc_type: reference
---

# Scheduler HTTP API

`POST /api/v1/scheduler` on `medios-controller` accepts `Call` messages and streams `Event` messages over RecordIO-framed JSON or Protobuf.

## Connection contract

1. Open a long-lived `POST /api/v1/scheduler` with `Content-Type: application/json`, `Accept: application/json` (or `application/x-protobuf`), and a `{"type": "SUBSCRIBE", ...}` body. The controller streams RecordIO-framed `Event` messages with `Content-Type: application/json` (or `application/x-protobuf`) — do **not** send `Accept: application/recordio` or `Message-Accept` to `/api/v1/scheduler`.
2. Read the `Medios-Stream-Id` response header and save the `framework_id` from the initial `SUBSCRIBED` event.
3. Send every subsequent call on a separate `POST /api/v1/scheduler` request carrying `Medios-Stream-Id: <stream-id>` and `framework_id`. Accepted calls return `202 Accepted` with an empty body.
4. Handle non-2xx control-plane responses explicitly:
   - `307 Temporary Redirect`: the controller is a standby in an HA cluster; follow the `Location` header to the active leader.
   - `400 Bad Request`: missing or stale `Medios-Stream-Id`, or invalid `Call` payload. Resubscribe with your saved `framework_id` if the stream ID became stale.
   - `406 Not Acceptable`: unsupported `Accept` header (must allow `application/json` or `application/x-protobuf`).

## Calls

| Call `type` | Purpose |
| --- | --- |
| `SUBSCRIBE` | Opens the event stream and registers (or reregisters) the framework. |
| `TEARDOWN` | Unregisters the framework and terminates all of its tasks. |
| `ACCEPT` | Accepts one or more `offer_ids` with `LAUNCH` or `LAUNCH_GROUP` operations. |
| `DECLINE` | Returns unused `offer_ids` to the allocator with optional `filters.refuse_seconds`. |
| `REVIVE` | Clears refuse filters and resumes offer flow for specified roles. |
| `SUPPRESS` | Pauses offer flow while the framework has no pending work. |
| `KILL` | Requests termination of a running `task_id` on `node_id`. |
| `SHUTDOWN` | Shuts down a custom `executor_id` on `node_id`. |
| `ACKNOWLEDGE` | Acknowledges a `TaskStatus` update by `node_id`, `task_id`, and `uuid`. |
| `RECONCILE` | Queries current state of specific tasks (or all tasks when the list is empty). |
| `REQUEST` | Requests an atomic multi-node gang allocation. |
| `MESSAGE` | Sends opaque data to a custom executor. |
| `UPDATE_FRAMEWORK` | Updates mutable fields of `FrameworkInfo` without tearing down. |

## Events

| Event `type` | Trigger |
| --- | --- |
| `SUBSCRIBED` | Confirms subscription with `framework_id` and `heartbeat_interval_seconds`. |
| `OFFERS` | Delivers one or more `Offer` records (or an atomic gang grant). |
| `RESCIND` | Withdraws a previously sent offer before it was accepted. |
| `UPDATE` | Delivers a `TaskStatus` transition (must be acknowledged when `uuid` is set). |
| `MESSAGE` | Delivers opaque data sent by a custom executor. |
| `FAILURE` | Reports executor or node failure. |
| `ERROR` | Reports an unrecoverable framework error; the stream closes afterward. |
| `HEARTBEAT` | Periodic liveness signal on the subscribe stream. |

## Example: accept an offer

```json
{
  "type": "ACCEPT",
  "framework_id": {"value": "<framework-id>"},
  "accept": {
    "offer_ids": [{"value": "<offer-id>"}],
    "operations": [{
      "type": "LAUNCH",
      "launch": {
        "task_infos": [{
          "name": "hello",
          "task_id": {"value": "hello-1"},
          "node_id": {"value": "<node-id>"},
          "principal": "operator:alice",
          "resources": [
            {"name": "cpus", "type": "SCALAR", "scalar": {"value": 0.5}},
            {"name": "mem", "type": "SCALAR", "scalar": {"value": 128}}
          ],
          "command": {"shell": true, "value": "echo hello"}
        }]
      }
    }]
  }
}
```

Response: `202 Accepted`, empty body.

## What's next

- [OpenAPI Discovery & Specs](/api/openapi)
- [RecordIO Framing](/api/recordio)
- [Scheduler Contract & Best Practices](/frameworks/contract)
