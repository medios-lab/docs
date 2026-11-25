---
title: Workloads & Task Features
slug: /workloads
doc_type: concept
---

# Workloads & Task Features

A `TaskInfo` describes what a node executes, what resources it consumes, and how the executor supervises it.

## Guides in this section

- [Running Container Tasks](/workloads/containers) — launch OCI images on `medios` or `docker_shell` nodes.
- [Delivering Artifacts with URIs](/workloads/task-uris) — fetch executables, archives, and configs into the sandbox with `command.uris`.
- [Task Observers](/workloads/task-observers) — run sidecar observer commands beside a task.
- [Run Your First Observed Task](/workloads/first-observed-task) — five-minute observer tutorial.
- [Watch Task Output for NaN](/workloads/watch-for-nan) — detect training NaNs within a second.
- [Progress & Stall Detection](/workloads/progress-and-stalls) — report typed progress and kill stalled tasks automatically.
- [Task Finish Hooks](/workloads/finish-hooks) — run a bounded post-exit hook after the work command exits.
- [Budget LLM Token Spend with `medios-tokens`](/workloads/token-budget-tutorial) — hands-on tutorial for consumable token budgets, finish-hook settlement, and per-task scoped OpenRouter keys.
- [Multi-Node Gang Admission](/workloads/gang-admission) — reserve and launch multi-node jobs atomically.
