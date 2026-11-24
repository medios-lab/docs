---
title: Containerizers & Isolation
doc_type: concept
---

# Containerizers & Isolation

A Medios node runs exactly one containerizer, selected at startup by `--containerizers`. The containerizer is a property of the cluster or node pool, not of an individual task.

## Two supported containerizers

| `--containerizers` value | Runtime mechanism | Accepted `TaskInfo.container` shapes | Resource enforcement (`cpus`/`mem`/`disk`) | Node restart recovery |
| --- | --- | --- | --- | --- |
| `medios` (default) | In-tree containerizer; pulls OCI images directly from registries without `dockerd` | Absent (bare command via `medios-executor`) or `type: MEDIOS` (`type: DOCKER` is refused) | Enforced via `--isolation` (`cgroups/cpu`, `cgroups/mem`, `disk/du`, or `posix/*`) | Checkpoints executors and recovers running containers across `medios-node` restarts |
| `docker_shell` | Forks `medios-docker-executor`, which invokes the host `docker` CLI (`docker run`, `stop`, `kill`) | `type: DOCKER` only (absent or `type: MEDIOS` is refused) | Accounted by the controller only; `cpus`, `mem`, and `disk` are not passed as Docker limits | Stateless: does not re-attach to Docker containers across `medios-node` restarts (`TASK_LOST` / `TASK_FAILED`) |

Passing multiple comma-separated containerizers is rejected at node startup. Submitting a task whose `container.type` does not match the node's configured containerizer fails immediately with `TASK_ERROR` and `REASON_TASK_INVALID`.

`LAUNCH_GROUP` task groups run under `medios-default-executor` and require `type: MEDIOS`; the controller rejects task groups carrying `type: DOCKER` with `TASK_ERROR` and `REASON_TASK_GROUP_INVALID`.

## Volumes

On both `medios` and `docker_shell`, `TaskInfo.container.volumes` accepts **declared `STORE` volumes only** (`source.type = "STORE"`). Arbitrary `HOST_PATH` bind mounts and all other volume sources are refused at validation time with `TASK_ERROR` (`REASON_TASK_INVALID`).

- Under `medios` on Linux, `STORE` volumes require `--launcher=linux` and `--isolation=filesystem/linux` (kernel bind mounts in a private mount namespace, with `MS_RDONLY` remount for `RO`). On macOS/POSIX, `--launcher=posix` and `--isolation=filesystem/posix` deliver `STORE` volumes as relative sandbox symlinks (declare `"readers": 0` because symlinks cannot enforce read-only access).
- Under `docker_shell`, `medios-docker-executor` resolves `STORE` volumes against the node's `--stores` file and passes `--volume <host>:<container>[:ro]` to `docker run`.

See [Shared Dataset Stores](/operations/stores) for the exact declaration schema and locking semantics.

## Linux isolation and POSIX rlimits

On Linux hosts, the `medios` containerizer enforces resource and security boundaries through `--isolation`:

- **cgroups v1 and v2:** CPU, memory, and device isolation.
- **Namespaces & security:** `filesystem/linux`, `namespaces/pid`, `namespaces/ipc`, `linux/capabilities`, `linux/nnp`, `linux/seccomp`, and `disk/du`.
- **GPU isolation:** operator-declared GPU devices via the `com_medioslab_medios_gpu` (`libmedios_gpu`) isolator module.
- **POSIX rlimits:** per-process `setrlimit` constraints (`ContainerInfo.rlimit_info` or `medios-execute --rlimits=<json>`) applied immediately before `execvp`.

`docker_shell` does not run Medios isolators; it maps supported task fields (`docker.network`, `ports`, `gpus`, `STORE` volumes, allowlisted `docker.parameters`, `ipc_mode: PRIVATE`, `shm_size`) directly to `docker run` arguments.

## What's next

- [Task, Container & Observer Fields](/reference/task-fields) — exact field support matrix per containerizer
- [Running Container Tasks](/workloads/containers)
- [Shared Dataset Stores](/operations/stores)
- [Linux Hardening & Isolators](/security/hardening)
