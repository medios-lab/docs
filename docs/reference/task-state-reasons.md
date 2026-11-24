---
title: Task State Reasons
doc_type: reference
---

# Task State Reasons

Common `TaskStatus.Reason` values emitted by Medios on terminal and non-terminal status updates. Frameworks should branch on `state` and `reason` rather than parsing free-form prose, while logging `message` for operators.

## Pre-launch validation (`TASK_ERROR` / `TASK_DROPPED`)

`REASON_TASK_INVALID`
: The submitted `TaskInfo` failed validation at the controller or containerizer (for example, mismatched containerizer type, missing `TaskInfo.principal`, invalid observer name, or store unit exhaustion). Inspect `message` and fix the task before resubmitting.

`REASON_TASK_GROUP_INVALID`
: A `LAUNCH_GROUP` task group failed validation (for example, carrying `container.type = DOCKER`, which is unsupported on task groups).

`REASON_TASK_UNAUTHORIZED`
: The framework principal is not authorized by `LocalAuthorizer` to run the task or act for the declared `TaskInfo.principal`.

`REASON_CONTAINER_LAUNCH_FAILED`
: The node containerizer failed to prepare or launch the container before the work command started.

## Execution failures (`TASK_FAILED` / `TASK_KILLED`)

`REASON_COMMAND_EXECUTOR_FAILED`
: The work command exited with a non-zero exit code or signal.

`REASON_PROGRESS_STALLED`
: Set on `TASK_FAILED` when a task with `TaskInfo.progress_policy` (`action: "KILL"`) failed to advance its reported numeric progress within `stall_window`. With `action: "REPORT"`, the task stays in `TASK_RUNNING` and the stall explanation is reported in `message`.

`REASON_CONTAINER_LIMITATION_MEMORY`
: The task exceeded its cgroup memory limit and was killed by the Linux OOM killer.

`REASON_CONTAINER_LIMITATION_DISK`
: The task exceeded its enforced sandbox disk quota (`disk/du` isolator).

`REASON_MAX_COMPLETION_TIME_REACHED`
: Set on `TASK_FAILED` when the task exceeded `TaskInfo.max_completion_time` and was terminated by the executor.

## Node connectivity and lifecycle (`TASK_UNREACHABLE` / `TASK_GONE` / `TASK_LOST`)

`REASON_NODE_DISCONNECTED`
: The node lost contact with the controller; the task may still be running.

`REASON_NODE_REMOVED`
: The node failed health checks past the removal timeout or was marked gone.

`REASON_RECONCILIATION`
: Returned in response to a framework `RECONCILE` call reporting the controller's current record for the task.

## What's next

- [Task Lifecycle & Sandboxes](/architecture/task-lifecycle)
- [Scheduler HTTP API](/api/scheduler)
