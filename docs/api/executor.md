---
title: Executor HTTP API
doc_type: reference
---

# Executor HTTP API

`POST /api/v1/executor` on `medios-node` is used by custom executors to subscribe to the node, receive `LAUNCH` / `LAUNCH_GROUP` / `KILL` / `SHUTDOWN` events, and emit `UPDATE` status messages. Most frameworks use the built-in `medios-executor` or `medios-docker-executor` and do not need a custom executor.

## Calls

| Call `type` | Purpose |
| --- | --- |
| `SUBSCRIBE` | Opens the RecordIO event stream and replays unacknowledged updates and unacknowledged tasks on recovery. |
| `UPDATE` | Reports a `TaskStatus` change with a unique `uuid` until acknowledged by the node. |
| `MESSAGE` | Sends opaque bytes back to the framework via the node and controller. |

## Events

| Event `type` | Trigger |
| --- | --- |
| `SUBSCRIBED` | Confirms executor registration with `executor_info`, `framework_info`, and `node_info`. |
| `LAUNCH` | Instructs the executor to run one `TaskInfo`. |
| `LAUNCH_GROUP` | Instructs the executor to run an atomic `TaskGroupInfo`. |
| `KILL` | Requests termination of a running task with an optional `kill_policy`. |
| `ACKNOWLEDGED` | Confirms receipt of an executor `UPDATE` by `task_id` and `uuid`. |
| `MESSAGE` | Delivers opaque bytes from the framework. |
| `SHUTDOWN` | Instructs the executor to terminate all tasks and exit. |
| `ERROR` | Signals a fatal protocol error. |

## Executor environment variables

See [Environment Variables](/reference/env-variables) for the full list of variables injected into executors and finish hooks by `medios-node`.

## What's next

- [Task Lifecycle & Sandboxes](/architecture/task-lifecycle)
- [OpenAPI Discovery & Specs](/api/openapi)
