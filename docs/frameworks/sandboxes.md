---
title: Reading Task Sandboxes
doc_type: how-to
---

# Read Task Output from a Node Sandbox

Status updates report lifecycle transitions (`TASK_RUNNING`, `TASK_FINISHED`), not what a task printed. You read `stdout`, `stderr`, and generated files from the node's `/files/read` HTTP endpoint.

## Before you begin

- Your framework recorded `node_id`, `framework_id`, `executor_id`, and `container_id` (from the first `TASK_RUNNING` update).
- The node advertises a network-reachable address (a node bound to `127.0.0.1` is unreachable from remote frameworks).

## 1. Locate the node address

Query the controller for the node's HTTP address:

```sh
curl -s http://<controller>:5050/nodes
```

## 2. Discover the node's `work_dir`

Query the node's own `/state` endpoint and read `flags.work_dir`:

```sh
curl -s http://<node-host>:5051/state
```

## 3. Read `stdout` via `/files/read`

Construct the sandbox path:

```text
<node-work-dir>/nodes/<node-id>/frameworks/<framework-id>/executors/<executor-id>/runs/<container-id>/stdout
```

Fetch chunks (up to 64 KiB per request) using `/files/read`:

```sh
curl -s "http://<node-host>:5051/files/read?path=<url-encoded-path>&offset=0&length=65536"
```

```json
{"data": "hello-medios\n", "offset": 0}
```

## What's next

- [Go SDK: Packages & Helpers](/go-sdk/packages) — automatic node resolution and chunked UTF-8 tailing via `sandbox.Resolver`
- [Task Lifecycle & Sandboxes](/architecture/task-lifecycle)
