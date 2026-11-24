---
title: Known Issues
slug: /known-issues
doc_type: reference
---

# Known Issues

Concrete platform constraints and workarounds.

## `medios-execute` fails on macOS with `Failed to obtain the IP address`

libprocess resolves the host's hostname at startup to choose a listening IP. On macOS machines whose hostname is not in DNS or `/etc/hosts`, prefix the command with `LIBPROCESS_IP=127.0.0.1`:

```sh
LIBPROCESS_IP=127.0.0.1 medios-execute --controller=127.0.0.1:5050 --name=hello --command='echo hi'
```

Pure-HTTP frameworks using `/api/v1/scheduler` are unaffected.

## Tasks immediately fail with `TASK_LOST` and no executor logs

Two common causes:

1. **`FrameworkInfo.user` does not exist on the node:** When `--switch_user=true`, the node calls `setuid` before launching the executor. Pass a real OS account present on every node.
2. **Missing `--launcher_dir` on `medios-node`:** Command tasks require `medios-executor` inside `--launcher_dir`.

## `docker_shell` rejects `LAUNCH_GROUP` task groups

`LAUNCH_GROUP` runs under `medios-default-executor`, which supports nested `MEDIOS` containers only. Submitting a task group with `container.type = DOCKER` fails validation with `TASK_ERROR` and `REASON_TASK_GROUP_INVALID`.

## `medios` containerizer ignores OCI image `User`

The in-tree `medios` containerizer runs tasks as the OS user specified by `FrameworkInfo.user` / `CommandInfo.user` (when `--switch_user=true`) rather than the image's `USER` directive, and does not populate `HOME`.

## `command.uris` `cache` flag is accepted but ignored

Medios always fetches URIs fresh into the task sandbox (`BYPASS_CACHE`). Cache artifacts at your HTTP server or in your framework if needed.

## Lossy cgroups inside Docker on macOS

Running `medios-node` inside a Linux VM on macOS validates the API loop but does not provide production-fidelity cgroup isolation. Test isolation on native Linux.
