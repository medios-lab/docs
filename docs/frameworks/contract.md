---
title: Scheduler Contract & Best Practices
doc_type: concept
---

# Scheduler Contract & Best Practices

Every well-behaved Medios framework follows eight operational rules on `/api/v1/scheduler`.

## 1. Send `Medios-Stream-Id` and handle `307` / `400` responses

- The `SUBSCRIBE` response returns a `Medios-Stream-Id` HTTP header. Pass that exact header on every subsequent `ACCEPT`, `DECLINE`, `ACKNOWLEDGE`, `SUPPRESS`, `REVIVE`, `KILL`, `RECONCILE`, and `TEARDOWN` request.
- **`400 Bad Request`:** returned when `Medios-Stream-Id` is missing or no longer matches the framework's active subscription stream (for example, after a reconnect or failover), or when the `Call` fails validation. Re-open the `SUBSCRIBE` stream with your saved `framework_id` if the stream ID became stale.
- **`307 Temporary Redirect`:** returned by a standby (non-leading) controller in an etcd HA cluster, with a `Location` header pointing to the current leader. Follow the redirect or re-target the leader URL before resubscribing.

## 2. Carve resources from the offer with identity intact

An offered `Resource` carries role, reservation, allocation info, `shared`, resource provider, and `metadata` fields. Carve only the scalar quantity (or pick port sub-ranges) out of the offered resource object rather than constructing a fresh `Resource` with the same name. For shared dataset stores (`store/<name>`), copy the offered shared resource verbatim into `TaskInfo.resources`.

## 3. Do not hoard offers

- Decline every offer you do not accept, passing a refuse filter (for example `refuse_seconds: 120`).
- Decline offers if your `ACCEPT` call fails locally before launch.
- Call `SUPPRESS` when your queue is empty and `REVIVE` when new work arrives.

## 4. Provide a real node `user` and a valid `TaskInfo.principal`

- `FrameworkInfo.user` must be an OS user that exists on every node running your tasks; an unknown user fails tasks with `TASK_LOST` on default `--switch_user=true` nodes.
- `TaskInfo.principal` is required on every task and must match `operator:<name>`, `team:<name>`, or `run:<name>`.

## 5. Acknowledge every `UPDATE` carrying a `uuid`

Status updates are delivered at-least-once. Send `ACKNOWLEDGE` with `node_id`, `task_id`, and `uuid` promptly so the node stops retransmitting.

## 6. Declare `GPU_RESOURCES` and `SHARED_RESOURCES` capabilities

On `medios-controller`, both `--filter_gpu_resources` and `--filter_shared_resources` default to `false`, meaning GPU-bearing nodes and shared `store/<name>` resources are offered to all frameworks unless an operator opts into capability filtering:

- When a cluster sets **`--filter_gpu_resources=true`**, the allocator excludes every resource on a GPU-bearing node — including its CPUs and memory — from frameworks that do not declare `GPU_RESOURCES` in `FrameworkInfo.capabilities`.
- When a cluster sets **`--filter_shared_resources=true`** (and always for `CREATE` shared persistent volumes), the allocator strips shared resources (`store/<name>`) from offers unless the framework declares `SHARED_RESOURCES` in `FrameworkInfo.capabilities`.

Declare `GPU_RESOURCES` and `SHARED_RESOURCES` in `FrameworkInfo.capabilities` whenever your framework targets GPU or store-enabled clusters so it behaves identically regardless of controller filter flags.

## 7. Handle all terminal task states

Treat all of the following states as terminal in your framework state machine: `TASK_FINISHED`, `TASK_FAILED`, `TASK_KILLED`, `TASK_ERROR`, `TASK_DROPPED`, `TASK_LOST`, `TASK_GONE`, and `TASK_GONE_BY_OPERATOR`.

## 8. Survive restarts with `failover_timeout` and `RECONCILE`

Persist your `framework_id` and subscribe with a non-zero `failover_timeout`. On restart, resubscribe with the saved `framework_id` and send `RECONCILE` to re-learn current task states. Without a non-zero `failover_timeout`, the controller tears down running tasks immediately when the stream closes.

## What's next

- [Go SDK](/go-sdk) — reference implementation of every rule above
- [Scheduler HTTP API](/api/scheduler)
- [Shared Dataset Stores](/operations/stores)
