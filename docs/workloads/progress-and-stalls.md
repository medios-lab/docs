---
title: Progress & Stall Detection
doc_type: concept
---

# Progress & Stall Detection

Medios lets a task report structured progress on its status record and optionally enforces a stall window that either reports or kills tasks whose numeric progress stops advancing.

## Progress updates travel on `TaskStatus.progress`

A task writes structured progress lines to its `stdout` or a relative file inside its sandbox (by default matching `progress: ([0-9]*\.?[0-9]+), (.*)`, for example `progress: 50, epoch 5`). The executor samples new bytes on `sample_interval` (default `1000ms`), parses capture group 1 as a percent in `[0, 100]` (out-of-range values are dropped rather than clamped), increments a monotonic `sequence` counter, and emits `TASK_RUNNING` updates carrying `TaskStatus.progress` on a 5-second cadence.

The controller folds progress forward by `sequence`, so status updates that do not carry a newer progress report never overwrite the last recorded value.

## `TaskInfo.progress_policy` schema

When a task declares `progress_policy`, the controller validates the policy at submission time (`TASK_ERROR` with `REASON_TASK_INVALID` on invalid shapes) and the executor enforces it at runtime.

| Field | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `source` | `"STDOUT"` \| `"FILE"` | Yes | None | Where the executor reads progress lines: sandbox `stdout` (`STDOUT`) or a sandbox-relative file (`FILE`). |
| `path` | `string` | When `source` is `"FILE"` | None | Path relative to the task sandbox with no `..` components. Forbidden when `source` is `"STDOUT"`. |
| `pattern` | `string` | No | `progress: ([0-9]*\.?[0-9]+), (.*)` | ECMAScript regular expression applied to each line. Capture group 1 is percent in `[0, 100]`; optional capture group 2 is the progress message. |
| `sample_interval` | `DurationInfo` (`{"nanoseconds": ...}`) | No | `1000ms` (`1000000000` ns) | How often the executor reads new bytes from the source. Must be positive if set. |
| `stall_window` | `DurationInfo` (`{"nanoseconds": ...}`) | No | Unarmed | How long the numeric progress value may fail to advance before the task is declared stalled. Must be positive if set. Absent leaves the stall clock unarmed. |
| `action` | `"REPORT"` \| `"KILL"` | When `stall_window` is set | None | What the executor does when `stall_window` expires. Required when `stall_window` is set; forbidden when `stall_window` is absent. |

## Stall outcomes (`REPORT` vs. `KILL`)

- **`action: "REPORT"`** emits a `TASK_RUNNING` status update whose `message` starts with `REASON_PROGRESS_STALLED: no progress for ...` and leaves the task running. If progress later advances, the stall state resets for the next episode.
- **`action: "KILL"`** terminates the task through the task's kill-policy escalation (`SIGTERM`, grace period, then `SIGKILL`) and emits terminal state **`TASK_FAILED`** with reason **`REASON_PROGRESS_STALLED`**.
- Long-running services with no completion fraction omit `progress_policy`.

## Observers cannot spoof progress

Sidecar [Task Observers](/workloads/task-observers) write only the human-readable `progress.message`. They never alter the numeric progress value or reset the stall clock.

## Example

```json
{
  "name": "train-step",
  "task_id": {"value": "train-step-1"},
  "node_id": {"value": "<node-id>"},
  "principal": "team:ml-infra",
  "resources": [
    {"name": "cpus", "type": "SCALAR", "scalar": {"value": 2}},
    {"name": "mem", "type": "SCALAR", "scalar": {"value": 4096}}
  ],
  "command": {"shell": true, "value": "python3 -u train.py"},
  "progress_policy": {
    "source": "STDOUT",
    "sample_interval": {"nanoseconds": 10000000000},
    "stall_window": {"nanoseconds": 120000000000},
    "action": "KILL"
  }
}
```

## What's next

- [Task Observers](/workloads/task-observers)
- [Task Finish Hooks](/workloads/finish-hooks)
- [Task State Reasons](/reference/task-state-reasons)
